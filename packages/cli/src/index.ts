import { processStoneDeck } from '@stonedeck/core';
import { PdfPlugin } from '@stonedeck/pdf-plugin';
import { HtmlPlugin } from '@stonedeck/html-plugin';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
        printUsage();
        process.exit(0);
    }

    const command = args[0];

    if (command === 'export') {
        await handleExport(args.slice(1));
    } else if (command === 'preview') {
        await handlePreview(args.slice(1));
    } else {
        // Fallback to legacy/direct usage: npx stonedeck <input.md> [output]
        await handleExport(args, true);
    }
}

function printUsage() {
    console.log(`
StoneDeck CLI v1.0.0

Usage:
  stonedeck export <input.md> <format> [options]
  stonedeck preview <input.md> [options]
  stonedeck <input.md> [output.pdf/html] (Legacy)

Commands:
  export <input.md> <format>   Export a presentation to PDF or HTML
  preview <input.md>           Quick HTML preview (defaults to internal browser or static)

Options:
  --output, -o <path>          Output file path
  --theme, -t <path>           Theme file override
  --watch, -w                  Watch for changes and re-generate
  --no-offline                 Disable automatic Base64 conversion for HTML
  --debug                      Save IR to .ir.json for debugging
  --help, -h                   Show this help message

Formats:
  pdf                          Generate a PDF presentation
  html                         Generate an offline-capable HTML presentation
`);
}

async function handleExport(args: string[], legacy = false) {
    if (args.length < 1) {
        printUsage();
        process.exit(1);
    }

    let inputPath: string;
    let format: string | undefined;
    let outputPath: string | undefined;
    let themeOverride: string | undefined;

    if (legacy) {
        inputPath = path.resolve(args[0]!);
        outputPath = args[1] && !args[1].startsWith('--') ? path.resolve(args[1]) : undefined;
        format = outputPath?.toLowerCase().endsWith('.html') ? 'html' : 'pdf';
    } else {
        inputPath = path.resolve(args[0]!);
        format = args[1]?.toLowerCase();

        if (!format || !['pdf', 'html'].includes(format)) {
            console.error('Error: Format must be either "pdf" or "html"');
            process.exit(1);
        }

        const outIdx = args.indexOf('--output') !== -1 ? args.indexOf('--output') : args.indexOf('-o');
        if (outIdx !== -1) outputPath = path.resolve(args[outIdx + 1]!);
    }

    // Default output path if not specified
    if (!outputPath) {
        outputPath = inputPath.replace(/\.md$/, `.${format}`);
    }

    const themeIdx = args.indexOf('--theme') !== -1 ? args.indexOf('--theme') : args.indexOf('-t');
    if (themeIdx !== -1) themeOverride = args[themeIdx + 1];

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: File not found "${inputPath}"`);
        process.exit(1);
    }

    try {
        console.log(`🚀 Processing: ${path.basename(inputPath)}...`);

        let ir;
        if (inputPath.endsWith('.ir.json')) {
            ir = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
        } else {
            const content = fs.readFileSync(inputPath, 'utf8');
            ir = processStoneDeck(content, inputPath, themeOverride);
        }

        // Debug IR
        if (args.includes('--debug')) {
            const irPath = inputPath.replace(/\.md$/, '.ir.json');
            fs.writeFileSync(irPath, JSON.stringify(ir, null, 2));
            console.log(`🐛 Debug: IR saved to ${path.basename(irPath)}`);
        }

        const htmlPlugin = new HtmlPlugin();
        const pdfPlugin = new PdfPlugin();

        const offline = !args.includes('--no-offline');

        if (format === 'html') {
            console.log(`🌐 Generating HTML: ${path.basename(outputPath)}...`);
            await htmlPlugin.generate(ir, outputPath, { offline });
        } else {
            console.log(`🎨 Generating PDF: ${path.basename(outputPath)}...`);
            await pdfPlugin.generate(ir, outputPath);
        }

        console.log('✅ Done!');
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`❌ Build failed: ${message}`);
        process.exit(1);
    }
}

async function handlePreview(args: string[]) {
    if (args.length < 1) {
        printUsage();
        process.exit(1);
    }

    const inputPath = path.resolve(args[0]!);
    const isWatch = args.includes('--watch') || args.includes('-w');

    // Default preview is always HTML
    const outputPath = inputPath.replace(/\.md$/, '.preview.html');

    const run = async () => {
        try {
            console.log(`\n🔄 ${isWatch ? 'Updating' : 'Generating'} preview...`);
            // Preview defaults to no-offline for speed
            const exportArgs = [args[0]!, 'html', '--output', outputPath, ...args.filter(a => a !== args[0] && a !== '--watch' && a !== '-w')];
            if (!exportArgs.includes('--no-offline')) exportArgs.push('--no-offline');

            await handleExport(exportArgs, false);
            console.log(`👀 Preview available at: ${outputPath}`);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            console.error(`❌ Preview update failed: ${message}`);
        }
    };

    await run();

    if (isWatch) {
        console.log(`📡 Watching for changes in: ${path.basename(inputPath)}`);
        let debounceTimer: NodeJS.Timeout;

        fs.watch(inputPath, (event) => {
            if (event === 'change') {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(run, 100);
            }
        });

        // Keep process alive
        process.stdin.resume();
        console.log('Press Ctrl+C to stop.');
    }
}

main();
