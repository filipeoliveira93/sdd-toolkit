---
title: Tasks Sprint - Milestone 5
milestone_ref: Milestone 5: Suporte a Internacionalização (i18n)
tech_stack: Node.js, @clack/prompts
---

# Execution Backlog: Milestone 5

## Technical Summary
(Target Stack: Native Node.js + internal i18n logic)
The goal is to enable the user to select their preferred language (English, Portuguese, Spanish) and have both the CLI interface and the generated AI Agents adapt to that language.

## Tasks Checklist

- [x] **[M5-T01] Implement Internal I18n Engine**
  - [x] Refactor `src/lib/messages.js` to export a dictionary object (EN, PT_BR, ES).
  - [x] Create `src/lib/i18n.js` with a simple `t(key)` or `getMessage(key, locale)` function.
  - [x] **DoD:** Unit test (or manual run) proves we can retrieve strings in different languages.

- [x] **[M5-T02] Update CLI Wizard (Language Selection)**
  - [x] Update `src/index.js` to ask for "Select Language" as the **first step**.
  - [x] Replace all direct `MESSAGES` usage with the new i18n helper.
  - [x] Store selected locale in the execution context.
  - **DoD:** User sees the CLI in Portuguese if they select PT-BR.

- [x] **[M5-T03] Connect Locale to Transformers**
  - [x] Pass the `locale` from `src/index.js` down to `processAgentsInstallation` and `loadAgents`.
  - [x] Ensure `src/lib/transformers.js` uses this locale to inject the correct "System Rule" (e.g., "Always reply in Portuguese").
  - **DoD:** Generated agent config files (e.g., `coder.toml`) contain the language instruction.

- [ ] **[M5-T04] Localize Documentation Templates** (CANCELLED)
  - [ ] *Skipped:* Templates and System Prompts will remain in English to ensure LLM performance. The output language is controlled via System Rules only.

---