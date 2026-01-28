# AGENTS.md — SDD Toolkit

This document describes the agent and skill structure of SDD Toolkit to guide coding agents.

## Overview

SDD Toolkit is a collaborative agent system for specification-driven development. Agents work as a team, each with specific responsibilities.

## Available Agents

| Command | Agent | Emoji | Responsibility |
|---------|--------|-------|----------------|
| `/sdd.project` | Project Architect | 🏛️ | Defines project scope and vision |
| `/sdd.requirements` | Requirements Engineer | 📝 | Documents requirements and tech stack |
| `/sdd.feature` | Feature Manager | ✨ | Manages features and milestones |
| `/sdd.coder` | Coder | 💻 | Implements code following SOLID |
| `/sdd.frontend` | Frontend Architect | 🎨 | Design and UI/UX (framework-agnostic) |
| `/sdd.backend` | Backend Architect | ⚙️ | APIs and server-side systems (agnostic) |
| `/sdd.test` | Test Engineer | 🧪 | Automated testing and TDD |
| `/sdd.review` | QA Engineer | 🔍 | Reviews and validates code quality |
| `/sdd.security` | Security Auditor | 🛡️ | Security analysis following OWASP Top 10 |
| `/sdd.prompt` | Prompt Architect | 🧠 | Creates AI prompts and agents |
| `/sdd.log` | Release Manager | 📦 | Consolidates logs and manages changelog |

## Workflow

```
Project Architect → Requirements Engineer → Feature Manager → Coder → Security Auditor → QA Engineer → Release Manager
       🏛️                    📝                   ✨            💻            🛡️               🔍              📦
```

## File Structure

```
definitions/
├── AGENTS.md                    # This file (main index)
├── sdd-project.yaml             # Project Architect
├── sdd-requirements.yaml        # Requirements Engineer
├── sdd-feature.yaml             # Feature Manager
├── sdd-coder.yaml               # Coder
├── sdd-frontend.yaml            # Frontend Architect (Agnostic)
├── sdd-backend.yaml             # Backend Architect (Agnostic)
├── sdd-test.yaml                # Test Engineer (TDD)
├── sdd-review.yaml              # QA Engineer
├── sdd-security.yaml            # Security Auditor (OWASP)
├── sdd-prompt.yaml              # Prompt Architect (Meta-Agent)
├── sdd-log.yaml                 # Release Manager
└── skills/                      # Reusable skills
    ├── handover-protocol/
    │   └── SKILL.md
    └── detect-manifest/
        └── SKILL.md
```

## Available Skills

Skills are reusable instruction modules that agents can load on demand.

| Skill | Description | Used By |
|-------|-------------|---------|
| `handover-protocol` | Handover protocol between agents | All |
| `detect-manifest` | Detects manifests and identifies tech stack | Project, Requirements, Coder |

### How to Use a Skill

1. Read the `skills/[name]/SKILL.md` file before executing
2. Follow the instructions contained in the skill
3. Return to main flow after completion

## Generated Artifacts

Agents generate documentation in the `.sdd-toolkit/` folder:

```
.sdd-toolkit/
├── project.md              # Conceptual scope (Project Architect)
├── requirements.md         # Requirements and stack (Requirements Engineer)
├── context.md              # Feature matrix
├── features/               # Active features
│   └── [feature-slug]/
│       ├── index.md        # Feature overview
│       ├── state.md        # Progress and context
│       ├── MT01.md         # Milestone 1 with tasks
│       ├── MT02.md         # Milestone 2 with tasks
│       └── ...             # (MTXX = Milestone XX)
└── logs/                   # Execution history
    ├── executions/         # Executed task logs
    ├── reviews/            # Review reports
    └── archive/            # Archived logs after release
```

## Build and Test Commands

```bash
# Install dependencies
npm install

# Run CLI
npm start

# Check available agents
node src/index.js
```

## Code Conventions

- **Language**: English for documentation and responses
- **Agent format**: YAML with frontmatter
- **Skill format**: Markdown with YAML frontmatter
- **Handover**: Always use the handover protocol

## Reference

This format follows the [AGENTS.md](https://agents.md/) convention for compatibility with multiple coding agents.
