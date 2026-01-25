# Guia Técnico de Layouts

O StoneDeck utiliza um motor de resolução inteligente que transforma blocos de Markdown em grades visuais otimizadas.

## 1. Regras de Resolução Dinâmica

Diferente de sistemas de slides tradicionais, o StoneDeck conta quantos blocos de conteúdo você fornece (separados por `*-*`) e seleciona a melhor variação do layout escolhido.

### Layout: `title-and-content`
Ideal para slides padrão com um cabeçalho. O primeiro slot é sempre tratado como o **Título**.

| Slots | Esquema Visual | Uso Típico |
| :--- | :--- | :--- |
| **1** | Apenas Título | Cabeçalho solitário |
| **2** | Título + Corpo Inteiro | Texto corrido ou imagem grande |
| **3** | Título + 2 Colunas | Comparativos ou Texto + Imagem |
| **4** | Título + 3 Colunas | Três pilares ou features |
| **5-6**| Título + Grid 3x2 | Galeria de fotos ou cards de equipe |

### Layout: `content`
Ocupa o canvas total (respeitando a margem de segurança) sem um cabeçalho fixo.

| Slots | Esquema Visual |
| :--- | :--- |
| **1** | Tela Cheia (Margens Padrão) |
| **2** | 2 Colunas Iguais |
| **3** | 3 Colunas Iguais |
| **4** | Grid 2x2 |
| **6** | Grid 3x2 |
| **9** | Grid 3x3 (Mosaico) |

---

## 2. Layouts Especializados (Estáticos)

Estes layouts possuem regiões fixas definidas no sistema:

- **`title`**: Reservado para o início da apresentação. Aceita 1 ou 2 slots (Título e Subtítulo).
- **`section-header`**: Texto centralizado para abrir novos capítulos. Aceita 1 slot.
- **`big-number`**: Foca em uma métrica.
    - **Slot 1**: O número (ID interno `number`, fonte 6x maior).
    - **Slot 2**: A descrição.

---

## 3. Comportamento de Slots e Conteúdo

### Separação de Slots
No Markdown, use o separador de slot canônico:
```markdown
# Slot 1
Conteúdo...
*-*
# Slot 2
Conteúdo...
```

### Regras de Imagem e Sangria
- **`image_fit: cover`**: A imagem preenche o slot, ocultando espaços vazios mas podendo cortar bordas.
- **`full_bleed: true`**: O conteúdo ignora as margens internas e se estende até a borda física do slide (ideal para fotos de fundo ou impacto total).

## 4. Dimensões de Canvas
- **Resolução Lógica**: 720pt x 405pt (Proporção 16:9).
- **Margem de Segurança**: 30pt (Superior, Esquerda, Direita).
- **Zona de Proteção Inferior**: 15pt constantes no rodapé para evitar cortes.
