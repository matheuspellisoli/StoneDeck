# Technical Layout Guide

StoneDeck uses an intelligent resolution engine that transforms Markdown blocks into optimized visual grids.

## 1. Dynamic Resolution Rules

Unlike traditional slide systems, StoneDeck counts how many content blocks you provide (separated by `*-*`) and selects the best variation of the chosen layout.

### Layout: `title-and-content`
Ideal for standard slides with a header. The first slot is always treated as the **Title**.

| Slots | Visual Scheme | Typical Use |
| :--- | :--- | :--- |
| **1** | Title Only | Solitary header |
| **2** | Title + Full Body | Flowing text or large image |
| **3** | Title + 2 Columns | Comparisons or Text + Image |
| **4** | Title + 3 Columns | Three pillars or features |
| **5-6**| Title + 3x2 Grid | Photo gallery or team cards |

### Layout: `content`
Occupies the full canvas (respecting safety margins) without a fixed header.

| Slots | Visual Scheme |
| :--- | :--- |
| **1** | Full Screen (Default Margins) |
| **2** | 2 Equal Columns |
| **3** | 3 Equal Columns |
| **4** | 2x2 Grid |
| **6** | 3x2 Grid |
| **9** | 3x3 Grid (Mosaic) |

---

## 2. Specialized Layouts (Static)

These layouts have fixed regions defined in the system:

- **`title`**: Reserved for the start of the presentation. Accepts 1 or 2 slots (Title and Subtitle).
- **`section-header`**: Centered text for opening new chapters. Accepts 1 slot.
- **`big-number`**: Focuses on a metric.
    - **Slot 1**: The number (Internal ID `number`, font 6x larger).
    - **Slot 2**: The description.

---

## 3. Slot and Content Behavior

### Slot Separation
In Markdown, use the canonical slot separator:
```markdown
# Slot 1
Content...
*-*
# Slot 2
Content...
```

### Image and Bleed Rules
- **`image_fit: cover`**: The image fills the slot, hiding empty spaces but potentially cropping edges.
- **`full_bleed: true`**: Content ignores internal margins and extends to the physical edge of the slide (ideal for background photos or full impact).

## 4. Canvas Dimensions
- **Logical Resolution**: 720pt x 405pt (16:9 Aspect Ratio).
- **Safety Margin**: 30pt (Top, Left, Right).
- **Bottom Protection Zone**: 15pt constant at the footer to prevent cuts.
