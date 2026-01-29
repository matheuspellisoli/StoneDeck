# Usage Guide

## CLI Commands

The StoneDeck CLI allows you to convert your Markdown files into professional presentations.

### Export Command (Recommended)
```bash
stonedeck export <input-file> [options]
```

### Preview Command
Generates a temporary HTML (`.preview.html`) and allows observing changes in real-time. By default, **it does not use offline mode** for faster speed.
```bash
stonedeck preview <input-file> [options]
```

**Single Format:** The CLI generates optimized **HTML** files. To get a PDF, use your browser's "Print to PDF" feature.

**Options:**
- `--output, -o`: Defines the output file path.
- `--theme, -t`: Overrides the theme defined in the file.
- `--watch, -w`: (Preview only) Watches for file changes and updates automatically.
- `--no-offline`: Disables automatic Base64 conversion for HTML (faster generation).
- `--debug`: Saves the intermediate state (IR) to `.ir.json`.

---

### Examples

**Export to PDF (via HTML):**
1. Export to HTML: `stonedeck export slides.md`
2. Open the file in Chrome/Edge and press **Ctrl+P** (Print).
3. Select "Save as PDF" and ensure "Background graphics" is enabled.

**Watch Mode (Real-time Preview):**
```bash
stonedeck preview slides.md --watch
```

**Export "Online" HTML (without Base64):**
```bash
stonedeck export slides.md --no-offline
```

**Export to HTML (Offline):**
```bash
stonedeck export slides.md --output my-presentation.html
# Creates my-presentation.html (Offline Mode enabled by default)
```

> [!TIP]
> **Automatic Offline Mode**: When exporting to HTML, StoneDeck automatically converts all images (local and remote) to Base64. This ensures your presentation works anywhere, even without internet.

**Debugging:**
```bash
stonedeck export slides.md --debug
```

---

## Markdown Structure

StoneDeck files start with a **Manifesto** (YAML Frontmatter) and separate slides with `---`.

### The Manifesto (Header)
The first block defines global settings.

```yaml
---
StoneDeck: true
title: My Presentation
theme: default
author: Me
---
```

### Slide Separation
Use three dashes (`---`) to start a new slide. Immediately after the dashes, define the slide configuration in YAML.

```markdown
---
layout: title-and-content
title: "Slide Title"
---
# Left Column
Content...

*-*

# Right Column
Content...
```

See [Layouts](./layouts) for valid layout IDs.
