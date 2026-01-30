
import { processStoneDeck } from '../dist/processor.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPath = path.join(__dirname, 'verify_clipping.md');
const content = fs.readFileSync(mdPath, 'utf-8');

const ir = processStoneDeck(content, mdPath);

console.log("Manifesto Theme:", ir.manifesto.theme);

ir.slides.forEach((slide, index) => {
    console.log(`\n--- Slide ${index + 1} ---`);
    console.log(`Layout: ${slide.layout_id}`);

    // Check specific style properties we expect to change
    const bg = slide.style.background;
    console.log(`Background Value:`, bg ? (bg.value || bg) : 'undefined');
    console.log(`Font Family:`, slide.style.font_family);

    if (slide.warnings && slide.warnings.length > 0) {
        console.log("WARNINGS:");
        slide.warnings.forEach(w => console.log(`  - ${w}`));
    } else {
        console.log("No warnings.");
    }


});
