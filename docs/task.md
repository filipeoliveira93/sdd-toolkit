---
title: Tasks Sprint - Milestone 3
milestone_ref: Milestone 3: Localização & Estabilização (Hardening)
tech_stack: Node.js, @clack/prompts, picocolors
---

# Execution Backlog: Milestone 3

## Technical Summary
(Target Stack: Node.js + @clack/prompts)
The goal is to prepare the codebase for future internationalization (i18n) by centralizing strings and ensuring consistent language rules in generated agents.

## Tasks Checklist

- [x] **[M3-T01] Centralize CLI Strings (Refactoring)**
  - [x] Create `src/lib/constants.js` (or `messages.js`) to store all user-facing strings from `src/index.js`.
  - [x] Refactor `src/index.js` to import messages instead of using hardcoded strings.
  - [x] Ensure all prompts (intro, outro, select, multiselect) use the centralized strings.
  - **DoD:** `src/index.js` contains no hardcoded English strings in UI calls.

- [x] **[M3-T02] Implement Language Injection Logic**
  - [x] Update `toGeminiTOML`, `toRooConfig`, etc. in `src/lib/transformers.js` to accept a `locale` option (default: 'en').
  - [x] Create a standard rule string: `"Always reply in English unless told otherwise."` (or dynamic based on locale).
  - [x] Inject this rule into the `rules` array or directly into the system prompt during transformation.
  - **DoD:** Generated agent configurations explicitly state the language rule.

- [ ] **[M3-T03] UI & UX Hardening**
  - [ ] Standardize the use of `spinner` in `src/index.js` for all async operations.
  - [ ] Verify error handling in `processAgentsInstallation` to ensure `s.stop()` is called with a descriptive error message using `picocolors`.
  - [ ] Ensure `intro` and `outro` are used consistently for a polished CLI experience.
  - **DoD:** CLI flows (success and error) are visually consistent and provide clear feedback.

---