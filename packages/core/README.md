# @stonedeck/core

> The engine that transforms Markdown into beautiful presentations

## What is this?

This is the core package of StoneDeck. It reads your Markdown files and converts them into a structured format that can be turned into HTML slides.

**You probably don't need to use this directly** - use the [@stonedeck/cli](../cli) instead for a better experience.

## When to use this

Use this package if you're:
- Building your own presentation tool on top of StoneDeck
- Creating a custom export format (not HTML)
- Integrating StoneDeck into another application

## Quick Example

```typescript
import { processStoneDeck } from '@stonedeck/core';
import * as fs from 'fs';

// Read your markdown file
const content = fs.readFileSync('my-slides.md', 'utf-8');

// Convert to StoneDeck format
const presentation = processStoneDeck(content, 'my-slides.md');

// Now you have structured data ready to export
console.log(`Your presentation has ${presentation.slides.length} slides`);
```

## What's included

- Markdown parser for StoneDeck syntax
- Theme system (colors, fonts, backgrounds)
- Layout engine (title, content, cards, etc.)
- Smart content detection (tables, lists, images, code)

## Need help?

Check the main [StoneDeck documentation](../../README.md) or use the CLI tool directly.

## Repository

[https://github.com/matheuspellisoli/StoneDeck](https://github.com/matheuspellisoli/StoneDeck)

## License

MIT
