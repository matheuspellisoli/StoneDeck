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
        const fontSize = style.font_size || 18; // Default font size
        const font = style.font_family || 'Helvetica'; // Default font

        try {
            this.doc.font(font).fontSize(fontSize);
            return this.doc.heightOfString(text, { width: maxWidth });
        } catch (e) {
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
        // In a real implementation, this would handle actual markdown parsing.
        const lines = markdown.split('\n');
        let totalHeight = 0;

        for (const line of lines) {
            if (!line.trim()) {
                totalHeight += (style.font_size || 18) * 0.5; // Half line height for empty lines
                continue;
            }
            totalHeight += this.calculateTextHeight(line, style, maxWidth);
        }

        return totalHeight;
    }
}

export const metricsCalculator = new MetricsCalculator();
