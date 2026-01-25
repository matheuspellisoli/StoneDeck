import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { fileURLToPath } from 'url';
import { SlideStyle } from '../models/ir.js';

export class ThemeLoader {
    private static __dirname = path.dirname(fileURLToPath(import.meta.url));

    private static presets: Record<string, any> = {
        dark: {
            name: "Dark Preset",
            tokens: {
                colors: { primary: "#1A1A2E", secondary: "#16213E", accent: "#E94560", surface: "#0F3460", text: "#FFFFFF" },
                fonts: { heading: "Montserrat", body: "Open Sans", mono: "Fira Code" }
            }
        },
        standard: {
            name: "Standard Preset",
            tokens: {
                colors: { primary: "#FFFFFF", secondary: "#F0F0F0", accent: "#007BFF", surface: "#FFFFFF", text: "#000000" },
                fonts: { heading: "Inter", body: "Roboto", mono: "Courier New" }
            }
        }
    };

    static load(themeRef: string, basePath: string): any {
        if (this.presets[themeRef]) {
            return this.presets[themeRef];
        }

        const potentialPaths = [
            path.isAbsolute(themeRef) ? themeRef : path.join(basePath, themeRef),
            path.isAbsolute(themeRef) ? themeRef : path.join(basePath, 'themes', themeRef + '.yaml'),
            path.join(this.__dirname, '../../themes', themeRef + '.yaml'), // When running from built/source
            path.join(this.__dirname, '../../src/themes', themeRef + '.yaml'), // Fallback to src if not copied to dist
            path.join(process.cwd(), 'src/themes', themeRef + '.yaml') // Development fall back
        ];

        for (const p of potentialPaths) {
            if (fs.existsSync(p)) {
                try {
                    const fileContent = fs.readFileSync(p, 'utf8');
                    return YAML.parse(fileContent);
                } catch (e) {
                    console.warn(`Failed to parse theme at ${p}:`, e);
                }
            }
        }

        console.warn(`Theme "${themeRef}" not found. Falling back to standard.`);
        return this.presets.standard;
    }

    static resolveStyle(slideStyle: SlideStyle, theme: any): SlideStyle {
        const tokens = theme.tokens || {};
        return this.deepResolve(slideStyle, tokens);
    }

    private static deepResolve(obj: any, tokens: any): any {
        if (typeof obj !== 'object' || obj === null) {
            // Token resolution for strings
            if (typeof obj === 'string') {
                return this.resolveTokenValue(obj, tokens);
            }
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.deepResolve(item, tokens));
        }

        const resolved: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                resolved[key] = this.deepResolve(obj[key], tokens);
            }
        }
        return resolved;
    }

    private static resolveTokenValue(value: string, tokens: any): any {
        // 1. Try resolving as a color token (e.g., "primary")
        if (tokens.colors?.[value]) return tokens.colors[value];

        // 2. Try resolving as a font token (e.g., "heading")
        if (tokens.fonts?.[value]) return tokens.fonts[value];

        // 3. Try resolving as a spacing token
        if (tokens.spacing?.[value]) return this.convertToPt(tokens.spacing[value]);

        // 4. Try converting the string itself if it's a unit (e.g., "20px")
        return this.convertToPt(value);
    }

    /**
     * Converts various units into Points (pt).
     * 1px ≈ 0.75pt
     * 1em ≈ 12pt (assuming 16px base)
     * RFC 4.1: "Todas as unidades finais devem ser em pt (Pontos)."
     */
    private static convertToPt(value: string | number): any {
        if (typeof value === 'number') return value;

        const match = value.match(/^([\d.]+)(px|em|rem|pt|%)?$/);
        if (!match) return value;

        const numStr = match[1];
        if (!numStr) return value;

        const num = parseFloat(numStr);
        const unit = match[2];

        switch (unit) {
            case 'px': return num * 0.75;
            case 'em':
            case 'rem': return num * 12; // Simple approximation for 1em = 16px
            case 'pt': return num;
            default: return num;
        }
    }
}
