# RULES.md — SDD Toolkit Usage Rules

This document defines usage rules, folder structure, and where to document each type of artifact.

---

## 📁 Target Project Folder Structure

All agents work with the `.sdd-toolkit/` folder in the target project:

```
.sdd-toolkit/
├── project.md              # Conceptual project scope
├── requirements.md         # Functional requirements + Tech stack
├── context.md              # Feature matrix (global view)
├── system.md               # System state (deploys, migrations)
│
├── features/               # Active features
│   └── [feature-slug]/
│       ├── index.md        # Feature overview
│       ├── state.md        # Progress + context + created files
│       ├── MT01.md         # Milestone 1 with tasks
│       ├── MT02.md         # Milestone 2 with tasks
│       └── ...
│
└── logs/                   # Execution history
    ├── executions/         # Executed task logs
    │   └── [Task_ID].md    # Ex: MT01-task-1.md
    ├── reviews/            # Review logs
    │   └── [Task_ID]-REVIEW.md
    └── archive/            # Archived logs after release
        └── [feature-slug]/
```

---

## 📖 What to Read Before Starting

### Layered Reading Protocol (L1 → L2 → L3)

All agents must follow this protocol to avoid context explosion:

#### L1: Global Context (ALWAYS READ)
1. `.sdd-toolkit/context.md` — Feature matrix + executive summary
2. `.sdd-toolkit/requirements.md` — Tech stack + business rules

#### L2: Feature Context (IF WORKING ON A FEATURE)
3. `.sdd-toolkit/features/[feature-slug]/index.md` — Overview
4. `.sdd-toolkit/features/[feature-slug]/state.md` — Progress + context
5. `.sdd-toolkit/features/[feature-slug]/[MILESTONE].md` — Tasks

#### L3: Task Context (ON DEMAND)
6. `.sdd-toolkit/logs/executions/[Task_ID].md` — Previous execution log
7. `.sdd-toolkit/logs/reviews/[Task_ID]-REVIEW.md` — Previous review

---

## 📝 Where to Document Each Artifact Type

### Project Scope (Project Architect 🏛️)

| Artifact | Location | Description |
|----------|----------|-------------|
| Conceptual scope | `.sdd-toolkit/project.md` | Project constitution |

**Actions after creation:**
- Update `.sdd-toolkit/context.md` if applicable

---

### Requirements (Requirements Engineer 📝)

| Artifact | Location | Description |
|----------|----------|-------------|
| Functional requirements | `.sdd-toolkit/requirements.md` | Stack + FR + NFR + BR |

**Actions after creation:**
- Update `.sdd-toolkit/context.md` if there are relevant changes

---

### Features (Feature Manager ✨)

| Artifact | Location | Description |
|----------|----------|-------------|
| Overview | `.sdd-toolkit/features/[slug]/index.md` | Objective + roadmap |
| State | `.sdd-toolkit/features/[slug]/state.md` | Progress + context |
| Milestones | `.sdd-toolkit/features/[slug]/MT01.md` | Milestone tasks |

**`index.md` Structure:**
```markdown
# 🚀 Feature: [Name]

## Overview
- **Objective:** [Value description]
- **Linked Requirements:** [FR-XXX, FR-YYY]

## Roadmap
- **MT01:** [Milestone Name]
- **MT02:** [Milestone Name]

## Dependencies
- Depends on: [other features]
- Blocks: [other features]
```

**`state.md` Structure:**
```markdown
# 📊 Feature: [Name] - State & Context

## Progress
- **MT01:** ⏳ Not Started (0/X tasks)
- **MT02:** 🔄 In Progress (Y/Z tasks)

## Current Work
- **Last Completed Task:** [Task_ID]
- **Current Task:** [Task_ID]

## Technical Context (Created Files)
[File list]

## Key Decisions
[YYYY-MM-DD] [DT] Description

## Known Issues
[YYYY-MM-DD] [ISSUE] Description
```

**Actions after creation:**
- ALWAYS update `.sdd-toolkit/context.md` with the new feature
- Initial status: "Not Started"

---

### Executed Tasks (Coder 💻)

| Artifact | Location | Description |
|----------|----------|-------------|
| Execution log | `.sdd-toolkit/logs/executions/[Task_ID].md` | What was done |

**Execution log structure:**
```markdown
**Task:** [Task_ID]
**Status:** Completed
**Feature:** [feature-slug]

**Changes:**
- Created `src/components/Button.tsx`
- Updated `src/utils/helpers.ts`

**Technical Reasoning:**
- Decision A: Technical justification.

**Self-Check:**
- [x] Linter Passed
- [x] Tests Passed (if applicable)
```

**Actions after each task:**
1. Create log in `.sdd-toolkit/logs/executions/[Task_ID].md`
2. Update `.sdd-toolkit/features/[slug]/state.md` (Progress, Current Work, Files)
3. Update `.sdd-toolkit/context.md` (Feature Matrix)
4. Mark task as completed in `[MILESTONE].md`

---

### Reviews (QA Engineer 🔍)

| Artifact | Location | Description |
|----------|----------|-------------|
| Review report | `.sdd-toolkit/logs/reviews/[Task_ID]-REVIEW.md` | Approval/Rejection |

**Report structure:**
```markdown
### 🔬 REVIEW RECORD

**Task_ID:** [Task_ID]
**Reviewer:** Senior QA Engineer
**Status:** Approved / Rejected

**Checklist:**
- [x] Business logic verified
- [x] Adequate test coverage
- [x] DoD compliance

**Items for Correction:** (if rejected)
- [Problem description]
```

**Actions after review:**
1. Create report in `.sdd-toolkit/logs/reviews/[Task_ID]-REVIEW.md`
2. Update `.sdd-toolkit/features/[slug]/state.md`
3. If approved: indicate next task or milestone
4. If rejected: list items for correction

---

### Releases (Release Manager 📦)

| Artifact | Location | Description |
|----------|----------|-------------|
| Changelog | `changelog.md` (project root) | Version history |
| Archived logs | `.sdd-toolkit/logs/archive/[feature-slug]/` | Processed logs |

**Changelog structure:**
```markdown
## [v1.0.1] - 2024-03-20

### Added
- New feature X

### Changed
- Improvements to Y

### Fixed
- Bug Z
```

**Actions after release:**
1. Add version to top of `changelog.md`
2. Move logs from `executions/` and `reviews/` to `archive/[feature-slug]/`
3. Update `.sdd-toolkit/context.md` to mark feature as "Completed"
4. Update `.sdd-toolkit/system.md` if necessary

---

## 🏷️ Standard Naming Conventions

| Element | Format | Example |
|---------|--------|---------|
| Feature slug | `kebab-case` | `user-authentication` |
| Milestone | `MTXX` | `MT01`, `MT02` |
| Task ID | `MTXX-task Y` | `MT01-task 1` |
| Functional Requirement | `FR-XXX` | `FR-001` |
| Business Rule | `BR-XXX` | `BR-001` |
| Non-Functional Requirement | `NFR-XXX` | `NFR-001` |
| Temporary features | `fix-[name]` or `refactor-[name]` | `fix-login-bug` |

---

## ⚠️ Critical Rules

1. **Logs are global** — DO NOT create `logs/` folder inside features
2. **Always update state.md** — After EACH executed task
3. **Always update context.md** — After feature status changes
4. **Maximum 5 tasks per milestone** — If exceeded, create new milestone
5. **Do not delete logs** — Archive in `logs/archive/` after release
6. **Language** — Respond in the user's language (English by default)
