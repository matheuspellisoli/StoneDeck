import PDFDocument from 'pdfkit';
import { SlideStyle } from '../models/ir.js';

export interface LayoutSlot {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface LayoutDefinition {
    id: string;
    slots: LayoutSlot[];
}

export class MetricsCalculator {
    private doc: PDFKit.PDFDocument;

    constructor() {
        // Create a headless PDF document for measurements
        this.doc = new PDFDocument({ size: [720, 405] });
    }

    /**
     * Calculates the height of a string given a font and width.
     */
    calculateTextHeight(text: string, style: SlideStyle, maxWidth: number): number {
        const fontSize = (style.font_size as number) || 18; // Default font size
        const font = (style.font_family as string) || 'Helvetica'; // Default font

        try {
            this.doc.font(font).fontSize(fontSize);
            return this.doc.heightOfString(text, { width: maxWidth });
        } catch (_e) {
            // Fallback font if the requested one fails
            this.doc.font('Helvetica').fontSize(fontSize);
            return this.doc.heightOfString(text, { width: maxWidth });
        }
    }

    /**
     * Estimates height for Markdown content.
     * For now, this is a simplified version that handles basic text and lists.
     */
    estimateMarkdownHeight(markdown: string, style: SlideStyle, maxWidth: number): number {
        // Simple heuristic: split by lines and sum heights
        const lines = markdown.split('\n');
        let totalHeight = 0;
        const baseFontSize = (style.font_size as number) || 18;

        for (const line of lines) {
            if (!line.trim()) {
                totalHeight += baseFontSize * 0.5; // Half line height for empty lines
                continue;
            }

            let fontSize = baseFontSize;
            let text = line;
            let lineHeightFactor = 1.2;

            // Check for headers
            if (line.startsWith('# ')) {
                fontSize = baseFontSize * 1.6;
                text = line.substring(2);
                lineHeightFactor = 1.1;
            } else if (line.startsWith('## ')) {
                fontSize = baseFontSize * 1.3;
                text = line.substring(3);
                lineHeightFactor = 1.2;
            } else if (line.startsWith('### ')) {
                fontSize = baseFontSize * 1.1;
                text = line.substring(4);
            }

            // Temporarily override font size in style for calculation
            const tempStyle = { ...style, font_size: fontSize };

            // Calculate height of wrapped text
            // Note: heightOfString usually includes line height of the font
            const h = this.calculateTextHeight(text, tempStyle, maxWidth);

            // Apply line height factor if needed (basic adjustment)
            totalHeight += h * 1.05; // Add a small buffer to match browser rendering
        }

        return totalHeight;
    }
}

export const metricsCalculator = new MetricsCalculator();
