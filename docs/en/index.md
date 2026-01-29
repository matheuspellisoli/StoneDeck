# Welcome to StoneDeck

**StoneDeck** is an agentic presentation engine designed to turn simple Markdown into stunning, professional **HTML** slides.

It bridges the gap between raw text and high-design presentations, enforcing a strict layout system that guarantees consistency.

## Key Features

- **Markdown First**: Write content, not pixel coordinates.
- **HTML Export**: Generate interactive HTML slides that can be easily printed to PDF.
- **Smart Layouts**: Unified card grids, big number metrics, and split columns work out of the box.
- **Agentic Design**: Parameters like "Big Number" or "Cards" automatically adjust font sizes and grids for maximum impact.

## Quick Start

1.  **Install**:
    ```bash
    npm install -g @stonedeck/cli
    ```

2.  **Create a file (`slides.md`)**:
    ```markdown
    ---
    theme: default
    ---
    layout: title-slide
    title: "Hello StoneDeck"
    subtitle: "Markdown to Magic"
    ---
    layout: cards
    title: "Why StoneDeck?"
    style:
      card: { background: "surface", shadow: true }
    ---
    # Speed
    Write in minutes.
    
    # Beauty
    Design system enforcing quality.
    ```

3.  **Generate**:
    ```bash
    stonedeck slides.md
    ```

Check out the [Layout Catalog](./layouts) or [Styling Guide](./styling) for more!

---

### 🔗 Additional Documentation
- [🤖 AI Prompts](../prompts/system-prompt.md)
- [🗺️ Roadmap](./roadmap.md)

### 🌍 Languages
- [🇧🇷 Português do Brasil](../pt-br/)
- [🇪🇸 Español](../es/)
