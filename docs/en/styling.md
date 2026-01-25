# Complete Style Guide

Below are all the styling properties supported by StoneDeck.

## 1. Global Slide Properties
Defined directly in the `style` block.

| Property | Description | Example |
| :--- | :--- | :--- |
| `font_family` | Slide font (Helvetica, Times-Roman, Courier) | `"Helvetica"` |
| `font_size` | Base font size in points (pt) | `20` |
| `color` | Main text color (HEX) | `"#333333"` |
| `content_align` | Global alignment (horizontal and vertical) | `{ horizontal: center, vertical: middle }` |
| `image_fit` | Image behavior in slots (`cover` or `contain`) | `"cover"` |
| `full_bleed` | If `true`, the image ignores margins and occupies the full canvas | `true` |

---

## 2. Backgrounds (`background`)
Allows solid colors, gradients, or images.

| Property | Description | Example |
| :--- | :--- | :--- |
| `type` | Background type: `color`, `gradient`, or `image` | `image` |
| `value` | HEX color (required for `type: color`) | `"#F5F5F5"` |
| `colors` | Array of HEX colors (for `type: gradient`) | `["#000", "#333"]` |
| `src` | Local path or image URL | `"./bg.png"` |
| `fit` | Image adjustment: `cover` or `contain` | `"cover"` |
| `opacity`| Opacity from 0 to 1 | `0.5` |

---

## 3. Cards (`card`)
Styles content containers (slots) as a group.

| Property | Description | Example |
| :--- | :--- | :--- |
| `background` | Card background color | `"#FFFFFF"` |
| `radius` | Corner rounding | `"10pt"` |
| `border` | Border in CSS format | `"1pt solid #ccc"` |
| `shadow` | Enables drop shadow | `true` |
| `content_align`| Internal alignment of card content | `{ vertical: middle }` |
| `image_fit` | Overrides global `image_fit` for images in the card | `"contain"` |

---

## 4. Lists (`list`)
Customize list behavior with bullets.

| Property | Description | Example |
| :--- | :--- | :--- |
| `bullet_type` | Type: `dot`, `square`, `arrow`, `dash`, `number` | `"arrow"` |
| `bullet_color`| Bullet color | `"#800000"` |
| `spacing` | Spacing between items | `"10pt"` |
| `indent` | List indentation | `"20pt"` |

---

## 5. Supported Alignments
Allowed values for `horizontal` and `vertical`:

- **Horizontal**: `left`, `center`, `right`
- **Vertical**: `top`, `middle`, `bottom`

## 6. Special Logic: Big Numbers
If a slot has the ID `number` (common in the `big-number` layout), StoneDeck will automatically apply:
- **Font Size**: 6x the base size.
- **Weight**: Bold.
