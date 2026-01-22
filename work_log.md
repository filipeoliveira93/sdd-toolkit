### 16. Limpeza e Ajustes (Docs)
- **Ação:** Removida a geração do arquivo `README.md` de `src/lib/docs.js` conforme solicitado, mantendo apenas a criação da estrutura de pastas.
- **Motivo:** Simplificar o output e evitar sobrescrita de documentos do usuário.
- **Status:** Ajuste Pontual Concluído.

---
### 17. Simplificações do Fluxo de Instalação (v2.1)
**Changes:**
- Removida a geração do arquivo `README.md` de `src/lib/docs.js` conforme solicitado, mantendo apenas a criação da estrutura de pastas.
- Removido completamente o arquivo `guidelines.md` do projeto para eliminar redundância.
- **Removida a seleção de stack profile do processo de instalação.**
- **Removido o arquivo `src/lib/profiles.js` (187 linhas, 16 stacks).**
- **Ajustado o Requirements Engineer para questionar usuário com perguntas detalhadas sobre stack quando necessário.**
- **Atualizado o template de `requirements.md` com subseções detalhadas de tech stack.**

**Arquivos Modificados:**
- `src/lib/docs.js` (removido guidelines.md do scaffolding)
- `src/scripts/reset.js` (removido guidelines.md do reset)
- `definitions/sdd-coder.yaml` (L1: 2 arquivos em vez de 3)
- `definitions/sdd-review.yaml` (L1: 2 arquivos em vez de 3)
- `definitions/sdd-project.yaml` (removido guidelines.md do diagrama)
- `src/index.js` (removida seleção de stack profile)
- `src/lib/agents.js` (removida injeção de stack rules e import de profiles.js)
- `definitions/sdd-requirements.yaml` (adicionado Stack Definition Protocol)
- `templates/requirements.md` (adicionadas subseções detalhadas)
- `README.md` (removidas referências a stack profiles)
- `src/lib/messages.js` (removidas mensagens de stack selection)
- `work_log.md` (mesclado histórico de alterações)

**Arquivos Excluídos:**
- `templates/guidelines.md`
- `src/lib/profiles.js`

**Motivo:**
Simplificar o onboarding removendo decisões prematuras (guidelines.md e stack selection). Tech stack e convenções agora são definidas dinamicamente pelo Requirements Engineer através de entrevistas detalhadas e documentadas em `requirements.md`. Isso elimina redundância e melhora a flexibilidade do fluxo.

**Status:** Refatoração de Fluxo Concluída.
---
**2026-01-01 Task:** [M3-T03] | **Status:** [Completed]
**Changes:**
- Updated \src/lib/messages.js\ with scaffold and cancellation messages.
- Updated \src/index.js\ to wrap \generateWorkflowGuide\ in a spinner.
- Updated \src/index.js\ to handle CLI cancellations with \outro\.
**Self-Check:**
- [x] Syntax Check Passed (node --check)
- [x] Manual Logic Verification
---
**2026-01-02 Task:** [M4-T05] | **Status:** [Completed]
**Changes:**
- Renamed documentation root from `docs/` to `.sdd-toolkit/` across the entire project.
- Updated `src/lib/docs.js`, `src/lib/agents.js`, `src/lib/messages.js` and helper scripts.
- Refactored all 10 agent definitions in `definitions/` to point to the new hidden folder.
- Migrated project's own documentation to `.sdd-toolkit/`.
**Self-Check:**
- [x] Linter Passed (Implicitly via script execution)
- [x] Scripts Verified (`status.js` working with new paths)
---
**2026-01-02 Task:** [Improvement] Refactor Feature Agent | **Status:** [Completed]
**Changes:**
- Updated `definitions/dev.feature.yaml` to remove the strict 6-step waterfall process.
- Implemented a decision flow that allows direct injection of features into `.sdd-toolkit/task.md` or `.sdd-toolkit/milestones.md`.
- Goal: Reduce friction for adding new features.
**Self-Check:**
- [x] Definition Updated
---
---
**2026-01-02 Task:** [Improvement] Agent Usability Upgrade | **Status:** [Completed]
**Changes:**
- **Requirements Engineer:** Added 'Config Scan' mode to auto-detect tech stack from `package.json`, `Cargo.toml`, etc., reducing user friction.
- **Task Planner:** Added 'Update Mode' to allow appending or refining tasks without regenerating the entire plan.
**Self-Check:**
- [x] Definitions Updated
---
**2026-01-02 Task:** [Feature] Implement Debug Flow | **Status:** [Completed]
**Changes:**
- Updated `definitions/dev.coder.yaml` to include `# COMMANDS & EXECUTION FLOWS`.
- Implemented `/flow:debug` trigger for rapid error fixing.
- Defined protocol: Analyze Stack -> Context Check -> Diagnosis -> Fix.
**Self-Check:**
- [x] Definition Updated
---
**2026-01-02 Task:** [Improvement] Cognitive Protocol Upgrade | **Status:** [Completed]
**Changes:**
- Injected `# THINKING PROCESS` into `dev.auditor.yaml`, `dev.review.yaml`, and `dev.ops.yaml`.
- Defined strict sequential steps (Extraction -> Mapping -> Verification -> Reporting) to prevent hallucinations.
**Self-Check:**
- [x] Definitions Updated
---
**2026-01-02 Task:** [Improvement] Justification Protocol | **Status:** [Completed]
**Changes:**
- Injected `# JUSTIFICATION PROTOCOL` into `dev.project.yaml`, `dev.requirements.yaml`, `dev.milestone.yaml`, and `dev.coder.yaml`.
- Mandated the explanation of "Why" for every significant decision (Tech Stack, Architecture, Prioritization).
**Self-Check:**
- [x] Definitions Updated
---
**2026-01-02 Task:** [Documentation] Overhaul Documentation | **Status:** [Completed]
**Changes:**
- Rewrote root `README.md` to highlight new agile features and power commands.
- Rewrote `.sdd-toolkit/README.md` (Workflow Guide) to explain the new Hybrid Agile flow, commands, and cognitive protocols.
- Standardized both documents in English for consistency.
**Self-Check:**
- [x] Documentation updated
---
**2026-01-02 Task:** [Feature] Implement Advanced Flow Commands | **Status:** [Completed]
**Changes:**
- Implemented `/flow:refactor` and `/flow:gen-tests` in `dev.coder.yaml`.
- Implemented `/flow:security` in `dev.auditor.yaml`.
- Implemented `/flow:sync` in `dev.project.yaml`.
- Updated all documentation to reflect these new capabilities.
**Self-Check:**
- [x] Definitions Updated
- [x] Docs Updated
---
### Release 2.1.0 (Skills Support)
**2026-01-21 Task:** [Feature] Support Google Antigravity Skills | **Status:** [Completed]
**Changes:**
- Implemented `toAntigravitySkill` transformer in `src/lib/transformers.js`.
- Updated `src/index.js` to include 'Antigravity (Skills)' in the tool selection menu.
- Added internationalization strings for Antigravity in `src/lib/messages.js`.
- Verified implementation with `test_antigravity.js` simulating 7 agents.
**Self-Check:**
- [x] Transformed SKILL.md format verified.
- [x] CLI Menu updated verified.
- [x] Syntax Check Passed.
---
**2026-01-21 Task:** [Refactor] Migrate OpenCode to Skills V2 | **Status:** [Completed]
**Changes:**
- Migrated OpenCode integration from "Subagents" (`.opencode/commands`) to "Skills" (`.opencode/skills`).
- Implemented `toOpenCodeSkill` with compliant frontmatter (`compatibility: opencode`).
- Updated CLI menu label to 'OpenCode (Skills)'.
- REMOVED legacy `AGENTS.md` and `toOpenCodeAgent` implementation.
**Self-Check:**
- [x] Structure verified: .opencode/skills/[slug]/SKILL.md
- [x] Frontmatter metadata verified.
---
**2026-01-21 Task:** [Refactor] Migrate OpenCode to Skills V2 | **Status:** [Completed]
**Changes:**
- Migrated OpenCode integration from "Subagents" (`.opencode/commands`) to "Skills" (`.opencode/skills`).
- Implemented `toOpenCodeSkill` with compliant frontmatter (`compatibility: opencode`).
- Updated CLI menu label to 'OpenCode (Skills)'.
- REMOVED legacy `AGENTS.md` and `toOpenCodeAgent` implementation.
**Self-Check:**
- [x] Structure verified: .opencode/skills/[slug]/SKILL.md
- [x] Frontmatter metadata verified.
---
