# Session Log: Native Slash Command Integration

**Date:** 2026-01-03
**Status:** Completed

## Changes
- **Windsurf Support:** Updated installation logic to use `.windsurf/workflows/` and added frontmatter for auto-discovery.
- **Claude Code Support:** Added new transformer `toClaudeCommand` and installation path `.claude/commands/openspec/`.
- **Transformers Polish:** Updated `toCursorMDC` and others to ensure metadata matches the requirements of modern AI assistants.

## Reasoning
To provide a first-class experience, agents should be visible in the IDE's command palette. By generating native configuration files, we reduce the manual effort of copy-pasting prompts and make the workflow more intuitive.
