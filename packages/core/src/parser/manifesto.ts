import * as YAML from 'yaml';
import { StoneDeckManifesto } from '../models/ir.js';

export class ManifestoValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ManifestoValidationError';
    }
}

export function parseManifesto(content: string): { manifesto: StoneDeckManifesto; remainingContent: string } {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

    if (!match) {
        throw new ManifestoValidationError('Manifesto block (--- ... ---) not found at the beginning of the file.');
    }

    const yamlContent = match[1]!;
    const remainingContent = content.slice(match[0].length).trim();

    let data: any;
    try {
        data = YAML.parse(yamlContent);
    } catch (e: any) {
        throw new ManifestoValidationError(`Failed to parse Manifesto YAML: ${e.message}`);
    }

    if (data?.StoneDeck !== true) {
        throw new ManifestoValidationError('Manifesto must contain "StoneDeck: true" to be processed.');
    }

    if (!data.title) {
        throw new ManifestoValidationError('Manifesto must contain a "title".');
    }

    if (!data.theme) {
        throw new ManifestoValidationError('Manifesto must contain a "theme".');
    }

    const manifesto: StoneDeckManifesto = {
        StoneDeck: true,
        title: data.title,
        subtitle: data.subtitle,
        theme: data.theme,
        author: data.author,
    };

    return { manifesto, remainingContent };
}
