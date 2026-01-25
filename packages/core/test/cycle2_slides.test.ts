import { parseSlides } from '../src/parser/tokenizer';

describe('Cycle 2 Slide Contract (V2)', () => {
    it('should parse :::slide block format', () => {
        const content = `
:::slide
---
layout: title-slide
title: Hello V2
---
# Content Here
:::
        `;
        const slides = parseSlides(content);
        expect(slides).toHaveLength(1);
        expect(slides[0]?.layout_id).toBe('title-slide');
        expect(slides[0]?.title).toBe('Hello V2');
        expect((slides[0]?.slots[0] as any)?.raw.trim()).toBe('# Content Here');
    });

    it('should detect front matter inside :::slide', () => {
        const content = `
:::slide
---
layout: two-columns
style:
  color: red
---
Left
*-*
Right
:::
        `;
        const slides = parseSlides(content);
        expect(slides).toHaveLength(1);
        expect(slides[0]?.layout_id).toBe('two-columns');
        expect(slides[0]?.style.color).toBe('red');
        expect(slides[0]?.slots).toHaveLength(2);
        expect((slides[0]?.slots[0] as any)?.raw.trim()).toBe('Left');
        expect((slides[0]?.slots[1] as any)?.raw.trim()).toBe('Right');
    });

    it('should ignore content outside :::slide blocks (V1 format)', () => {
        const content = `
layout: simple
---
# Old Format
        `;
        const slides = parseSlides(content);
        expect(slides).toHaveLength(0);
    });
});
