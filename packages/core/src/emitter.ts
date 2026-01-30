import { parseManifesto } from './parser/manifesto.js';
import { parseSlides } from './parser/tokenizer.js';
import { ThemeLoader } from './resolver/theme-loader.js';
import { validateLayout, getLayout } from './layouts/validator.js';
import { StoneDeckIR, SlotContent, ListItem, TableCell } from './models/ir.js';
import { mapMarkdownLists } from './parser/list-mapper.js';
import { mapMarkdownTable } from './parser/table-mapper.js';
import { mapMarkdownImage } from './parser/image-mapper.js';
import * as path from 'path';

/**
 * Emitter orchestrates the parsing and theme resolution to produce the final IR.
 */
export function emitIR(content: string, filePath: string, themeOverride?: string): StoneDeckIR {
    const basePath = path.dirname(filePath);
    const globalWarnings: string[] = [];

    // 1. Parse Manifesto
    const { manifesto, remainingContent } = parseManifesto(content);

    // 2. Parse Slides
    const slides = parseSlides(remainingContent);

    // 4. Resolve Temas e Validar Layouts
    const themeToLoad = themeOverride || manifesto.theme;
    const theme = ThemeLoader.load(themeToLoad, basePath);

    const resolvedSlides = slides.map((slide, slideIdx) => {
        // Validate Layout
        const validation = validateLayout(slide.layout_id, slide.slots.length);
        const warnings: string[] = [];
        if (!validation.valid) {
            warnings.push(validation.error!);
        }

        const layout = getLayout(slide.layout_id, slide.slots.length);
        // Resolve Style with Theme
        // Note: We pass slide.style directly. ThemeLoader will handle defaults and variants.
        const resolvedStyle = ThemeLoader.resolveStyle(slide.style, theme, slide.variant, slideIdx);

        // Process Slots (List, Table, Image detection)
        const processedSlots: SlotContent[] = slide.slots.map(slot => {
            if (slot.type === 'markdown') {
                // Try Table
                const tableRows = mapMarkdownTable(slot.raw);
                if (tableRows) return { type: 'table', rows: tableRows };

                // Try Image
                const img = mapMarkdownImage(slot.raw);
                if (img) return { type: 'image', src: img.src, ...(img.alt ? { alt: img.alt } : {}) } as SlotContent;

                // Try List - but only convert if ALL content is list items
                const listItems = mapMarkdownLists(slot.raw);
                if (listItems.length > 0) {
                    // Count non-empty, non-list lines
                    const lines = slot.raw.split(/\r?\n/).filter(l => l.trim().length > 0);
                    const hasOnlyListItems = lines.every(line => {
                        // Check if line matches list pattern
                        return /^\s*([-*]|\d+\.)\s+/.test(line);
                    });

                    if (hasOnlyListItems) {
                        return { type: 'list', items: listItems };
                    }
                }
            }
            return slot;
        });



        return {
            ...slide,
            style: resolvedStyle,
            slots: processedSlots,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    });

    return {
        manifesto,
        slides: resolvedSlides,
        basePath,
        warnings: globalWarnings.length > 0 ? globalWarnings : undefined
    };
}
