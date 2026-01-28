# SKILL.md — Brownfield Setup

---
name: brownfield-setup
description: Guide for setting up existing projects (brownfield) with SDD Toolkit structure
---

## Objective
This skill assists in formalizing existing projects that don't follow the SDD Toolkit standard, detecting legacy structure and migrating to the new format.

---

## When to Use
- Project already has code but no `.sdd-toolkit/` documentation
- There's a legacy `spec.md` that needs to be migrated
- There are milestone/task files outside the standard structure

---

## Migration Steps

### 1. Detect Legacy Structure
```bash
# Check if legacy structure exists
ls -la .sdd-toolkit/

# Common legacy files:
# - .sdd-toolkit/spec.md (single file with everything)
# - .sdd-toolkit/MT01.md (milestones at root)
# - .sdd-toolkit/tasks/ (old tasks folder)
```

### 2. Extract Features from spec.md
If `spec.md` exists:
1. Identify each feature described
2. List the milestones associated with each
3. Map the already executed tasks

### 3. Create New Structure
For each feature found:

```
.sdd-toolkit/
├── features/
│   └── [feature-slug]/
│       ├── index.md      # Feature overview
│       ├── state.md      # Progress + context + files
│       ├── MT01.md       # Milestone 1
│       └── MT02.md       # Milestone 2
├── context.md            # Global feature matrix
├── requirements.md       # Tech stack + rules
├── project.md            # Project principles
└── system.md             # System state
```

### 4. Migrate Content
For each feature:

**a) Create `index.md`:**
```markdown
# 🚀 Feature: [Name]

## Overview
- **Objective:** [Extracted from spec.md]
- **Linked Requirements:** [FR-XXX]

## Roadmap
- **MT01:** [Milestone Name]
- **MT02:** [Milestone Name]
```

**b) Create `state.md`:**
```markdown
# 📊 Feature: [Name] - State

## Progress
- **MT01:** ✅ Completed (migrated from legacy)
- **MT02:** ⏳ Not Started

## Technical Context
[Files already existing in code]
```

**c) Migrate milestones:**
Each milestone from `spec.md` becomes a separate file.

### 5. Update context.md
```markdown
# 📋 Feature Matrix

| Feature | Status | Milestones |
|---------|--------|------------|
| [Name] | 🔄 In Migration | MT01-MT02 |
```

### 6. Archive Legacy Structure
```bash
mkdir -p .sdd-toolkit/logs/archive/legacy
mv .sdd-toolkit/spec.md .sdd-toolkit/logs/archive/legacy/
mv .sdd-toolkit/MT*.md .sdd-toolkit/logs/archive/legacy/ 2>/dev/null
```

---

## Migration Checklist
- [ ] Legacy structure identified
- [ ] Features extracted
- [ ] Feature directories created
- [ ] index.md and state.md for each feature
- [ ] Milestones migrated to separate files
- [ ] context.md updated
- [ ] Legacy files archived

---

## Notes
- This migration is **optional** for new projects
- Preserve history: never delete, only archive
- If in doubt about a feature, ask the user
