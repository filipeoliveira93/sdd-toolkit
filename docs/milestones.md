---
title: Development Roadmap
source_spec: docs/project.md
last_updated: 2025-12-30
status: Active
---

# Strategic Roadmap

## 1. Strategy Summary
This document reflects the current state of the **sdd-toolkit** project. The foundational infrastructure phases (CLI) and business logic (Definitions Engine) are complete. The current focus is on **Localization** (Milestone 3), followed by **Standardization** (Milestone 4) and **Internationalization** (Milestone 5) to provide a global and customizable experience.

## 2. Milestones Detail

### Milestone 1: Core Foundation & CLI (MVP)
**Status: ✅ Completed**
- **Objective:** Establish Node.js project structure, basic CLI interface, and error handling.
- **Key Deliverables:**
  - `package.json` setup and dependencies (`@clack/prompts`, `zod`).
  - Implementation of `src/index.js` (Entry Point).
  - Basic Interactive Wizard (OS and Tool selection).
- **Definition of Done (DoD):** Command `npx sdd-toolkit` runs without errors and displays the initial menu.
- **Priority (MoSCoW):** Must Have
- **Technical Focus:** Backend (Node.js CLI)
- **Dependencies:** None

### Milestone 2: Definitions Engine & Transformers
**Status: ✅ Completed**
- **Objective:** Implement the "Business Core" logic that reads, validates, and converts agents.
- **Key Deliverables:**
  - Creation of all YAML files in `definitions/` (Auditor, Coder, etc.).
  - Implementation of `src/lib/schema.js` (Zod Validation).
  - Implementation of `src/lib/transformers.js` (YAML -> TOML/JSON Conversion).
- **Definition of Done (DoD):** System can read a YAML file and generate a valid configuration string for Gemini CLI.
- **Priority (MoSCoW):** Must Have
- **Technical Focus:** Logic / Data Transformation
- **Dependencies:** Milestone 1

### Milestone 3: Localization & Hardening
**Status: 🚧 In Progress**
- **Objective:** Ensure the entire ecosystem (CLI output, Generated Agent Instructions, and Internal Documentation) is strictly in English.
- **Key Deliverables:**
  - Updated `transformers.js` to inject "Use English" rules.
  - Translation of all CLI user-facing strings in `src/index.js`.
  - Translation of the `docs/` folder ("The Brain") to English.
- **Definition of Done (DoD):** A user running the tool sees only English; generated agents speak English.
- **Priority (MoSCoW):** Must Have
- **Technical Focus:** Refactoring / Content
- **Dependencies:** Milestone 2

### Milestone 4: Standardization & Templates
**Status: 📅 Planned**
- **Objective:** Standardize the installation structure and improve the user onboarding experience with document templates.
- **Key Deliverables:**
  - **Unified Directory:** Change the default installation/config folder to `.sd-toolkit` (unifying generated assets where applicable or storing toolkit metadata).
  - **Doc Templates:** Create standard templates for `docs/project.md`, `docs/milestones.md`, and `docs/task.md` with instructional comments.
  - **Template Engine:** Logic to copy/scaffold these templates if they don't exist.
- **Definition of Done (DoD):** `npx sdd-toolkit` creates a `.sd-toolkit` folder and populates `docs/` with high-quality starter files.
- **Priority (MoSCoW):** Should Have
- **Technical Focus:** File System / DX (Developer Experience)
- **Dependencies:** Milestone 3

### Milestone 5: Internationalization (i18n) Support
**Status: 📅 Planned**
- **Objective:** Allow users to define the language of the generated documentation and agent instructions during setup.
- **Key Deliverables:**
  - **Language Selector:** Add a step in the CLI Wizard to select language (e.g., English, Portuguese, Spanish).
  - **Locale Logic:** Update `transformers.js` to inject the selected language rule (e.g., "Always reply in Spanish") into the generated agent prompts.
  - **Docs Translation:** (Optional) Provide translated versions of the `docs/` templates based on selection.
- **Definition of Done (DoD):** User selects "Portuguese" in the wizard, and the installed agents (Coder, Architect) are instructed to speak Portuguese.
- **Priority (MoSCoW):** Could Have
- **Technical Focus:** i18n / CLI Features
- **Dependencies:** Milestone 4

## 3. Risk Matrix
- **Risk:** Translation inconsistencies between code comments and docs.
- **Mitigation:** Execute a full audit task (M3-T02) to verify consistency.
- **Risk:** User overwriting existing docs with templates.
- **Mitigation:** Implement a "safe check" (only create if not exists) for Milestone 4 templates.
- **Risk:** Maintaining multiple language templates.
- **Mitigation:** Start with English only for docs templates and only strictly translate the "System Prompt" rules first.
