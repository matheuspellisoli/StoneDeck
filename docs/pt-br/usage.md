# Guia de Uso

## Comandos CLI

O StoneDeck CLI permite converter seus arquivos Markdown em apresentações profissionais.

### Comando Export (Recomendado)
```bash
npx @stonedeck/cli export <arquivo-entrada> <formato> [opções]
```

### Comando Preview
Gera um HTML temporário (`.preview.html`) e permite observar mudanças em tempo real. Por padrão, **não utiliza o modo offline** para garantir maior velocidade.
```bash
npx @stonedeck/cli preview <arquivo-entrada> [opções]
```

**Formatos:** `pdf`, `html`

**Opções:**
- `--output, -o`: Define o caminho do arquivo de saída.
- `--theme, -t`: Sobrescreve o tema definido no arquivo.
- `--watch, -w`: (Apenas Preview) Observa mudanças no arquivo e atualiza automaticamente.
- `--no-offline`: Desativa a conversão automática de imagens para Base64 (gera o arquivo mais rápido).
- `--debug`: Salva o estado intermediário (IR) em `.ir.json`.

---

### Exemplos

**Exportar para PDF:**
```bash
npx @stonedeck/cli export slides.md pdf
```

**Modo Watch (Preview em tempo real):**
```bash
npx @stonedeck/cli preview slides.md --watch
```

**Exportar HTML "Online" (sem Base64):**
```bash
npx @stonedeck/cli export slides.md html --no-offline
```

**Exportar para HTML (Offline):**
```bash
npx @stonedeck/cli export slides.md html --output minha-aula.html
# Gera minha-aula.html (Modo Offline ativado por padrão)
```

> [!TIP]
> **Modo Offline Automático**: Ao exportar para HTML, o StoneDeck converte automaticamente todas as imagens (locais e remotas) para Base64. Isso garante que sua apresentação funcione em qualquer lugar, mesmo sem internet.

**Depuração:**
```bash
npx @stonedeck/cli export slides.md html --debug
```

---

## Estrutura do Markdown

Arquivos StoneDeck começam com um **Manifesto** (YAML Frontmatter) e separam slides com `---`.

### O Manifesto (Cabeçalho)
O primeiro bloco define configurações globais.

```yaml
---
title: Minha Apresentação
theme: default
author: Eu
---
```

### Separação de Slides
Use três traços (`---`) para iniciar um novo slide. Imediatamente após os traços, defina a configuração do slide em YAML.

```markdown
---
layout: two-columns
title: "Título do Slide"
---
# Coluna Esquerda
Conteúdo...

# Coluna Direita
Conteúdo...
```

Veja [Layouts](./layouts) para IDs de layout válidos.
