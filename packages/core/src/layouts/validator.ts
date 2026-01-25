import { Layout } from '../models/ir.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { LayoutGenerator } from './layout-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registryPath = path.join(__dirname, 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

export function validateLayout(id: string, slotCount: number): { valid: boolean; error?: string } {
    const layout = getLayout(id, slotCount);
    if (!layout) {
        return { valid: false, error: `Layout '${id}' not found for ${slotCount} slots.` };
    }
    return { valid: true };
}

export function getLayout(id: string, slotCount: number): Layout | undefined {
    // 1. Try Registry First (Static definitions override dynamic)
    const layout = registry.layouts.find((l: Layout) => l.id === id && l.slots.length === slotCount);
    if (layout) return layout;

    // 2. Try Dynamic Generator
    const dynamic = LayoutGenerator.generate(id, slotCount);
    if (dynamic) return dynamic;

    return undefined;
}
