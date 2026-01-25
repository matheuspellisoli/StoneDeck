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

    let data: unknown;
    try {
        data = YAML.parse(yamlContent);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        throw new ManifestoValidationError(`Failed to parse Manifesto YAML: ${message}`);
    }

    const typedData = data as StoneDeckManifesto;

    if (typedData?.StoneDeck !== true) {
        throw new ManifestoValidationError('Manifesto must contain "StoneDeck: true" to be processed.');
    }

    if (!typedData.title) {
        throw new ManifestoValidationError('Manifesto must contain a "title".');
    }

    if (!typedData.theme) {
        throw new ManifestoValidationError('Manifesto must contain a "theme".');
    }

    const manifesto: StoneDeckManifesto = {
        StoneDeck: true,
        title: typedData.title,
        subtitle: typedData.subtitle,
        theme: typedData.theme,
        author: typedData.author,
    };

    return { manifesto, remainingContent };
}
