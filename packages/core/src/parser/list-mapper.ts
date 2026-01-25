import { ListItem } from '../models/ir.js';

export function mapMarkdownLists(markdown: string): ListItem[] {
    const lines = markdown.split(/\r?\n/);
    const items: ListItem[] = [];

    for (const line of lines) {
        // Regex matches: leading spaces, asterisk/dash/number, then the text
        const match = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
        if (match) {
            const indentation = match[1]!.length;
            const bullet = match[2]!;
            const text = match[3]!;

            // RFC 9.2: Hierarquia até 3 níveis. 
            // Assuming 2 spaces per level.
            const level = Math.min(Math.floor(indentation / 2) + 1, 3);

            let bullet_type = 'dot';
            if (bullet === '-') bullet_type = 'dash';
            if (/^\d+\./.test(bullet)) bullet_type = 'number';

            items.push({ text, level, bullet_type });
        }
    }

    return items;
}
