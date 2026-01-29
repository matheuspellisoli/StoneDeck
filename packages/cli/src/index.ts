#!/usr/bin/env node
import { processStoneDeck } from '@stonedeck/core';
import { HtmlPlugin } from '@stonedeck/html-plugin';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

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
StoneDeck CLI v${pkg.version}

Usage:
  stonedeck export <input.md> [options]
  stonedeck preview <input.md> [options]
  stonedeck <input.md> [output.html] (Legacy)

Commands:
  export <input.md>      Export a presentation to HTML
  preview <input.md>     Quick HTML preview (defaults to internal browser or static)

Options:
  --output, -o <path>    Output file path
  --theme, -t <path>     Theme file override
  --watch, -w            Watch for changes and re-generate
  --no-offline           Disable automatic Base64 conversion for HTML
  --debug                Save IR to .ir.json for debugging
  --help, -h             Show this help message

Note: To get a PDF, export to HTML and use your browser's "Print to PDF" feature.
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
    } else {
        inputPath = path.resolve(args[0]!);

        // If second argument is 'html' or 'pdf', ignore it (for backward compatibility)
        if (args[1] === 'html' || args[1] === 'pdf') {
            args.splice(1, 1);
        }

        const outIdx = args.indexOf('--output') !== -1 ? args.indexOf('--output') : args.indexOf('-o');
        if (outIdx !== -1) outputPath = path.resolve(args[outIdx + 1]!);
    }

    format = 'html';

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
        const offline = !args.includes('--no-offline');

        const portIdx = args.indexOf('--live-reload-port');
        const liveReloadPort = portIdx !== -1 ? parseInt(args[portIdx + 1]!) : undefined;

        console.log(`🌐 Generating HTML: ${path.basename(outputPath)}...`);
        await htmlPlugin.generate(ir, outputPath, { offline, liveReloadPort });

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

    // Live Reload Server State
    let sseClients: http.ServerResponse[] = [];
    let lrPort = 3000;

    const startLiveReloadServer = async () => {
        return new Promise<number>((resolve) => {
            const server = http.createServer((req, res) => {
                const url = new URL(req.url || '/', `http://localhost:${lrPort}`);
                if (url.pathname === '/live-reload') {
                    res.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.write('data: connected\n\n');
                    sseClients.push(res);
                    req.on('close', () => {
                        sseClients = sseClients.filter(c => c !== res);
                    });
                } else if (url.pathname === '/' || url.pathname === '/index.html') {
                    if (fs.existsSync(outputPath)) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(fs.readFileSync(outputPath));
                    } else {
                        res.writeHead(404);
                        res.end('Preview not generated yet. Please wait...');
                    }
                } else {
                    res.writeHead(404);
                    res.end();
                }
            });

            server.on('error', (e: any) => {
                if (e.code === 'EADDRINUSE') {
                    lrPort++;
                    server.listen(lrPort);
                }
            });

            server.listen(lrPort, () => {
                resolve(lrPort);
            });
        });
    };

    if (isWatch) {
        lrPort = await startLiveReloadServer();
        console.log(`📡 Live Reload server started on port ${lrPort}`);
    }

    const run = async () => {
        try {
            console.log(`\n🔄 ${isWatch ? 'Updating' : 'Generating'} preview...`);
            // Preview defaults to no-offline for speed
            const exportArgs = [args[0]!, '--output', outputPath, ...args.filter(a => a !== args[0] && a !== '--watch' && a !== '-w')];
            if (!exportArgs.includes('--no-offline')) exportArgs.push('--no-offline');
            if (isWatch) {
                exportArgs.push('--live-reload-port', lrPort.toString());
            }

            await handleExport(exportArgs, false);

            // Notify clients
            sseClients.forEach(client => client.write('data: reload\n\n'));

            if (isWatch) {
                console.log(`👀 Preview available at: http://localhost:${lrPort}`);
            } else {
                console.log(`👀 Preview available at: file://${outputPath}`);
            }
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
