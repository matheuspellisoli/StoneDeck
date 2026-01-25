# Usage Guide

## CLI Commands

The StoneDeck CLI allows you to convert your Markdown files into professional presentations.

### Export Command (Recommended)
```bash
npx @stonedeck/cli export <input-file> <format> [options]
```

### Preview Command
Generates a temporary HTML (`.preview.html`) and allows observing changes in real-time. By default, **it does not use offline mode** for faster speed.
```bash
npx @stonedeck/cli preview <input-file> [options]
```

**Formats:** `pdf`, `html`

**Options:**
- `--output, -o`: Defines the output file path.
- `--theme, -t`: Overrides the theme defined in the file.
- `--watch, -w`: (Preview only) Watches for file changes and updates automatically.
- `--no-offline`: Disables automatic Base64 conversion for HTML (faster generation).
- `--debug`: Saves the intermediate state (IR) to `.ir.json`.

---

### Examples

**Export to PDF:**
```bash
npx @stonedeck/cli export slides.md pdf
```

**Watch Mode (Real-time Preview):**
```bash
npx @stonedeck/cli preview slides.md --watch
```

**Export "Online" HTML (without Base64):**
```bash
npx @stonedeck/cli export slides.md html --no-offline
```

**Export to HTML (Offline):**
```bash
npx @stonedeck/cli export slides.md html --output my-presentation.html
# Creates my-presentation.html (Offline Mode enabled by default)
```

> [!TIP]
> **Automatic Offline Mode**: When exporting to HTML, StoneDeck automatically converts all images (local and remote) to Base64. This ensures your presentation works anywhere, even without internet.

**Debugging:**
```bash
npx @stonedeck/cli export slides.md html --debug
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
