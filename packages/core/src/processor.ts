import { emitIR } from './emitter.js';
import { StoneDeckIR } from './models/ir.js';

export function processStoneDeck(content: string, filePath: string, themeOverride?: string): StoneDeckIR {
    return emitIR(content, filePath, themeOverride);
}
