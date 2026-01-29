---
StoneDeck: true
theme: default
title: "Como Criar Agentes no Antigravity"
style:
  font_family: "Courier"
---

:::slide
---
layout: title
---
# Como Criar Agentes no Antigravity
## Guia Prático de Skills, Melhores Práticas e Observabilidade
*-*
Apresentado por Antigravity
:::

:::slide
---
layout: title-and-content
style:
  background:
    type: image
    src: "assets/imagens/context_saturation.png"
    fit: cover
    opacity: 0.1
---
# O Paradigma "Agent-First"
*-*
- **Evolução da IDE**: O Antigravity transforma a IDE em uma plataforma onde agentes trabalham em paralelo.
- **Context Saturation**: Carregar todo o código e documentação na memória do agente gera custos altos e baixa performance.
- **A Solução**: Progressive Disclosure. O agente só carrega o que precisa, quando precisa, através de **Skills**.
:::

:::slide
---
layout: content
style:
  card: { background: "#f0f4f8", shadow: false }
---
# 99+
Ferramentas em um único servidor MCP podem causar "Tool Bloat", confundindo o agente.

:::

:::slide
---
layout: section-header
---
# Mergulhando nas Skills
:::

:::slide
---
layout: title-and-content
---
# O que é uma Skill?
*-*
## "Menu" de Capacidades
Skills são unidades leves de conhecimento que aparecem como um menu para o agente. Elas não ocupam contexto até serem necessárias.
*-*
## Extensão de Poder
Muito além de texto, Skills podem executar scripts (Python, Bash), transformando o agente em um operador do sistema.
:::

:::slide
---
layout: content
style:
  card: { shadow: true, background: "surface" }
---
## 🧠 SKILL.md
O cérebro. Define as instruções, o objetivo e quando o agente deve ativar essa skill.
*-*
## ⚡ Scripts
A ação. Scripts em Python ou Bash que executam a tarefa pesada (ex: validação de schema).
*-*
## 📚 Resources
O conhecimento estático. Templates, documentação e padrões que o agente pode consultar.
*-*
## 🎓 Examples
O aprendizado. Exemplos "Input -> Output" para ensinar padrões complexos sem instruções longas.
:::

:::slide
---
layout: title-and-content
---
# Exemplo: Git Commit Formatter
*-*
### O Problema
Desenvolvedores escrevem commits ruins como "fix" ou "wip".

### A Solução
Uma Skill que intercepta o pedido de commit e aplica o padrão "Conventional Commits".

### O Resultado
O agente analisa o diff e gera: `feat(auth): implement google login strategy`.
:::

:::slide
---
layout: section-header
---
# Padrões Avançados
:::

:::slide
---
layout: title-and-content
style:
  list: { bullet_type: number }
---
# Níveis de Complexidade
*-*
- **Nível 1 (Router)**: Apenas instruções de texto.
- **Nível 2 (Assets)**: Uso de templates externos (ex: Cabeçalho de Licença).
- **Nível 3 (Few-Shot)**: Aprendizado por exemplos (ex: JSON para Pydantic).
- **Nível 4 (Tool Use)**: Validação determinística via scripts (ex: Validador de Schema SQL).
:::

:::slide
---
layout: title-and-content
style:
  card: { background: "#eef2ff", border: "1pt solid #c7d2fe" }
---
# Skills vs MCP vs Workflows
*-*
## Skills (Cérebro)
Metodologia e tarefas ad-hoc.
*"Refatore este arquivo usando nossos padrões."*
*-*
## MCP (Mãos)
Ferramentas estatais e conexões persistentes.
*"Conecte no Banco de Dados Produção."*
*-*
## Workflows (Macros)
Sequências orquestradas pelo usuário.
*"/deploy-prod"*
:::

:::slide
---
layout: section-header
---
# Melhores Práticas & Observabilidade
:::

:::slide
---
layout: title-and-content
---
# Identidade do Agente
*-*
Definir claramente quem é o agente evita respostas genéricas.

- **Role**: "Você é um Engenheiro de Dados Sênior."
- **Tone**: "Seja técnico, direto e aponte riscos."
- **Guardrails**: "NUNCA execute DROP TABLE sem confirmação explícita."
:::

:::slide
---
layout: content
---
# Observabilidade em 2025

## O Desafio
Agentes não são determinísticos. O mesmo prompt pode gerar resultados diferentes.

*-*

## A Solução: OpenTelemetry
Padronizar a telemetria (traces, logs, metrics) para entender o "raciocínio" do agente.

## Por que monitorar?
Para detectar alucinações, loopings infinitos e garantir que as Skills estão sendo chamadas corretamente.
:::

:::slide
---
layout: content
style:
  background:
    type: gradient
    colors: ["#3b82f6", "#1d4ed8"]
  color: white
---
# 🚀 
Comece agora. Crie sua primeira Skill em `.agent/skills/`.

:::
