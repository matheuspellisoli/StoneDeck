import * as YAML from 'yaml';
import { Slide, SlotContent } from '../models/ir.js';
import { mapMarkdownImage } from './image-mapper.js';

export function tokenizeSlides(remainingContent: string): Slide[] {
    // Slides are separated by ---
    // Note: Since the content starts after the manifesto ---, the first slide delimiter might already be consumed or not exist.
    // The RFC says: "O motor divide o restante do documento por ---."

    const slideBlocks = remainingContent.split(/\r?\n---\r?\n/);
    const slides: Slide[] = [];

    for (const block of slideBlocks) {
        if (!block.trim()) continue;

        // Each slide block: Toggle between A (Yaml) and B (Markdown)
        // Actually the RFC says:
        // Estado A (Config): YAML define layout e style
        // Estado B (Conteúdo): Markdown injetado nos slots

        // Pattern: 
        // layout: ...
        // style: ...
        // ---
        // # Title
        // ***
        // Body

        // In our case, the slide block itself contains BOTH parts separated by --- internally?
        // RFC 8.3: "O motor divide o restante do documento por ---."
        // "Estado A (Config): YAML"
        // "Estado B (Conteúdo): Markdown"

        // Wait, the RFC says "O motor divide o restante do documento por ---"
        // And then says "Alternância de Contexto (Toggle): A (Config) -> B (Conteúdo)"
        // This means Slide 1 Config --- Slide 1 Content --- Slide 2 Config --- Slide 2 Content

        // Let's re-read carefully:
        // 2. Iteração de Slides: O motor divide o restante do documento por ---.
        // 3. Alternância de Contexto (Toggle): A (Config) -> B (Conteùdo)

        // This implies that slide 1 is block 1 (config) and block 2 (content).
        // Slide 2 is block 3 (config) and block 4 (content).
    }

    return slides;
}

export function parseSlides(content: string): Slide[] {
    // Strict V2 syntax: Content must be inside :::slide blocks
    return parseSlidesV2(content);
}

function parseSlidesV2(content: string): Slide[] {
    const slides: Slide[] = [];
    const slideRegex = /:::slide([\s\S]*?):::/g;
    let match;

    while ((match = slideRegex.exec(content)) !== null) {
        const slideBlock = match[1]?.trim() || '';

        // Extract Front Matter
        // Pattern: ^--- (yaml) --- (content)$
        const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
        const fmMatch = slideBlock.match(fmRegex);

        let config: Record<string, unknown> = {};
        let rawContent = slideBlock;

        if (fmMatch) {
            const yamlStr = fmMatch[1] || '';
            rawContent = fmMatch[2] || '';
            try {
                config = YAML.parse(yamlStr) as Record<string, unknown>;
            } catch (e) {
                console.warn('Invalid YAML in slide:', e);
            }
        }

        const layout_id = (config.layout as string) || 'blank';
        const title = config.title as string | undefined;
        const style = (config.style as any) || {};

        const slots = parseSlots(rawContent);

        slides.push({
            layout_id,
            title,
            style,
            slots
        });
    }

    return slides;
}

function parseSlots(content: string): SlotContent[] {
    let processedContent = content.trim();

    // Handle comments inside content (Cycle 2 requirement)
    // Removed here or handled by plugins? Actually comments should be removed BEFORE splitting slots?
    // Let's assume content is pure markdown for now.

    // Remove *-* at start/end
    processedContent = processedContent.replace(/^\*-\*\s*[\r\n]+/, '');
    processedContent = processedContent.replace(/[\r\n]+\s*\*-\*\s*$/, '');

    const slots_content = processedContent
        ? processedContent.split(/\r?\n\*-\*\r?\n/).map(s => s.trim()).filter(s => s.length > 0)
        : [];

    // If no delimiters found but content exists, treat as single slot
    if (slots_content.length === 0 && processedContent.length > 0) {
        const img = mapMarkdownImage(processedContent);
        if (img) return [{ type: 'image', src: img.src, alt: img.alt }];
        return [{ type: 'markdown', raw: processedContent }];
    }

    return slots_content.map(raw => {
        const img = mapMarkdownImage(raw);
        if (img) {
            return { type: 'image', src: img.src, alt: img.alt };
        }
        return { type: 'markdown', raw };
    });
}
