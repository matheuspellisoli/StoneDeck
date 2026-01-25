/**
 * Detects a Markdown image in a string.
 */
export function mapMarkdownImage(markdown: string): { src: string; alt?: string } | null {
    // Regex for ![alt](src)
    const match = markdown.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
    if (match && match[1] !== undefined && match[2] !== undefined) {
        return {
            alt: match[1],
            src: match[2]
        };
    }
    return null;
}
