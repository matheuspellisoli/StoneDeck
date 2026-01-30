# @stonedeck/cli

> Create stunning presentations from Markdown

## Install

```bash
npm install -g @stonedeck/cli
```

## Use

### See your slides while editing

```bash
stonedeck preview my-slides.md --watch
```

Opens a browser showing your presentation. Changes to your `.md` file update automatically!

### Export to HTML

```bash
stonedeck export my-slides.md
```

Creates a `.html` file you can share or present anywhere.

### Get a PDF

Export to HTML first, then open it in your browser and use "Print to PDF".

## Create your first presentation

1. Make a file called `hello.md`:

```markdown
---
StoneDeck: true
title: My First Deck
---

:::slide
---
layout: title
---
# Hello World
## Made with StoneDeck
:::

:::slide
---
layout: content
---
# Why StoneDeck?

- Write in Markdown
- Get beautiful slides
- No design skills needed
:::
```

2. Preview it:

```bash
stonedeck preview hello.md --watch
```

3. Love it? Export it:

```bash
stonedeck export hello.md
```

That's it! 🎉

## Commands

| Command | What it does |
|---------|--------------|
| `stonedeck preview <file>` | Opens slides in browser |
| `stonedeck preview <file> --watch` | Auto-reload on changes |
| `stonedeck export <file>` | Creates HTML file |

## Need more help?

Check the [full documentation](../../README.md)

## Repository

[https://github.com/matheuspellisoli/StoneDeck](https://github.com/matheuspellisoli/StoneDeck)

## License

MIT
