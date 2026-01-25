import { TableCell } from '../models/ir.js';

/**
 * Simple Markdown table parser.
 * It identifies tables and converts them into a 2D array of TableCells.
 */
export function mapMarkdownTable(markdown: string): TableCell[][] | null {
    const lines = markdown.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    // Minimum table has 2 lines: header and delimiter
    if (lines.length < 2) return null;

    // Check if the first line is a table header
    const firstLine = lines[0];
    if (!firstLine || !firstLine.startsWith('|') || !firstLine.endsWith('|')) return null;

    // Check for delimiter line (|---|---|)
    const delimiterLine = lines[1];
    if (!delimiterLine || !delimiterLine.includes('|') || !delimiterLine.includes('-')) return null;

    const rows: TableCell[][] = [];

    // Helper to split row correctly
    const splitRow = (row: string) => row.replace(/^\||\|$/g, '').split('|').map(c => c.trim());

    const headers = splitRow(firstLine);
    rows.push(headers.map(h => ({ text: h, isHeader: true })));

    // Parse Body
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        if (!line || !line.startsWith('|')) break;
        const cells = splitRow(line);
        rows.push(cells.map(c => ({ text: c, isHeader: false })));
    }

    return rows.length > 1 ? rows : null;
}
