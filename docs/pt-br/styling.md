# Guia de Estilos Completo

Abaixo estão todas as propriedades de estilização suportadas pelo StoneDeck.

## 1. Propriedades Globais do Slide
Definidas diretamente no bloco `style`.

| Propriedade | Descrição | Exemplo |
| :--- | :--- | :--- |
| `font_family` | Fonte do slide (Helvetica, Times-Roman, Courier) | `"Helvetica"` |
| `font_size` | Tamanho base da fonte em pontos (pt) | `20` |
| `color` | Cor principal do texto (HEX) | `"#333333"` |
| `content_align` | Alinhamento global (horizontal e vertical) | `{ horizontal: center, vertical: middle }` |
| `image_fit` | Comportamento de imagens em slots (`cover` ou `contain`) | `"cover"` |
| `full_bleed` | Se `true`, a imagem ignora margens e ocupa o canvas total | `true` |
| `layout_style` | Variação do tema ("kind"). Ex: `kind_1`, `kind_2`, `kind_3` | `"kind_1"` |

---

## 2. Tabelas e Código (Novo)

O StoneDeck suporta nativamente:

### Tabelas
Tabelas Markdown padrão (GFM) são renderizadas com estilos profissionais.

```markdown
| Métrica | Q1 | Q2 |
| :--- | :--- | :--- |
| Receita | 10k | 12k |
```

**Formatação Inline**: Você pode usar **negrito**, *itálico* e imagens dentro das células.

### Blocos de Código
Use três crases para blocos de código. A indentação é preservada.

```javascript
function hello() {
  console.log("StoneDeck");
}
```

---

## 2. Planos de Fundo (`background`)
Permite cores sólidas, degradês ou imagens.

| Propriedade | Descrição | Exemplo |
| :--- | :--- | :--- |
| `type` | Tipo de fundo: `color`, `gradient` ou `image` | `image` |
| `value` | Cor HEX (obrigatório para `type: color`) | `"#F5F5F5"` |
| `colors` | Array de cores HEX (para `type: gradient`) | `["#000", "#333"]` |
| `src` | Caminho local ou URL da imagem | `"./bg.png"` |
| `fit` | Ajuste da imagem: `cover` ou `contain` | `"cover"` |
| `opacity`| Opacidade de 0 a 1 | `0.5` |

---

## 3. Cartões (`card`)
Estiliza os contêineres de conteúdo (slots) em grupo.

| Propriedade | Descrição | Exemplo |
| :--- | :--- | :--- |
| `background` | Cor de fundo do cartão | `"#FFFFFF"` |
| `radius` | Arredondamento dos cantos | `"10pt"` |
| `border` | Borda no formato CSS | `"1pt solid #ccc"` |
| `shadow` | Habilita sombra projetada | `true` |
| `content_align`| Alinhamento interno do conteúdo do cartão | `{ vertical: middle }` |
| `color` | Cor do texto dentro do cartão (sobrescreve o global) | `"#000000"` |
| `image_fit` | Sobrescreve o `image_fit` global para imagens no cartão | `"contain"` |

---

## 4. Listas (`list`)
Personalize o comportamento de listas com marcadores.

| Propriedade | Descrição | Exemplo |
| :--- | :--- | :--- |
| `bullet_type` | Tipo: `dot`, `square`, `arrow`, `dash`, `number` | `"arrow"` |
| `bullet_color`| Cor do marcador | `"#800000"` |
| `spacing` | Espaçamento entre itens | `"10pt"` |
| `indent` | Recuo da lista | `"20pt"` |

---

## 5. Alinhamentos Suportados
Valores permitidos para `horizontal` e `vertical`:

- **Horizontal**: `left`, `center`, `right`
- **Vertical**: `top`, `middle`, `bottom`

## 6. Lógica Especial: Big Numbers
Se um slot tiver o ID `number` (comum no layout `big-number`), o StoneDeck aplicará automaticamente:
- **Tamanho da Fonte**: 6x o tamanho base.
- **Peso**: Negrito (Bold).
