import { StoneDeckIR } from '../models/ir.js';

export interface ExportPlugin {
    generate(ir: StoneDeckIR, outputPath: string, options?: unknown): Promise<void>;
}
