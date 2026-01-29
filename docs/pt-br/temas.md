# Catálogo de Temas (V2)

O StoneDeck oferece uma coleção de temas profissionais "V2" que suportam variantes dinâmicas. Você pode alternar o estilo de um slide específico usando a propriedade `layout_style`.

---

## Como Usar
No manifesto do seu arquivo ou no bloco de configuração do slide:

```yaml
theme: tech_blue  # Define o tema global
```

Para variar um slide específico:
```yaml
:::slide
---
layout: title-and-content
layout_style: kind_1  # Aplica a variante 1
---
...
:::
```

---

## Temas Disponíveis

### 1. Tech Blue (`tech_blue`)
O tema padrão para apresentações técnicas e de software.
- **Padrão**: Fundo branco, fontes sem serifa (Inter/Roboto), acentos em azul vibrante.
- **`kind_1` (Light Blue)**: Fundo azul claro suave, ideal para separar seções.
- **`kind_2` (Deep Mode)**: Fundo azul marinho profundo (Dark Mode), texto claro. Ótimo para diagramas.
- **`kind_3` (Gradient)**: Gradiente vibrante Ciano-Azul. Para capas ou slides de impacto.

### 2. Corporativo V2 (`corporativo_v2`)
Focado em negócios, relatórios e sobriedade.
- **Padrão**: Superfície limpa, azul corporativo sóbrio.
- **`kind_1` (High Contrast)**: Fundo branco, contraste máximo para legibilidade em projetores ruins.
- **`kind_2` (Gradient Accent)**: Cabeçalhos com gradiente sutil.
- **`kind_3` (Classic)**: Fundo cinza claro, fontes serifadas para tabelas financeiras e relatórios densos.

### 3. Acadêmico V2 (`academico_v2`)
Para aulas, palestras e apresentações científicas.
- **Padrão**: Clássico, fundo papel (off-white), fontes serifadas (Times).
- **`kind_1` (Warm)**: Fundo amarelado suave (conforto visual para leitura longa).
- **`kind_2` (Modern Sans)**: Troca para fontes sem serifa e fundo cinza frio. Mais contemporâneo.
- **`kind_3` (Dark Impact)**: Fundo escuro/gradiente com texto invertido para destaque.

### 4. Dark Mode V2 (`dark_mode_v2`)
Otimizado para ambientes com pouca luz e monitores.
- **Padrão**: Fundo Navy (Azul Escuro), texto branco, acentos Teal.
- **`kind_1` (Hacker)**: Fundo quase preto, fonte Monospace (Fira Code/Courier). Estética de terminal.
- **`kind_3` (Deep Gradient)**: Gradiente vertical sutil para profundidade.

### 5. Minimalista V2 (`minimalista_v2`)
"Menos é mais". Focado na tipografia e espaço negativo.
- **Padrão**: Preto e Branco puro. Fontes finas.
- **`kind_1` (Warm Grey)**: Suaviza o fundo para um cinza quente.
- **`kind_2` (Inverse)**: Fundo preto, texto branco. Alto impacto.

### 6. Moderno V2 (`moderno_v2`)
Estilo "Startup", geométrico e colorido.
- **Padrão**: Cinza claro, acentos em Roxo/Violeta. Fontes geométricas.
- **`kind_1` (Dark UI)**: Estilo de interface de aplicativo (Dark UI).
- **`kind_2` (Vibrant)**: Fundo com gradiente forte Roxo-Rosa.

### 7. Criativo V2 (`creative_v2`)
Para portfólios e ideias arrojadas.
- **Padrão**: Cores pastéis e formas orgânicas.
- **`kind_1`**: Fundo colorido sólido (Amarelo/Laranja).
- **`kind_2`**: Gradiente artístico.

---

## Criando seu Próprio Tema
Você pode criar novos temas na pasta `packages/core/src/themes/*.yaml`. O sistema V2 permite definir `variants` que sobrescrevem cores e fontes dinamicamente.
