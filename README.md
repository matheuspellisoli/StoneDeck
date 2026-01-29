# StoneDeck

> Markdown to Magic. An agentic presentation engine.

**StoneDeck** transforms simple Markdown into stunning **HTML** slides. It enforces a layout system that guarantees professional consistency without pixel-pushing. To get a PDF, simply export to HTML and print via your browser.

## ✨ Key Features

- **Markdown First**: focus on content, not design coordinates.
- **HTML Export**: Interactive HTML slides (offline capable) that look perfect when printed to PDF.
- **Smart Layouts**: Unified card grids, big numbers, and split columns that just work.
- **Rich Content**: Support for **Markdown Tables**, **Code Blocks** with syntax highlighting, and images.
- **V2 Themes**: Modern themes with dynamic variants (Light, Dark, Gradient) to fit any brand.
- **Agentic Design**: Automatic adjustments for font sizes and grids based on content density.

## 🚀 Quick Start

1.  **Install via NPM**:
    ```bash
    npm install -g @stonedeck/cli
    ```

2.  **Create your presentation (`slides.md`)**:
    ```markdown
    ---
    StoneDeck: true
    title: My Presentation
    ---
    
    :::slide
    ---
    layout: title
    ---
    # Hello StoneDeck
    ## Markdown to Magic
    :::
    ```

3.  **Preview**:
    ```bash
    stonedeck preview slides.md --watch
    ```

4.  **Export**:
    ```bash
    stonedeck export slides.md
    ```
    *(Open the generated HTML and use "Print to PDF" for high-quality static slides)*

## 📚 Documentation

Full documentation is available in the [`docs`](./docs) folder:

- [🇧🇷 Documentação em Português](./docs/pt-br/index.md)

### Highlights
- [🤖 AI System Prompt](./docs/prompts/system-prompt.md) - Teach AI to write StoneDeck slides.
- [🗺️ Project Roadmap](./docs/en/roadmap.md)

## 📦 Monorepo Structure

This repository is a monorepo managed with npm workspaces:

- `packages/core`: Core logic and IR models.
- `packages/cli`: Command Line Interface.
- `packages/html-plugin`: HTML export generator.

## 📄 License

MIT
