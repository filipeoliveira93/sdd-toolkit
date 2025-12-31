---
title: Tasks Sprint - Localization & Fixes
milestone_ref: Milestone 3 (Localization)
tech_stack: Node.js, Clack Prompts, JS-YAML
---

# Execution Backlog: Localization & Hardening

## Technical Summary
(Target Stack: Node.js CLI)

## Tasks Checklist

- [ ] **[M3-T01] Enforce English in Transformers**
  - [ ] Open `src/lib/transformers.js`.
  - [ ] Locate `toCopilotInstructions` function.
  - [ ] Change the injected rule from `Use Portuguese (Brazil)` to `Use English`.
  - [ ] Translate all internal code comments (e.g., `// Converte para...`) to English.
  - **DoD:** All generated prompts and internal comments are in English.

- [ ] **[M3-T02] Audit CLI Output strings**
  - [ ] Open `src/index.js`.
  - [ ] Verify all `console.log`, `intro`, `outro`, and `select` messages are in clear English.
  - [ ] Verify `src/lib/docs.js` (if applicable) for any generated documentation scaffolding text.
  - **DoD:** User experience is 100% English.

- [ ] **[M3-T03] Translate Project Documentation**
  - [ ] Translate `docs/project.md` content to English.
  - [ ] Translate `docs/requirements.md` content to English.
  - [ ] Translate `docs/milestones.md` content to English.
  - **DoD:** The project's "Brain" (docs folder) is fully in English to support international agents.

---
