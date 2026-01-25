# StoneDeck

> Markdown to Magic. An agentic presentation engine.

**StoneDeck** transforms simple Markdown into stunning **PDF** and **HTML** slides. It enforces a layout system that guarantees professional consistency without pixel-pushing.

## ✨ Key Features

- **Markdown First**: focus on content, not design coordinates.
- **Dual Export**: Print-ready PDFs and interactive HTML slides (offline capable).
- **Smart Layouts**: Unified card grids, big numbers, and split columns that just work.
- **Agentic Design**: Automatic adjustments for font sizes and grids based on content density.

## 🚀 Quick Start

1.  **Install via NPM**:
    ```bash
    npm install @stonedeck/cli
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
    npx @stonedeck/cli preview slides.md --watch
    ```

4.  **Export**:
    ```bash
    npx @stonedeck/cli export slides.md pdf
    ```

## 📚 Documentation

Full documentation is available in the [`docs`](./docs) folder:

- [🇺🇸 English Documentation](./docs/en/index.md)
- [🇧🇷 Documentação em Português](./docs/pt-br/index.md)
- [🇪🇸 Documentación en Español](./docs/es/index.md)

### Highlights
- [🤖 AI System Prompt](./docs/prompts/system-prompt.md) - Teach AI to write StoneDeck slides.
- [🗺️ Project Roadmap](./docs/en/roadmap.md)

## 📦 Monorepo Structure

This repository is a monorepo managed with npm workspaces:

- `packages/core`: Core logic and IR models.
- `packages/cli`: Command Line Interface.
- `packages/html-plugin`: HTML export generator.
- `packages/pdf-plugin`: PDF export generator.

## 📄 License

MIT
