### 16. Limpeza e Ajustes (Docs)
- **Ação:** Removida a geração do arquivo `README.md` de `src/lib/docs.js` conforme solicitado, mantendo apenas a criação da estrutura de pastas e `guidelines.md`.
- **Motivo:** Simplificar o output e evitar sobrescrita de documentos do usuário.
- **Status:** Ajuste Pontual Concluído.
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
**2026-01-02 Task:** [Improvement] Agent Usability Upgrade | **Status:** [Completed]
**Changes:**
- **Requirements Engineer:** Added 'Config Scan' mode to auto-detect tech stack from `package.json`, `Cargo.toml`, etc., reducing user friction.
- **Task Planner:** Added 'Update Mode' to allow appending or refining tasks without regenerating the entire plan.
**Self-Check:**
- [x] Definitions Updated
---