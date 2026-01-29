
import * as fs from 'fs';
import * as path from 'path';
import { StoneDeckIR, SlotContent, TableCell, Slide, getLayout, ExportPlugin, LayoutSlot, SlideStyle, ListItem } from '@stonedeck/core';

export interface HtmlPluginOptions {
    offline?: boolean;
    liveReloadPort?: number;
}

export class HtmlPlugin implements ExportPlugin {
    name = "HTML Plugin";
    version = "1.0.0";

    async generate(ir: StoneDeckIR, outputPath: string, options?: HtmlPluginOptions): Promise<void> {
        return HtmlPluginStatic.generate(ir, outputPath, options);
    }
}

class HtmlPluginStatic {
    static async generate(ir: StoneDeckIR, outputPath: string, options?: HtmlPluginOptions): Promise<void> {
        const offline = options?.offline ?? true; // Default to offline mode
        const outputDir = path.dirname(outputPath);

        // Render slides directly wrapped in their containers
        const slidePromises = ir.slides.map(async (slide: Slide, index: number) => {
            const bgStyle = await this.getBackgroundCSS(slide.style.background, ir.basePath, offline);
            const slideStyle = `background: ${bgStyle}; color: ${slide.style.color || '#000000'}; font-family: ${slide.style.font_family || 'sans-serif'};`;

            let slideContent = '';

            const layout = getLayout(slide.layout_id, slide.slots.length);
            let yOffset = 0;
            if (slide.title) {
                const hasTitleSlot = layout?.slots.some((s: LayoutSlot) => s.id === 'title');
                if (!hasTitleSlot) {
                    slideContent += this.renderOptionalTitle(slide.title, slide.style);
                    yOffset = 60;
                }
            }

            if (layout) {
                const slotPromises = slide.slots.map(async (content: SlotContent, slotIdx: number) => {
                    const slotDef = layout.slots[slotIdx];
                    if (slotDef) {
                        return this.renderSlot(content, slotDef, slide.style, ir, yOffset, outputDir, offline);
                    }
                    return '';
                });
                const slotContents = await Promise.all(slotPromises);
                slideContent += slotContents.join('');
            }

            return `
                <div class="slide-wrapper ${index === 0 ? 'active' : ''}" id="wrapper-${index}">
                    <div class="slide" id="slide-${index}" style="${slideStyle}">
                        ${slideContent}
                    </div>
                </div>
            `;
        });

        const slidesResponse = await Promise.all(slidePromises);
        const slidesInnerHtml = slidesResponse.join('');

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ir.manifesto.title || 'StoneDeck Presentation'}</title>
    <style>
        :root {
            --canvas-width: 720pt;
            --canvas-height: 405pt;
            --accent-color: #3b82f6;
            --scale-factor: 1;
        }

        html, body { height: 100%; }

        body { 
            margin: 0; 
            padding: 0; 
            background-color: #1a1a1a; 
            min-height: 100vh;
            display: flex; 
            flex-direction: column; 
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: background-color 0.3s;
            overflow-x: hidden;
        }
        
        /* Presentation Mode */
        body.presenting {
            background-color: black;
            overflow: hidden;
        }

        #presentation-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 20px 0;
            box-sizing: border-box;
        }
        
        body.presenting #presentation-container {
            padding: 0;
        }

        .slides-inner {
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
            width: 100%;
        }

        body.presenting .slides-inner {
            gap: 0;
            width: auto;
            height: 100%;
            justify-content: center;
        }
        
        .slide-wrapper {
            position: relative;
            width: var(--canvas-width);
            height: var(--canvas-height);
            transform-origin: top left;
            transform: scale(var(--scale-factor));
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            background-color: white;
            overflow: hidden;
            flex-shrink: 0;
        }

        body.presenting .slide-wrapper {
            box-shadow: none;
            display: none; /* Hide inactive */
            /* Do NOT override transform or width/height. Keep them logical 720x405 and let scale work. */
            position: absolute;
            top: 50%;
            left: 50%;
            transform-origin: center center;
            transform: translate(-50%, -50%) scale(var(--scale-factor));
        }

        body.presenting .slide-wrapper.active {
            display: block;
        }

        .slide {
            position: absolute;
            top: 0; 
            left: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background-color: white; 
            overflow: hidden;
        }
        
        /* Slots */
        .slot { 
            position: absolute; 
            display: flex; 
            flex-direction: column; 
            overflow: hidden; 
            box-sizing: border-box;
        }
        .slot-title { font-weight: bold; }
        
        h1 { font-size: 1.6em; margin-bottom: 0.1em; margin-top: 0; line-height: 1.1; }
        h2 { font-size: 1.3em; margin-bottom: 0.15em; margin-top: 0; line-height: 1.2; }
        h3 { font-size: 1.1em; margin-bottom: 0.1em; margin-top: 0; line-height: 1.2; }
        
        ul { padding-left: 1.1em; margin: 0; list-style-type: disc; }
        li { margin-bottom: 0.15em; line-height: 1.25; }
        li::marker { color: var(--accent-color); }
        
        table { border-collapse: collapse; width: 100%; margin-top: 0.4em; }
        td, th { border: 1pt solid #ccc; padding: 3pt 5pt; text-align: left; }
        th { background: rgba(0,0,0,0.05); font-weight: bold; }
        
        img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; margin: auto; flex-shrink: 0; }
        
        .markdown-line { margin-bottom: 2pt; line-height: 1.35; }
        p { margin: 0 0 3pt 0; }

        /* Navigation */
        #nav-bar {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 30px;
            display: flex;
            gap: 15px;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
            opacity: 1;
            transition: opacity 0.3s;
        }

        body.presenting #nav-bar {
            opacity: 0;
            pointer-events: none;
        }

        body.presenting #nav-bar:hover {
            opacity: 1;
            pointer-events: auto;
        }
        
        button {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover { background: var(--accent-color); border-color: var(--accent-color); }
        
        #slide-index { min-width: 60px; text-align: center; }

        @media print {
            @page {
                size: 720pt 405pt;
                margin: 0;
            }
            body { 
                background: white; 
                display: block; 
                overflow: visible;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            #nav-bar { 
                display: none !important; 
            }
            #presentation-container {
                padding: 0 !important;
                display: block !important;
            }
            .slides-inner {
                display: block !important;
                gap: 0 !important;
            }
            .slide-wrapper { 
                display: block !important;
                margin: 0 !important; 
                padding: 0 !important;
                box-shadow: none !important; 
                page-break-after: always !important; 
                break-after: page !important;
                transform: none !important; 
                width: 720pt !important; 
                height: 405pt !important;
                position: relative !important;
                left: 0 !important;
                top: 0 !important;
                overflow: hidden !important;
            }
            .slide {
                position: absolute !important;
                width: 100% !important;
                height: 100% !important;
            }
        }
    </style>
</head>
<body id="body">
    <div id="presentation-container">
        <div class="slides-inner">
            ${slidesInnerHtml}
        </div>
    </div>

    <div id="nav-bar">
        <button onclick="togglePresent()">Present</button>
        <button onclick="prevSlide()">Prev</button>
        <span id="slide-index">1 / ${ir.slides.length}</span>
        <button onclick="nextSlide()">Next</button>
        <button onclick="toggleFS()">FS</button>
    </div>

    <script>
        const totalSlides = ${ir.slides.length};
        const body = document.getElementById('body');
        const wrappers = document.querySelectorAll('.slide-wrapper');
        const indexSpan = document.getElementById('slide-index');
        let currentIdx = 0;

        function resize() {
            const baseWidth = 960; 
            const baseHeight = 540;
            const isPresenting = body.classList.contains('presenting');
            
            const winW = window.innerWidth || document.documentElement.clientWidth || 1024;
            const winH = window.innerHeight || document.documentElement.clientHeight || 768;
            
            const targetWidth = isPresenting ? winW : winW * 0.95;
            const targetHeight = isPresenting ? winH : winH * 0.9;
            
            let scale = Math.min(targetWidth / baseWidth, targetHeight / baseHeight);
            
            if (!isPresenting) {
                scale = Math.min(scale, 1);
            }
            if (scale <= 0.01) scale = 1;

            document.documentElement.style.setProperty('--scale-factor', scale);
            
            wrappers.forEach(w => {
                if (isPresenting) {
                    w.style.height = ''; // Reset to CSS default (var(--canvas-height)) for proper aspect ratio scaling
                } else {
                    w.style.height = (baseHeight * scale) + 'px';
                }
            });
        }

        window.addEventListener('resize', resize);
        window.addEventListener('DOMContentLoaded', resize);
        window.addEventListener('load', resize);
        resize();

        function updateUI() {
            indexSpan.innerText = (currentIdx + 1) + ' / ' + totalSlides;
            wrappers.forEach((w, i) => {
                w.classList.toggle('active', i === currentIdx);
            });
            
            if (!body.classList.contains('presenting')) {
                wrappers[currentIdx].scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        }

        function nextSlide() {
            if (currentIdx < totalSlides - 1) {
                currentIdx++;
                updateUI();
            }
        }

        function prevSlide() {
            if (currentIdx > 0) {
                currentIdx--;
                updateUI();
            }
        }

        function togglePresent() {
            body.classList.toggle('presenting');
            setTimeout(() => { resize(); updateUI(); }, 50);
        }

        function toggleFS() {
            if (!document.fullscreenElement) {
                body.requestFullscreen().catch(e => console.warn(e));
            } else {
                document.exitFullscreen();
            }
        }

        window.addEventListener('keydown', (e) => {
            if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); nextSlide(); }
            if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prevSlide(); }
            if (e.key === 'p') togglePresent();
            if (e.key === 'f') toggleFS();
            if (e.key === 'Escape' && body.classList.contains('presenting')) togglePresent();
        });
    </script>
    ${options?.liveReloadPort ? `
    <script>
        const observerPort = ${options.liveReloadPort};
        console.log("📡 Live Reload enabled on port " + observerPort);
        const eventSource = new EventSource("http://localhost:" + observerPort + "/live-reload");
        eventSource.onmessage = (event) => {
            if (event.data === "reload") {
                console.log("🔄 Reloading presentation...");
                window.location.reload();
            }
        };
        eventSource.onerror = () => {
            console.warn("⚠️ Live Reload connection lost. Trying to reconnect...");
        };
    </script>
    ` : ''}
</body>
</html>
`;
        fs.writeFileSync(outputPath, html);
    }

    private static async getBackgroundCSS(bg: SlideStyle['background'], basePath: string, offline: boolean): Promise<string> {
        if (!bg) return '#FFFFFF';
        if (bg.type === 'color') return bg.value || '#FFFFFF';
        if (bg.type === 'gradient' && bg.colors) {
            return `linear-gradient(to bottom, ${bg.colors.join(', ')})`;
        }
        if (bg.type === 'image' && bg.src) {
            const base64 = await this.resolveImageAsBase64(bg.src, basePath, offline);
            const fit = bg.fit === 'contain' ? 'contain' : 'cover';
            return `url('${base64}') center center / ${fit} no-repeat`;
        }
        return '#FFFFFF';
    }

    private static renderOptionalTitle(title: string, style: SlideStyle): string {
        const fontSize = (style.font_size || 18) * 1.8;
        const align = style.content_align?.horizontal || 'left';
        return `
            <div class="slot slot-title" style="left: 50pt; top: 30pt; width: 620pt; font-size: ${fontSize}pt; text-align: ${align}; justify-content: flex-start;">
                ${title}
            </div>
        `;
    }

    private static async renderSlot(content: SlotContent, slot: LayoutSlot, style: SlideStyle, ir: StoneDeckIR, yOffset: number, outputDir: string, offline: boolean): Promise<string> {
        let drawY = slot.y + yOffset;
        const bottomLimit = 405 - 15;
        const availableHeight = bottomLimit - drawY;
        let safeHeight = Math.min(slot.height, availableHeight);
        let widthStr = `${slot.width}pt`;

        if (style.full_bleed && content.type === 'image') {
            drawY = 0;
            safeHeight = 405; // Full Canvas Height
            // HTML width calculation: Total Width (720) - Left (x)
            widthStr = `calc(var(--canvas-width) - ${slot.x}pt)`;
        }

        let innerHtml = '';
        const hAlign = style.card?.content_align?.horizontal || style.content_align?.horizontal || 'left';
        const vAlign = style.card?.content_align?.vertical || style.content_align?.vertical || 'top';
        const valignMap: Record<string, string> = { top: 'flex-start', middle: 'center', bottom: 'flex-end' };
        const justifyContent = valignMap[vAlign] || 'flex-start';

        let extraStyles = '';
        if (style.card && slot.id !== 'title' && slot.id !== 'subtitle' && !(style.full_bleed && content.type === 'image')) {
            const card = style.card;
            if (card.background) extraStyles += `background-color: ${card.background}; `;
            if (card.color) extraStyles += `color: ${card.color}; `;
            if (card.radius) extraStyles += `border-radius: ${card.radius}; `;
            if (card.border) extraStyles += `border: ${card.border}; `;
            if (card.shadow) extraStyles += `box-shadow: 0 4pt 12pt rgba(0,0,0,0.15); `;
            extraStyles += `padding: 10pt; `;
        }

        if (content.type === 'markdown') {
            if (slot.id === 'number') {
                innerHtml = content.raw.replace(/^#+\s+/, '');
            } else {
                innerHtml = this.parseMarkdown(content.raw);
            }
        } else if (content.type === 'list') {
            innerHtml = '<ul>' + content.items.map((i: ListItem) => {
                const processedText = i.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return `<li>${processedText}</li>`;
            }).join('') + '</ul>';
        } else if (content.type === 'table') {
            innerHtml = '<table>' + content.rows.map((row: TableCell[]) =>
                `<tr>${row.map((cell: TableCell) => cell.isHeader ? `<th>${cell.text}</th>` : `<td>${cell.text}</td>`).join('')}</tr>`
            ).join('') + '</table>';
        } else if (content.type === 'image') {
            const base64 = await this.resolveImageAsBase64(content.src, ir.basePath, offline);

            let objFit = 'contain';
            if (style.image_fit === 'cover' || (style.card && style.card.image_fit === 'cover')) {
                objFit = 'cover';
            }
            innerHtml = `<img src="${base64}" alt="${content.alt || ''}" style="width: 100%; height: 100%; object-fit: ${objFit}; display: block;">`;
        }

        const validFontSize = slot.id === 'number' ? (style.font_size || 18) * 6 : (style.font_size || 18);
        const lineHeight = slot.id === 'number' ? '1.1' : 'normal';

        return `
            <div class="slot" style="left: ${slot.x}pt; top: ${drawY}pt; width: ${widthStr}; height: ${safeHeight}pt; font-size: ${validFontSize}pt; line-height: ${lineHeight}; text-align: ${hAlign}; justify-content: ${justifyContent}; ${extraStyles}">
                ${innerHtml}
            </div>
        `;
    }

    private static parseMarkdown(raw: string): string {
        const lines = raw.split(/\r?\n/);
        return lines.map(line => {
            const text = line.trim();
            if (!text) return '<div class="markdown-line">&nbsp;</div>';
            let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            processedText = processedText.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');

            if (processedText.startsWith('### ')) return `<h3>${processedText.substring(4)}</h3>`;
            if (processedText.startsWith('## ')) return `<h2>${processedText.substring(3)}</h2>`;
            if (processedText.startsWith('# ')) return `<h1>${processedText.substring(2)}</h1>`;
            if (processedText.startsWith('> ')) return `<blockquote style="border-left: 3px solid #ccc; margin: 0; padding-left: 10px; font-style: italic; color: #555;">${processedText.substring(2)}</blockquote>`;

            const listMatch = processedText.match(/^(\s*)([-*+])\s+(.*)$/);
            if (listMatch) {
                const indent = (listMatch[1]!.length / 2 + 1) * 20;
                return `<div style="display: list-item; margin-left: ${indent}pt; list-style-type: disc;">${listMatch[3]}</div>`;
            }
            return `<div class="markdown-line">${processedText}</div>`;
        }).join('');
    }

    // Helper to resolve image to Base64
    private static async resolveImageAsBase64(src: string, basePath: string, offline: boolean): Promise<string> {
        try {
            if (src.startsWith('http://') || src.startsWith('https://')) {
                if (!offline) return src;

                const response = await fetch(src);
                if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const mimeType = response.headers.get('content-type') || 'image/octet-stream';
                const base64 = buffer.toString('base64');
                return `data:${mimeType};base64,${base64}`;
            }

            const imagePath = path.isAbsolute(src) ? src : path.resolve(basePath, src);
            if (fs.existsSync(imagePath)) {
                const ext = path.extname(imagePath).toLowerCase().substring(1);
                const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : 'image/octet-stream';
                const buffer = fs.readFileSync(imagePath);
                const base64 = buffer.toString('base64');
                return `data:${mimeType};base64,${base64}`;
            }
            return src;
        } catch (e) {
            console.warn(`Failed to convert image to base64: ${src}`, e);
            return src;
        }
    }
}
