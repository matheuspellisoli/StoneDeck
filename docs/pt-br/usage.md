# Guia de Uso

## Comandos CLI

O StoneDeck CLI permite converter seus arquivos Markdown em apresentações profissionais.

### Comando Export (Recomendado)
```bash
stonedeck export <arquivo-entrada> [opções]
```

### Comando Preview
Gera um HTML temporário (`.preview.html`) e permite observar mudanças em tempo real. Por padrão, **não utiliza o modo offline** para garantir maior velocidade.
```bash
stonedeck preview <arquivo-entrada> [opções]
```

**Formato Único:** O CLI gera arquivos **HTML** otimizados. Para obter um PDF, utilize o recurso "Imprimir para PDF" do seu navegador.

**Opções:**
- `--output, -o`: Define o caminho do arquivo de saída.
- `--theme, -t`: Sobrescreve o tema definido no arquivo.
- `--watch, -w`: (Apenas Preview) Observa mudanças no arquivo e atualiza automaticamente.
- `--no-offline`: Desativa a conversão automática de imagens para Base64 (gera o arquivo mais rápido).
- `--debug`: Salva o estado intermediário (IR) em `.ir.json`.

---

### Exemplos

**Exportar para PDF (via HTML):**
1. Gere o HTML: `stonedeck export slides.md`
2. Abra no navegador e use **Ctrl+P** (Imprimir).
3. Selecione "Salvar como PDF" e ative "Gráficos de segundo plano".

**Modo Watch (Preview em tempo real):**
```bash
stonedeck preview slides.md --watch
```

**Exportar HTML "Online" (sem Base64):**
```bash
stonedeck export slides.md --no-offline
```

**Exportar para HTML (Offline):**
```bash
stonedeck export slides.md --output minha-aula.html
# Gera minha-aula.html (Modo Offline ativado por padrão)
```

> [!TIP]
> **Modo Offline Automático**: Ao exportar para HTML, o StoneDeck converte automaticamente todas as imagens (locais e remotas) para Base64. Isso garante que sua apresentação funcione em qualquer lugar, mesmo sem internet.

**Depuração:**
```bash
stonedeck export slides.md --debug
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
layout_style: kind_1
title: "Título do Slide"
---
# Coluna Esquerda
Conteúdo...

# Coluna Direita
Conteúdo...
```

Veja [Layouts](./layouts) para IDs de layout válidos.
