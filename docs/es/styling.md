# Guía Completa de Estilos

A continuación se presentan todas las propiedades de estilo compatibles con StoneDeck.

## 1. Propiedades Globales de la Diapositiva
Definidas directamente en el bloque `style`.

| Propiedad | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `font_family` | Fuente de la diapositiva (Helvetica, Times-Roman, Courier) | `"Helvetica"` |
| `font_size` | Tamaño de fuente base en puntos (pt) | `20` |
| `color` | Color principal del texto (HEX) | `"#333333"` |
| `content_align` | Alineación global (horizontal y vertical) | `{ horizontal: center, vertical: middle }` |
| `image_fit` | Comportamiento de imágenes en ranuras (`cover` o `contain`) | `"cover"` |
| `full_bleed` | Si é `true`, la imagen ignora los márgenes y ocupa el lienzo total | `true` |

---

## 2. Fondos (`background`)
Permite colores sólidos, degradados o imágenes.

| Propiedad | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `type` | Tipo de fondo: `color`, `gradient` o `image` | `image` |
| `value` | Color HEX (obligatorio para `type: color`) | `"#F5F5F5"` |
| `colors` | Array de colores HEX (para `type: gradient`) | `["#000", "#333"]` |
| `src` | Ruta local ou URL da imagen | `"./bg.png"` |
| `fit` | Ajuste de la imagen: `cover` o `contain` | `"cover"` |
| `opacity`| Opacidad de 0 a 1 | `0.5` |

---

## 3. Tarjetas (`card`)
Estiliza los contenedores de contenido (slots) en grupo.

| Propiedad | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `background` | Color de fondo de la tarjeta | `"#FFFFFF"` |
| `radius` | Redondeo de las esquinas | `"10pt"` |
| `border` | Borde en formato CSS | `"1pt solid #ccc"` |
| `shadow` | Habilita la sombra proyectada | `true` |
| `content_align`| Alineación interna del contenido de la tarjeta | `{ vertical: middle }` |
| `image_fit` | Sobrescribe el `image_fit` global para imágenes en la tarjeta | `"contain"` |

---

## 4. Listas (`list`)
Personaliza el comportamiento de las listas con viñetas.

| Propiedad | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `bullet_type` | Tipo: `dot`, `square`, `arrow`, `dash`, `number` | `"arrow"` |
| `bullet_color`| Color de la viñeta | `"#800000"` |
| `spacing` | Espacio entre elementos | `"10pt"` |
| `indent` | Sangría de la lista | `"20pt"` |

---

## 5. Alineaciones Compatibles
Valores permitidos para `horizontal` y `vertical`:

- **Horizontal**: `left`, `center`, `right`
- **Vertical**: `top`, `middle`, `bottom`

## 6. Lógica Especial: Big Numbers
Si una ranura tiene el ID `number` (común en el diseño `big-number`), StoneDeck aplicará automáticamente:
- **Tamaño de fuente**: 6x el tamaño base.
- **Peso**: Negrita (Bold).
