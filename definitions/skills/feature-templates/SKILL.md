# SKILL.md — Feature Templates

---
name: feature-templates  
description: Standard templates for creating feature structures
---

## Objective
This skill contains templates for creating feature structures in SDD Toolkit.

---

## Directory Structure

```
.sdd-toolkit/features/[feature-slug]/
├── index.md      # Overview + roadmap
├── state.md      # Progress + context + files
├── MT01.md       # Milestone 1
├── MT02.md       # Milestone 2 (if needed)
└── ...
```

---

## Template: index.md

```markdown
# 🚀 Feature: [Name]

## Overview
- **Objective:** [Brief description of this feature's value]
- **Linked Requirements:** [FR-XXX, FR-YYY]

## Roadmap
- **MT01:** [Milestone Name]
- **MT02:** [Milestone Name]

## Dependencies
- **Depends on:** [other features or "None"]
- **Blocks:** [other features or "None"]

## Notes
[Additional context or important decisions]
```

---

## Template: state.md

```markdown
# 📊 Feature: [Name] - State

## Progress
| Milestone | Status | Tasks |
|-----------|--------|-------|
| MT01 | ⏳ Not Started | 0/X |
| MT02 | ⏳ Not Started | 0/Y |

## Current Work
- **Last Task:** None
- **Current Task:** MT01-task 1 (awaiting start)
- **Next Task:** MT01-task 2

## Technical Context
### Created Files
No files created yet.

### Decisions Made
| Date | Type | Description |
|------|------|-------------|
| - | - | No decisions recorded |

## Known Issues
No issues reported.
```

---

## Template: MTxx.md (Milestone)

```markdown
# 🏁 MT01: [Milestone Name]

**Objective:** [What will be delivered and tested at the end of this stage]

## Tasks

### MT01-task 1 — [Title]
- **Description:** [What should be done]
- **Reference:** [FR-XXX / BR-YYY]
- **DoD:** [Definition of Done - verifiable result]
- **Status:** ⏳ Not Started

### MT01-task 2 — [Title]
- **Description:** [What should be done]
- **Reference:** [FR-XXX / BR-YYY]
- **DoD:** [Definition of Done - verifiable result]
- **Status:** ⏳ Not Started

## Milestone Acceptance Criteria
- [ ] All tasks completed
- [ ] Code reviewed by QA Engineer
- [ ] Tests passing (if applicable)
```

---

## Creation Rules

### Naming Convention
| Element | Format | Example |
|---------|--------|---------|
| Feature slug | `kebab-case` | `user-authentication` |
| Milestone | `MTXX` | `MT01`, `MT02` |
| Task | `MTXX-task Y` | `MT01-task 1` |
| Hotfix | `fix-[name]` | `fix-login-bug` |
| Refactor | `refactor-[name]` | `refactor-api-layer` |

### Limits
- **Maximum 5 tasks per milestone** — If exceeded, create new milestone
- **Maximum 4-5 milestones per feature** — If exceeded, split the feature
- **Each task must have verifiable DoD** — No DoD = poorly defined task

### Sequence
Tasks within a milestone should be in **logical build order**:
1. Setup/Configuration first
2. Business logic after
3. Tests last (or together with logic, if TDD)

---

## Notes
- This skill is used by Feature Manager when creating new features
- Templates can be adapted as needed for the project
- Always update `.sdd-toolkit/context.md` after creating a feature
