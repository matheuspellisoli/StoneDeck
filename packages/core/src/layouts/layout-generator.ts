
import { Layout, LayoutSlot } from '../models/ir.js';

export class LayoutGenerator {
    private static CANVAS_WIDTH = 720;
    private static CANVAS_HEIGHT = 405;
    private static SAFETY_MARGIN = 30;

    /**
     * Generates a dynamic layout based on valid base types.
     */
    static generate(layoutId: string, slotCount: number): Layout | null {
        if (layoutId === 'content') {
            return this.generateContentGrid(slotCount);
        }
        if (layoutId === 'title-and-content') {
            return this.generateTitleAndContent(slotCount);
        }
        return null;
    }

    private static generateContentGrid(count: number): Layout {
        // Full canvas usage
        const bounds = {
            x: this.SAFETY_MARGIN,
            y: this.SAFETY_MARGIN,
            w: this.CANVAS_WIDTH - (this.SAFETY_MARGIN * 2),
            h: this.CANVAS_HEIGHT - (this.SAFETY_MARGIN * 2)
        };

        return {
            id: 'content',
            slots: this.calculateGridSlots(count, bounds)
        };
    }

    private static generateTitleAndContent(count: number): Layout {
        // Slot 0 is always Title (Top)
        // Slots 1..N are Body Content (Bottom)

        const titleHeight = 120;
        const spacing = 20;

        const titleSlot: LayoutSlot = {
            id: 'title',
            x: this.SAFETY_MARGIN,
            y: 30,
            width: this.CANVAS_WIDTH - (this.SAFETY_MARGIN * 2),
            height: titleHeight
        };

        if (count <= 1) {
            return {
                id: 'title-and-content',
                slots: [titleSlot]
            };
        }

        const bodyBounds = {
            x: this.SAFETY_MARGIN,
            y: 30 + titleHeight + spacing,
            w: this.CANVAS_WIDTH - (this.SAFETY_MARGIN * 2),
            h: this.CANVAS_HEIGHT - (30 + titleHeight + spacing) - 30
        };

        const bodySlots = this.calculateGridSlots(count - 1, bodyBounds, 1); // offset index by 1

        return {
            id: 'title-and-content',
            slots: [titleSlot, ...bodySlots]
        };
    }

    private static calculateGridSlots(count: number, bounds: { x: number, y: number, w: number, h: number }, indexOffset: number = 0): LayoutSlot[] {
        const slots: LayoutSlot[] = [];
        if (count === 0) return slots;

        // Simple Grid Logic
        // 1: 1x1
        // 2: 2 cols
        // 3: 3 cols
        // 4: 2x2
        // 5: 3x2 (last row 2 center? No, simple grid for now)
        // 6: 3x2
        // 7-8: 4x2
        // 9: 3x3

        let cols = 1;
        let rows = 1;

        if (count === 2) { cols = 2; }
        else if (count === 3) { cols = 3; }
        else if (count === 4) { cols = 2; rows = 2; }
        else if (count === 5 || count === 6) { cols = 3; rows = 2; }
        else if (count > 6) { cols = Math.ceil(Math.sqrt(count)); rows = Math.ceil(count / cols); }

        const cellW = (bounds.w - (cols - 1) * 20) / cols;
        const cellH = (bounds.h - (rows - 1) * 20) / rows;
        const gap = 20;

        for (let i = 0; i < count; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;

            slots.push({
                id: `slot_${i + indexOffset}`,
                x: bounds.x + c * (cellW + gap),
                y: bounds.y + r * (cellH + gap),
                width: cellW,
                height: cellH
            });
        }

        return slots;
    }
}
