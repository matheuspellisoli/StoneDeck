# StoneDeck Documentation Context

This document aggregates all necessary documentation for StoneDeck. Use this as context to understand how to generate valid StoneDeck Markdown presentations.

---

## 1. Guia de Estilos (Styling)

### Propriedades Globais
Definidas no bloco `style` do slide.

| Propriedade | Descrição | Exemplo |
| :--- | :--- | :--- |
| `font_family` | Fonte do slide (Helvetica, Times-Roman, Courier) | `"Helvetica"` |
| `font_size` | Tamanho base da fonte em pontos (pt) | `20` |
| `color` | Cor principal do texto (HEX) | `"#333333"` |
| `content_align` | Alinhamento global | `{ horizontal: center, vertical: middle }` |
| `image_fit` | Ajuste de imagens (`cover` ou `contain`) | `"cover"` |
| `full_bleed` | Imagem ocupa tela cheia | `true` |
| `layout_style` | Variante do tema (`kind_1`, `kind_2`, etc) | `"kind_1"` |

### Planos de Fundo (`background`)
| Propriedade | Descrição |
| :--- | :--- |
| `type` | `color`, `gradient` ou `image` |
| `value` | Cor HEX (para `color`) |
| `colors` | Array de HEX (para `gradient`) |
| `src` | Caminho da imagem |

### Cartões (`card`)
Estiliza os slots de conteúdo.
- `background`: Cor de fundo.
- `radius`: Arredondamento (ex: `"10pt"`).
- `shadow`: `true` para sombra.
- `border`: CSS border string.
- `color`: Cor do texto dentro do cartão.

### Tabelas e Código
- **Tabelas**: Use sintaxe Markdown padrão (GFM).
- **Código**: Use blocos de código com três crases (\`\`\`).
- **Inline**: Negrito (`**`), Itálico (`*`) e Imagens (`![]()`) funcionam dentro de tabelas.

---

## 2. Catálogo de Layouts

O StoneDeck usa layouts pré-definidos. O conteúdo é distribuído em "Slots".

### `title`
- **Uso**: Capa da apresentação.
- **Slots**:
  1. Título principal (H1)
  2. Subtítulo (H2) - Opcional

### `section-header`
- **Uso**: Divisão de capítulos.
- **Slots**:
  1. Título da seção (centralizado).

### `title-and-content`
Layout mais versátil. O primeiro slot é SEMPRE o título.
- **2 Slots**: Título + Conteúdo (1 coluna).
- **3 Slots**: Título + 2 Colunas (Esquerda/Direita).
- **4 Slots**: Título + 3 Colunas.
- **5-6 Slots**: Título + Grid (Cartões).

### `content`
Sem título, usa o espaço todo.
- **1 Slot**: Full Canvas.
- **2 Slots**: 2 Colunas.
- **4 Slots**: Grid 2x2.
- **6 Slots**: Grid 3x2.

### `big-number`
Para métricas de impacto.
- **1 Slot**: Apenas número.
- **2 Slots**: Número + Legenda.
*Nota: Slots com ID `number` têm fonte 6x maior automaticamente.*

---

## 3. Catálogo de Temas (V2)

Use `theme: nome_do_tema` no manifesto. Use `layout_style: kind_X` para variantes por slide.

### `tech_blue` (Padrão Técnico)
- **Padrão**: Branco/Azul.
- `kind_1`: Fundo Azul Claro.
- `kind_2`: Dark Mode (Azul Marinho).
- `kind_3`: Gradiente Ciano.

### `corporativo_v2` (Negócios)
- **Padrão**: Clean/Azul Sóbrio.
- `kind_1`: Alto Contraste (Branco).
- `kind_2`: Acentos Gradiente.
- `kind_3`: Clássico (Cinza/Serifa).

### `dark_mode_v2` (Escuro)
- **Padrão**: Navy.
- `kind_1`: Hacker (Terminal/Monospace).
- `kind_3`: Gradiente Profundo.

### `minimalista_v2`
- **Padrão**: P&B.
- `kind_1`: Cinza Quente.
- `kind_2`: Invertido (Preto).

### `moderno_v2`
- **Padrão**: Geométrico.
- `kind_1`: Dark UI.
- `kind_2`: Gradiente Vibrante.

### `academico_v2`
- **Padrão**: Papel/Serifa.
- `kind_1`: Warm (Amarelado).
- `kind_2`: Sans (Moderno).

---

## 4. Sintaxe Fundamental

```markdown
---
StoneDeck: true
theme: tech_blue
title: Exemplo
---

:::slide
---
layout: title-and-content
layout_style: kind_1
---
# Título do Slide
*-*
## Conteúdo Slot 1
Explicação aqui.
*-*
## Conteúdo Slot 2 (Coluna Direita)
Mais texto.
:::

### Exemplo com Estilização
```markdown
:::slide
---
layout: content
style:
  font_family: "Courier New"
  card:
    background: "#333333"
    color: "#FFFFFF"
    shadow: true
    radius: "12pt"
---
# Card Customizado
Este card usa fundo escuro e texto branco definido manualmente.
*-*
# Outro Card
O estilo se aplica a todos os slots deste slide.
:::
```
```

Use `*-*` para separar slots.
