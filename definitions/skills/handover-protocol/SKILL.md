---
name: handover-protocol
description: Standardized closure and handover protocol between SDD Toolkit agents. Use when completing a phase and needing to direct to the next agent.
---

# Handover Protocol

This skill standardizes the transition between SDD Toolkit agents, ensuring consistency and traceability in communication.

## When to Use

- When completing a work phase (scope, requirements, feature, code, review, release)
- When passing context to the next agent in the chain
- When finishing a task and needing to indicate next steps

## Handover Structure

When finishing, you MUST use this format:

```markdown
> "🏷️ **[Artifact Name] successfully documented.**"
>
> **File Created/Updated:** `[file path]`
>
> **Summary:** [1-2 lines of what was done]
>
> **Next Step:** Use `/[command]` to start the next phase.
>
> **Handover to:** [Next Agent Name] ([emoji])
```

## Handover Map (Standard Flow)

| Current Agent | Next Agent | Command |
|---------------|------------|---------|
| Project Architect 🏛️ | Requirements Engineer 📝 | `/sdd.requirements` |
| Requirements Engineer 📝 | Feature Manager ✨ | `/sdd.feature` |
| Feature Manager ✨ | Coder 💻 | `/sdd.coder [Task_ID]` |
| Coder 💻 | QA Engineer 🔍 | `/sdd.review [Task_ID]` |
| QA Engineer 🔍 (Approved) | Release Manager 📦 | `/sdd.log` or next task |
| QA Engineer 🔍 (Rejected) | Coder 💻 | `/sdd.coder [Task_ID]` (fix) |

## Rules

1. **Never finish without handover** — The user must know exactly what to do next.
2. **Use consistent emojis** — Each agent has their fixed emoji.
3. **Cite the created file** — Always include the path of the generated artifact.
4. **Be concise** — Handover is not a summary; it's direction.

## Usage Example

```markdown
> "🏛️ **Project scope successfully documented.**"
>
> **File Created:** `.sdd-toolkit/project.md`
>
> **Summary:** Defined conceptual scope for NBA Stats Collector v1.0.0 project.
>
> **Next Step:** Use `/sdd.requirements` to detail functional requirements.
>
> **Handover to:** Requirements Engineer 📝
```
