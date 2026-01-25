# CANONICAL CYCLE
## Diretrizes para Agentes de IA

---

## 📁 Estrutura Organizada por Role

As diretrizes estão organizadas como **Skills** para melhor integração com agentes de IA:

### 🔄 Fluxo e Regras Fundamentais (Sempre Incluir)
- **[.agent/skills/canonicalCycle/SKILL.md](./.agent/skills/canonicalCycle/SKILL.md)** - Instruções completas do fluxo Canonical Cycle para agentes

### 🎭 Diretrizes por Role
- **[.agent/skills/analista/SKILL.md](./.agent/skills/analista/SKILL.md)** - 🧠 Agente de Análise
- **[.agent/skills/designer/SKILL.md](./.agent/skills/designer/SKILL.md)** - 🎨 Agente de Designer
- **[.agent/skills/arquiteto/SKILL.md](./.agent/skills/arquiteto/SKILL.md)** - 🏗️ Agente de Arquitetura
- **[.agent/skills/engenheiro/SKILL.md](./.agent/skills/engenheiro/SKILL.md)** - ⚙️ Agente de Engenharia
- **[.agent/skills/desenvolvedor/SKILL.md](./.agent/skills/desenvolvedor/SKILL.md)** - 💻 Agente de Desenvolvimento

---

## 🚀 Como Usar

### Para uma Role Específica

1. **Sempre inclua o fluxo e regras fundamentais:**
   - `.agent/skills/canonicalCycle/SKILL.md`

2. **Inclua a diretriz específica da role:**
   - `.agent/skills/[role]/SKILL.md` (ex: `.agent/skills/analista/SKILL.md`)

### Exemplo de Prompt

```
Você é um Agente de [Role] do Canonical Cycle.

Siga as diretrizes em:
- .agent/skills/canonicalCycle/SKILL.md (fluxo e regras fundamentais)
- .agent/skills/[role]/SKILL.md (diretrizes específicas)

[seu prompt específico aqui]
```

---

---

## 📝 Estrutura de Pastas

```
archives/
└── [numero]_[nome_ciclo]/
    └── [role]/
        ├── raw/
        ├── filter/
        ├── canonical/
        └── artifacts/
```

**Exemplo:**
```
archives/
└── 6_nova_feature/
    └── analista/
        ├── raw/
        ├── filter/
        ├── canonical/
        └── artifacts/
```

---

## ⚠️ Nota

**Este arquivo é um índice de redirecionamento para agentes de IA.** 

Para as diretrizes completas, consulte:
- `.agent/skills/canonicalCycle/SKILL.md` - Instruções do fluxo e regras fundamentais
- `.agent/skills/[role]/SKILL.md` - Diretrizes específicas de cada role

**Para humanos:** Consulte [README.md](./README.md) e [GUIDELINES.md](./GUIDELINES.md) para documentação voltada a humanos.
