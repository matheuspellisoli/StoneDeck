# Bem-vindo ao StoneDeck

**StoneDeck** é um motor de apresentação "agentic" projetado para transformar Markdown simples em slides **HTML** impressionantes e profissionais.

Ele faz a ponte entre texto cru e apresentações de alto design, impondo um sistema de layout que garante consistência.

## Principais Recursos

- **Markdown Primeiro**: Escreva conteúdo, não coordenadas de pixels.
- **Exportação HTML**: Gere slides HTML interativos que podem ser facilmente convertidos para PDF via impressão.
- **Layouts Inteligentes**: Grids de cartões unificados, métricas de números grandes e colunas divididas funcionam imediatamente.
- **Design Agente**: Parâmetros como "Big Number" ou "Cards" ajustam automaticamente tamanhos de fonte e grids para o máximo impacto.

## Início Rápido

1.  **Instalar**:
    ```bash
    npm install -g @stonedeck/cli
    ```

2.  **Criar um arquivo (`slides.md`)**:
    ```markdown
    ---
    theme: default
    ---
    layout: title-slide
    title: "Olá StoneDeck"
    subtitle: "Markdown para Mágica"
    ---
    layout: cards
    title: "Por que StoneDeck?"
    style:
      card: { background: "surface", shadow: true }
    ---
    # Velocidade
    Escreva em minutos.
    
    # Beleza
    Design system garantindo qualidade.
    ```

3.  **Gerar**:
    ```bash
    stonedeck slides.md
    ```

Confira o [Catálogo de Layouts](./layouts) ou o [Guia de Estilos](./styling) para mais!

---

### 🔗 Documentação Adicional
- [🤖 Prompts para IA](../prompts/system-prompt.md)
- [🗺️ Roadmap](./roadmap.md)

### 🌍 Idiomas
- [🇺🇸 English](../en/)
- [🇪🇸 Español](../es/)
