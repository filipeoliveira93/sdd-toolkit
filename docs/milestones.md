---
title: Roteiro de Desenvolvimento (Roadmap)
source_spec: docs/project.md
last_updated: 2025-12-31
status: Ativo
---

# Roteiro Estratégico

## 1. Resumo da Estratégia
Este documento reflete o estado atual do projeto **sdd-toolkit**. As fases de infraestrutura fundamental (CLI) e lógica de negócio (Engine de Definições) estão concluídas. O foco atual é a **Localização e Estabilização** (Milestone 3), seguida pela **Padronização** (Milestone 4) e **Internacionalização** (Milestone 5) para oferecer uma experiência global e personalizável.

## 2. Detalhes das Milestones

### Milestone 1: Fundação Core & CLI (MVP)
**Status: ✅ Concluída**
- **Objetivo:** Estabelecer a estrutura do projeto Node.js, interface CLI básica e tratamento de erros.
- **Entregáveis:**
  - Configuração do `package.json` e dependências (`@clack/prompts`, `zod`).
  - Implementação do `src/index.js` (Ponto de entrada).
  - Wizard Interativo básico (Seleção de SO e Ferramentas).
- **Definição de Pronto (DoD):** O comando `npx sdd-toolkit` executa sem erros e exibe o menu inicial.
- **Prioridade (MoSCoW):** Must Have

### Milestone 2: Engine de Definições & Transformadores
**Status: ✅ Concluída**
- **Objetivo:** Implementar a lógica central que lê, valida e converte as definições dos agentes.
- **Entregáveis:**
  - Criação de arquivos YAML em `definitions/` (Auditor, Coder, etc.).
  - Implementação de `src/lib/schema.js` (Validação Zod).
  - Implementação de `src/lib/transformers.js` (Conversão YAML -> TOML/JSON/MDC).
- **Definição de Pronto (DoD):** O sistema consegue ler um YAML e gerar strings de configuração válidas para Gemini, Roo, Cursor, etc.
- **Prioridade (MoSCoW):** Must Have

### Milestone 3: Localização & Estabilização (Hardening)
**Status: 🚧 Em Andamento**
- **Objetivo:** Garantir que o ecossistema atual (CLI e Prompts) esteja estável e consistente em Inglês antes de expandir.
- **Entregáveis:**
  - **Refatoração de Strings:** Mover strings do CLI para um arquivo de constantes para facilitar tradução futura.
  - **Injeção de Regras:** Garantir que `transformers.js` injete corretamente regras de idioma nos agentes.
  - **Correções de UI:** Ajustar o feedback visual e spinners no CLI.
- **Definição de Pronto (DoD):** Fluxo completo de instalação sem bugs visuais e com prompts gerados de forma consistente.
- **Prioridade (MoSCoW):** Must Have

### Milestone 4: Padronização & Templates
**Status: 📅 Planejada**
- **Objetivo:** Padronizar a estrutura de instalação e melhorar a experiência de onboarding com templates de documentos.
- **Entregáveis:**
  - **Diretório Unificado:** Criar uma pasta `.sdd-toolkit` para armazenar metadados da instalação local.
  - **Templates de Docs:** Criar arquivos base reais para `docs/project.md`, `docs/milestones.md` e `docs/task.md` com comentários instrutivos.
  - **Scaffolding Inteligente:** Lógica para criar esses arquivos apenas se não existirem (preservando o trabalho do usuário).
- **Definição de Pronto (DoD):** `npx sdd-toolkit` popula a pasta `docs/` com arquivos de alta qualidade que guiam o usuário.
- **Prioridade (MoSCoW):** Should Have

### Milestone 5: Suporte a Internacionalização (i18n)
**Status: 📅 Planejada**
- **Objetivo:** Permitir que o usuário escolha o idioma da documentação gerada e das instruções dos agentes.
- **Entregáveis:**
  - **Seletor de Idioma:** Adicionar etapa no Wizard para selecionar o idioma (ex: Inglês, Português, Espanhol).
  - **Lógica de Locale:** Atualizar transformadores para injetar a regra de resposta no idioma escolhido.
  - **Tradução de Templates:** Fornecer versões traduzidas dos templates da Milestone 4.
- **Definição de Pronto (DoD):** Ao selecionar "Português", os agentes instalados (Coder, Architect) são instruídos a falar em Português.
- **Prioridade (MoSCoW):** Could Have

## 3. Matriz de Riscos
- **Risco:** Inconsistência entre o idioma do CLI e o idioma dos agentes gerados.
- **Mitigação:** Implementar um sistema de dicionário centralizado (i18next ou similar).
- **Risco:** Usuário sobrescrever documentação existente.
- **Mitigação:** Implementar verificação de existência de arquivo e confirmação (prompt) antes de sobrescrever.
- **Risco:** Complexidade na manutenção de múltiplos templates de idioma.
- **Mitigação:** Priorizar a tradução dos System Prompts (regras de sistema) antes de traduzir a documentação de apoio completa.