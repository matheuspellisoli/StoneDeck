import { mapMarkdownLists } from '../src/parser/list-mapper';

describe('Cycle 2 Markdown Support', () => {
    it('should support + bullet points', () => {
        const markdown = '+ Item 1\n+ Item 2';
        const result = mapMarkdownLists(markdown);
        expect(result).toHaveLength(2);
        expect(result[0]?.text).toBe('Item 1');
        // bullet_type default is dot if not dash/number
        expect(result[0]?.bullet_type).toBe('dot');
    });

    it('should support * bullet points', () => {
        const markdown = '* Item 1\n* Item 2';
        const result = mapMarkdownLists(markdown);
        expect(result).toHaveLength(2);
        expect(result[0]?.bullet_type).toBe('dot');
    });

    it('should support mixed lists', () => {
        const markdown = '- Dash\n+ Plus\n* Star';
        const result = mapMarkdownLists(markdown);
        expect(result).toHaveLength(3);
        expect(result[0]?.bullet_type).toBe('dash');
        expect(result[1]?.bullet_type).toBe('dot');
        expect(result[2]?.bullet_type).toBe('dot');
    });

    it('should support numbered lists', () => {
        const markdown = '1. First\n2. Second';
        const result = mapMarkdownLists(markdown);
        expect(result).toHaveLength(2);
        expect(result[0]?.bullet_type).toBe('number');
        expect(result[1]?.bullet_type).toBe('number');
    });
});
