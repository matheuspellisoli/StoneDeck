---
StoneDeck: true
title: "StoneDeck Alignment & Borders"
author: "StoneDeck Team"
theme: "./theme.yaml"
---

:::slide
---
layout: title
layout_style: kind_2
style:
  font_family: "Helvetica"
---
# Unified Layout System 1
*-*
## title / title-and-content / content
:::

:::slide
---
layout: title-and-content
---
# 1. Title + Body (2 slots)
*-*
This layout uses `title-and-content` with **2 slots**.
- Slot 1: Title (Auto-positioned at top)
- Slot 2: Body (Full width content area)

The engine detects 2 slots and picks the Standard variation.
:::

:::slide
---
layout: title-and-content
---
# 2. Title + 2 Columns (3 slots)
*-*
## Left Column
This uses the same `title-and-content` ID.
But because we provided **3 slots**, the engine picks the 2-Column variation.
*-*
## Right Column
Dynamic resolution simplifies the user experience.
:::

:::slide
---
layout: title-and-content
style:
  card: { background: "#f0f0f0", color: "#000", radius: "8pt", shadow: true }
---
# 3. Title + 4 Cards (5 slots)
*-*
# 1
Detected 5 slots (Title + 4).
*-*
# 2
Resolves to Grid 2x2.
*-*
# 3
Automatic layout.
*-*
# 4
Consistent ID.
:::

:::slide
---
layout: section-header
---
# 03. Card Alignment Only (1 slot)
This uses `content` layout with **1 slot**.
Full page canvas for impactful statements.
:::

:::slide
---
layout: content
---
# 5. Content Columns (2 slots)
Left side content.
*-*
![Image](https://placehold.co/300x400/3b82f6/fff.png?text=Right)
:::

:::slide
---
layout: content
style:
  card: { background: "#e8eaf6", border: "1pt solid #ccc" }
---
# 6. Grid 2x2 (4 slots)
Content layout with 4 slots.
*-*
# Card 2
*-*
# Card 3
*-*
# Card 4
:::

:::slide
---
layout: content
style:
  card: { background: "#fff", color: "#000", shadow: true, radius: "4pt", content_align: { horizontal: center } }
---
# 1
*-*
# 2
*-*
# 3
*-*
# 4
*-*
# 5
*-*
# 6
(6 Slots resolves to 3x2 Grid)
:::

:::slide
---
layout: section-header
---
# 01. Horizontal Alignment
:::

:::slide
---
layout: content
---
# 02. Vertical Alignment
Left side content.
*-*
![Image](https://placehold.co/300x400/3b82f6/fff.png?text=Right)
:::

:::slide
---
layout: title-and-content
style:
  card: { background: "#e0f2f1", radius: "4pt" }
---
# 3-Column Layout
Automatic resolution for 3 slots.
*-*
## Column 1
Strategy
*-*
## Column 2
Execution
*-*
## Column 3
Analysis
:::

:::slide
---
layout: content
style:
  card: { background: "#fff", color: "#000", shadow: true, content_align: { horizontal: center, vertical: middle } }
---
# 1
*-*
# 2
*-*
# 3
*-*
# 4
*-*
# 5
*-*
# 6
*-*
# 7
*-*
# 8
*-*
# 9
(9 Slots -> 3x3 Grid)
:::

:::slide
---
layout: section-header
---
# 09. Image Gallery
:::

:::slide
---
layout: content
style:
  card: { background: "#fff", color: "#000", border: "1pt solid #ccc", radius: "2pt" }
---
![Img 1](https://placehold.co/300x200/1a2a6c/fff.png?text=Photo+1)
*-*
![Img 2](https://placehold.co/300x200/b21f1f/fff.png?text=Photo+2)
*-*
![Img 3](https://placehold.co/300x200/fdbb2d/333.png?text=Photo+3)
*-*
![Img 4](https://placehold.co/300x200/333/fff.png?text=Photo+4)
:::

:::slide
---
layout: title-and-content
---
# Text + Gallery
*-*
### Description
This layout mixes text (Slot 1) with images (Slots 2-4).
The engine treats them all as slots in a flexible grid.
*-*
![Ref 1](https://placehold.co/300x200/333/fff.png?text=Ref+A)
*-*
![Ref 2](https://placehold.co/300x200/666/fff.png?text=Ref+B)
*-*
![Ref 3](https://placehold.co/300x200/999/fff.png?text=Ref+C)
:::

:::slide
---
layout: content
---
![Local Sample](./sample.png)
:::

:::slide
---
layout: content
style:
  image_fit: cover
---
![Local Full](./sample.png)
:::

:::slide
---
layout: title-and-content
style:
  image_fit: cover
---
# Local Col 2 Full
*-*
Left Column Text
*-*
![Local Col Full](./sample.png)
:::

:::slide
---
layout: content
style:
  background: { type: image, src: "./sample.png", fit: contain }
---
# Local Background (Contain)
:::

:::slide
---
layout: content
style:
  background: { type: image, src: "./sample.png", fit: cover }
---
# Local Background (Cover)
:::

:::slide
---
layout: content
style:
  image_fit: cover
---
![Internet Full](https://placehold.co/1280x720/3b82f6/ffffff.png?text=Internet+Full)
:::

:::slide
---
layout: title-and-content
style:
  image_fit: cover
---
# Internet Col 2 Full
*-*
Left Column Text
*-*
![Internet Col Full](https://placehold.co/800x600/10b981/ffffff.png?text=Col+Full)
:::

:::slide
---
layout: content
style:
  background: { type: image, src: "https://placehold.co/1280x720/f59e0b/ffffff.png?text=BG+Contain", fit: contain }
---
# Internet BG (Contain)
:::

:::slide
---
layout: content
style:
  background: { type: image, src: "https://placehold.co/1280x720/f59e0b/ffffff.png?text=BG+Cover", fit: cover }
---
# Internet BG (Cover)
:::

:::slide
---
layout: title-and-content
style:
  full_bleed: true
---
# Full Bleed Right
*-*
Left Column Text
*-*
![Full Bleed Right](./sample.png)
:::
