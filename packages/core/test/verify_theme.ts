
import { processStoneDeck } from '../src/processor.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPath = path.join(__dirname, 'verify_variants.md');
const content = fs.readFileSync(mdPath, 'utf-8');

const ir = processStoneDeck(content, mdPath);

console.log("Manifesto Theme:", ir.manifesto.theme);

ir.slides.forEach((slide, index) => {
    console.log(`\n--- Slide ${index + 1} ---`);
    console.log(`Variant Request: ${slide.variant}`);
    // Check specific style properties we expect to change
    const bg = slide.style.background;
    console.log(`Background Value:`, bg?.value || bg);
    console.log(`Font Family:`, slide.style.font_family);
});
