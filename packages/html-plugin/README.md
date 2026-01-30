# @stonedeck/html-plugin

> Export StoneDeck presentations to HTML

## What is this?

This package takes a StoneDeck presentation and turns it into interactive HTML slides - no internet required, works in any browser.

**You probably don't need to use this directly** - the [@stonedeck/cli](../cli) already includes this.

## When to use this

Use this package if you're building custom tooling and need to programmatically generate HTML from StoneDeck presentations.

## Quick Example

```typescript
import { processStoneDeck } from '@stonedeck/core';
import { HtmlPlugin } from '@stonedeck/html-plugin';
import * as fs from 'fs';

// 1. Process your markdown
const markdown = fs.readFileSync('slides.md', 'utf-8');
const presentation = processStoneDeck(markdown, 'slides.md');

// 2. Convert to HTML
const plugin = new HtmlPlugin();
const html = plugin.export(presentation);

// 3. Save it
fs.writeFileSync('slides.html', html);
```

## What you get

The HTML file includes:
- All your slides, ready to present
- Navigation buttons (Previous/Next)
- Keyboard controls (arrow keys work!)
- Print-friendly styles for PDF export
- Everything embedded (no internet needed)

## Creating PDFs

1. Open the HTML file in Chrome/Firefox/Edge
2. Press Ctrl+P (or Cmd+P on Mac)
3. Choose "Save as PDF"
4. Make sure "Background graphics" is enabled
5. Save!

## Need help?

Check the main [StoneDeck documentation](../../README.md)

## Repository

[https://github.com/matheuspellisoli/StoneDeck](https://github.com/matheuspellisoli/StoneDeck)

## License

MIT
