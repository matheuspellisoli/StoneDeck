import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { StoneDeckIR, SlotContent, ListItem, TableCell, getLayout, ExportPlugin, LayoutSlot, SlideStyle } from '@stonedeck/core';

export class PdfPlugin implements ExportPlugin {
    name = "PDF Plugin";
    version = "1.0.0";

    /**
     * Generates a PDF from the provided IR.
     * Canvas size: 720x405 pt (16:9)
     */
    async generate(ir: StoneDeckIR, outputPath: string): Promise<void> {
        return PdfPluginStatic.generate(ir, outputPath);
    }
}

class PdfPluginStatic {
    static async generate(ir: StoneDeckIR, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const doc = new PDFDocument({
                        size: [720, 405],
                        margins: { top: 0, left: 0, bottom: 0, right: 0 },
                        autoFirstPage: false
                    });

                    const stream = fs.createWriteStream(outputPath);
                    doc.pipe(stream);

                    for (const [index, slide] of ir.slides.entries()) {
                        doc.addPage();

                        // 1. Render Background
                        await this.renderBackground(doc, slide.style, ir.basePath);

                        // 2. Render Optional Title
                        const layout = getLayout(slide.layout_id, slide.slots.length);
                        let yOffset = 0;
                        if (slide.title) {
                            const hasTitleSlot = layout?.slots.some((s: LayoutSlot) => s.id === 'title');
                            if (!hasTitleSlot) {
                                this.renderOptionalTitle(doc, slide.title, slide.style);
                                yOffset = 60;
                            }
                        }

                        // 3. Render Slots
                        if (layout) {
                            for (const [slotIdx, content] of slide.slots.entries()) {
                                const slotDef = layout.slots[slotIdx];
                                if (slotDef) {
                                    await this.renderSlotContent(doc, content, slotDef, slide.style, ir, yOffset);
                                }
                            }
                        } else {
                            console.warn(`Layout ${slide.layout_id} not found for slide ${index + 1}`);
                        }
                    }

                    doc.end();
                    stream.on('finish', resolve);
                    stream.on('error', reject);
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    private static async renderBackground(doc: PDFKit.PDFDocument, style: SlideStyle, basePath: string): Promise<void> {
        const bg = style.background;
        if (!bg) {
            doc.rect(0, 0, 720, 405).fill('#FFFFFF');
            return;
        }

        if (bg.type === 'color' && bg.value) {
            doc.rect(0, 0, 720, 405).fill(bg.value);
        } else if (bg.type === 'gradient' && bg.colors) {
            const grad = doc.linearGradient(0, 0, 0, 405);
            bg.colors!.forEach((c: string, i: number) => {
                grad.stop(i / (bg.colors!.length - 1), c);
            });
            doc.rect(0, 0, 720, 405).fill(grad);
        } else if (bg.type === 'image' && bg.src) {
            try {
                const imgBuffer = await this.resolveImageBuffer(bg.src, basePath);
                if (imgBuffer) {
                    const options: Record<string, unknown> = {
                        align: 'center',
                        valign: 'center'
                    };
                    if (bg.fit === 'cover') {
                        options.cover = [720, 405];
                    } else {
                        options.fit = [720, 405];
                    }
                    doc.image(imgBuffer, 0, 0, options);
                }
            } catch (e) {
                console.warn('Failed to render background image', e);
                doc.rect(0, 0, 720, 405).fill('#EEEEEE'); // Fallback
            }
        }
    }

    private static async renderSlotContent(doc: PDFKit.PDFDocument, content: SlotContent, slot: LayoutSlot, style: SlideStyle, ir: StoneDeckIR, yOffset: number = 0): Promise<void> {
        const fontSize = style.font_size || 18;
        const fontFamily = style.font_family || 'Helvetica';
        const color = style.color || '#000000';

        let drawY = slot.y + yOffset;
        const bottomLimit = 405 - 15;
        const availableHeight = bottomLimit - drawY;
        let safeHeight = Math.min(slot.height, availableHeight);

        let contentX = slot.x;
        let contentWidth = slot.width;

        // Full Bleed Override (Top/Bottom/Right)
        if (style.full_bleed && content.type === 'image') {
            drawY = 0;
            safeHeight = 405; // Full Canvas Height
            contentWidth = 720 - contentX; // Extend to Right Edge
        }

        let contentY = drawY;

        if (style.card && slot.id !== 'title' && slot.id !== 'subtitle' && !(style.full_bleed && content.type === 'image')) {
            const card = style.card;
            const radius = parseFloat(card.radius || '0');

            if (card.shadow) {
                doc.save()
                    .fillColor('#000000', 0.1)
                    .roundedRect(slot.x + 2, drawY + 2, slot.width, safeHeight, radius)
                    .fill()
                    .restore();
            }

            doc.save();
            if (card.background) doc.fillColor(card.background);
            else doc.fillColor('#FFFFFF');

            if (card.border) {
                const [widthPart, , colorPart] = card.border.split(' ');
                const borderWidth = parseFloat(widthPart || '1');
                const borderColor = colorPart || '#CCCCCC';
                doc.lineWidth(borderWidth).strokeColor(borderColor);
                doc.roundedRect(slot.x, drawY, slot.width, safeHeight, radius).fillAndStroke();
            } else {
                doc.roundedRect(slot.x, drawY, slot.width, safeHeight, radius).fill();
            }
            doc.restore();

            contentX += 10;
            contentY += 10;
            contentWidth -= 20;
        }

        const hAlign = style.card?.content_align?.horizontal || style.content_align?.horizontal || 'left';

        doc.fillColor(color).font(fontFamily);

        if (content.type === 'markdown') {
            const lines = content.raw.split(/\r?\n/);
            let currentY = contentY;

            for (const line of lines) {
                let text = line.trim();
                if (!text) {
                    currentY += fontSize;
                    continue;
                }

                const imgMatch = text.match(/^!\[(.*?)\]\((.*?)\)$/);
                if (imgMatch) {
                    const src = imgMatch[2]!;
                    try {
                        const imgBuffer = await this.resolveImageBuffer(src, ir.basePath);
                        if (imgBuffer) {
                            const imgOpts: Record<string, unknown> = {
                                align: 'center',
                                valign: 'center'
                            };
                            if (style.image_fit === 'cover') {
                                // For cover in a slot, we need dimensions. 
                                // PDFKit 'cover' option works with [w, h]
                                imgOpts.cover = [contentWidth, safeHeight];
                            } else {
                                imgOpts.fit = [contentWidth, safeHeight - (currentY - drawY)];
                            }

                            doc.image(imgBuffer, contentX, currentY, imgOpts);
                            currentY += 150;
                        }
                    } catch (_e) {
                        // warning
                    }
                    continue;
                }

                let currentFontSize = fontSize;
                let currentFont = fontFamily;

                const h3Match = text.match(/^###\s+(.*)$/);
                const h2Match = text.match(/^##\s+(.*)$/);
                const h1Match = text.match(/^#\s+(.*)$/);

                if (h3Match) {
                    text = h3Match[1]!;
                    currentFontSize = fontSize * 1.2;
                    currentFont = PdfPluginStatic.resolveBoldFont(fontFamily);
                } else if (h2Match) {
                    text = h2Match[1]!;
                    currentFontSize = fontSize * 1.4;
                    currentFont = PdfPluginStatic.resolveBoldFont(fontFamily);
                } else if (h1Match) {
                    text = h1Match[1]!;
                    currentFontSize = fontSize * 1.8;
                    currentFont = PdfPluginStatic.resolveBoldFont(fontFamily);
                }

                if (slot.id === 'number') {
                    currentFontSize = fontSize * 6;
                    currentFont = PdfPluginStatic.resolveBoldFont(fontFamily);
                }

                const listMatch = text.match(/^(\s*)([-*+])\s+(.*)$/);
                if (listMatch) {
                    const indentLevel = Math.floor(listMatch[1]!.length / 2);
                    const bulletChar = this.getBulletChar(listMatch[2] === '-' ? 'dash' : 'dot');
                    const contentText = listMatch[3]!;
                    const indent = (indentLevel + 1) * 20;
                    const spacing = 8;
                    const bulletBoxWidth = 15;
                    const bulletBoxX = contentX + indent - bulletBoxWidth - spacing;

                    doc.font(fontFamily).fontSize(fontSize).fillColor(color);
                    doc.text(bulletChar, bulletBoxX, currentY, { width: bulletBoxWidth, align: 'right' });

                    const consumedHeight = this.renderStyledText(doc, contentText, contentX + indent, currentY, contentWidth - indent, 'left', fontFamily, fontSize, color);
                    currentY += consumedHeight + 5;
                    continue;
                }

                const consumedHeight = this.renderStyledText(doc, text, contentX, currentY, contentWidth, hAlign, currentFont, currentFontSize, color);
                currentY += consumedHeight + 5;
            }
        } else if (content.type === 'list') {
            let currentY = contentY;
            content.items.forEach((item: ListItem) => {
                const indent = (item.level - 1) * 20;
                const bullet = this.getBulletChar(item.bullet_type);
                doc.fontSize(fontSize * 0.9);
                doc.text(bullet, contentX + indent, currentY, { width: 20 });
                const textWidth = contentWidth - indent - 20;
                const consumedHeight = this.renderStyledText(doc, item.text, contentX + indent + 20, currentY, textWidth, 'left', fontFamily, fontSize * 0.9, color);
                currentY += consumedHeight + 5;
            });
        } else if (content.type === 'table') {
            this.renderTable(doc, content.rows, { ...slot, x: contentX, y: contentY, width: contentWidth }, style);
        } else if (content.type === 'image') {
            try {
                const imgBuffer = await this.resolveImageBuffer(content.src, ir.basePath);
                if (imgBuffer) {
                    const imgOpts: Record<string, unknown> = {
                        align: 'center',
                        valign: 'center'
                    };
                    if (style.image_fit === 'cover' || (style.card && style.card.image_fit === 'cover')) {
                        imgOpts.cover = [contentWidth, safeHeight - (style.card ? 20 : 0)];
                    } else {
                        imgOpts.fit = [contentWidth, safeHeight - (style.card ? 20 : 0)];
                    }
                    doc.image(imgBuffer, contentX, contentY, imgOpts);
                }
            } catch (_e) {
                doc.fontSize(10).fillColor('red').text(`Error loading image: ${content.src}`, contentX, contentY);
            }
        }
    }

    public static async resolveImageBuffer(src: string, basePath: string): Promise<Buffer | null> {
        if (src.startsWith('http://') || src.startsWith('https://')) {
            const res = await fetch(src);
            if (!res.ok) throw new Error(`Failed to fetch ${src}: ${res.statusText}`);
            const arrayBuffer = await res.arrayBuffer();
            return Buffer.from(arrayBuffer);
        }

        const imagePath = path.isAbsolute(src) ? src : path.resolve(basePath, src);
        if (fs.existsSync(imagePath)) {
            return fs.readFileSync(imagePath);
        }
        return null;
    }


    private static renderOptionalTitle(doc: PDFKit.PDFDocument, title: string, style: SlideStyle): void {
        const fontSize = (style.font_size || 18) * 1.8;
        const fontFamily = style.font_family || 'Helvetica';
        const color = style.color || '#000000';
        const align = (style.content_align?.horizontal as string) || 'left'; // Determine alignment once

        doc.fillColor(color)
            .font(this.resolveBoldFont(fontFamily))
            .fontSize(fontSize)
            .text(title, 50, 30, {
                width: 620,
                align: align as 'left' | 'center' | 'right'
            });
    }

    private static renderTable(doc: PDFKit.PDFDocument, rows: TableCell[][], slot: LayoutSlot, style: SlideStyle): void {
        const cellPadding = 5;
        if (rows.length === 0 || !rows[0]) return;
        const colWidth = slot.width / rows[0].length;
        let currentY = slot.y;

        rows.forEach((row) => {
            let maxRowHeight = 0;

            // First pass: calculate row height
            row.forEach(cell => {
                doc.fontSize(style.font_size || 12).font(cell.isHeader ? 'Helvetica-Bold' : 'Helvetica');
                const h = doc.heightOfString(cell.text, { width: colWidth - cellPadding * 2 });
                if (h > maxRowHeight) maxRowHeight = h;
            });
            maxRowHeight += cellPadding * 2;

            // Second pass: render cells
            row.forEach((cell, colIndex) => {
                const cellX = slot.x + colIndex * colWidth;

                // Border
                doc.rect(cellX, currentY, colWidth, maxRowHeight).stroke('#CCCCCC');

                // Header background
                if (cell.isHeader) {
                    doc.rect(cellX, currentY, colWidth, maxRowHeight).fill('#EEEEEE');
                }

                // Text
                doc.fillColor(style.color || '#000000')
                    .fontSize(style.font_size || 12)
                    .text(cell.text, cellX + cellPadding, currentY + cellPadding, {
                        width: colWidth - cellPadding * 2,
                        align: 'center'
                    });
            });

            currentY += maxRowHeight;
        });
    }

    private static getBulletChar(type: string): string {
        switch (type) {
            case 'dot': return '•';
            case 'dash': return '-';
            case 'square': return '■';
            case 'arrow': return '→';
            default: return '•';
        }
    }

    private static resolveBoldFont(font: string): string {
        if (font === 'Times-Roman') return 'Times-Bold';
        if (font === 'Courier') return 'Courier-Bold';
        if (font === 'Helvetica') return 'Helvetica-Bold';
        return font.includes('Bold') ? font : `${font}-Bold`;
    }

    private static renderStyledText(doc: PDFKit.PDFDocument, text: string, x: number, y: number, width: number, align: string, baseFont: string, baseSize: number, color: string): number {
        // Blockquote support
        if (text.startsWith('> ')) {
            const quoteText = text.substring(2).trim();
            const quoteX = x + 10;
            const quoteWidth = width - 10;
            doc.save()
                .lineWidth(3)
                .strokeColor('#CCCCCC')
                .moveTo(x, y)
                .lineTo(x, y + doc.heightOfString(quoteText, { width: quoteWidth }))
                .stroke()
                .restore();

            const quoteFont = baseFont === 'Helvetica' ? 'Helvetica-Oblique' : baseFont;
            return this.renderStyledText(doc, quoteText, quoteX, y, quoteWidth, align, quoteFont, baseSize, '#555555');
        }

        const parts = text.split(/(\*\*.*?\*\*)/g);
        const segments = parts.map(part => {
            const isBold = part.startsWith('**') && part.endsWith('**');
            const clean = isBold ? part.slice(2, -2) : part;
            const font = isBold ? this.resolveBoldFont(baseFont) : baseFont;
            return { text: clean, font, isBold };
        }).filter(s => s.text.length > 0);

        doc.fillColor(color).fontSize(baseSize);

        // OPTIMIZATION: If single segment (no mixed styles), let PDFKit handle wrapping & alignment
        if (segments.length === 1) {
            const seg = segments[0];
            doc.font(seg.font);
            doc.text(seg.text, x, y, { width: width, align: align as 'left' | 'center' | 'right' });
            return doc.heightOfString(seg.text, { width: width });
        }

        // MANUAL LAYOUT FOR CENTER / RIGHT (Fixes overlap issues for mixed styles on SINGLE LINE only)
        // If content likely wraps, we might have issues here, but mixed-style wrapping is hard in PDFKit.
        if (align === 'center' || align === 'right') {
            // ... existing manual logic ...

            // 1. Measure Total Width
            let totalLineWidth = 0;
            const segmentWidths: number[] = [];

            segments.forEach(seg => {
                doc.font(seg.font);
                const w = doc.widthOfString(seg.text);
                segmentWidths.push(w);
                totalLineWidth += w;
            });

            // 2. Calculate Start X
            let cursorX = x;
            if (align === 'center') {
                cursorX = x + (width - totalLineWidth) / 2;
            } else if (align === 'right') {
                cursorX = x + (width - totalLineWidth);
            }

            // 3. Draw Segments
            segments.forEach((seg, i) => {
                doc.font(seg.font);
                doc.text(seg.text, cursorX, y, { lineBreak: false });
                cursorX += segmentWidths[i];
            });

            // Return height (approximate as single line since we forces lineBreak: false)
            doc.font(this.resolveBoldFont(baseFont));
            return doc.heightOfString("A", { width: width });
        }

        // STANDARD LAYOUT FOR LEFT (Supports Wrapping)
        let isFirstChunk = true;

        segments.forEach((seg, index) => {
            const isLast = index === segments.length - 1;
            doc.font(seg.font);

            if (isFirstChunk) {
                doc.text(seg.text, x, y, { width: width, align: align as 'left' | 'center' | 'right', continued: !isLast });
                isFirstChunk = false;
            } else {
                doc.text(seg.text, { continued: !isLast });
            }
        });

        const cleanFullText = text.replace(/\*\*/g, '');
        doc.font(this.resolveBoldFont(baseFont));
        return doc.heightOfString(cleanFullText, { width: width });
    }
}
