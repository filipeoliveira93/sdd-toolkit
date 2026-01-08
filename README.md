# sdd-toolkit (Universal Spec CLI)

![npm version](https://img.shields.io/npm/v/sdd-toolkit)
![License: MIT](https://img.shields.io/npm/l/sdd-toolkit)
![Downloads](https://img.shields.io/npm/dm/sdd-toolkit)

CLI tool to automatically set up the development environment and install AI agents (Auditor, Coder, etc.) for various modern AI tools.

## Overview

**sdd-toolkit** is an "AI Agent Package Manager". It defines a standard squad of AI Developers and installs them directly into the context of your favorite AI Coding Assistant (such as Gemini, Roo Code, Kilo Code, OpenCode).

The main idea is to stop creating prompts from scratch and install a proven, structured workflow.

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#-key-features)
- [The Squad](#-the-squad-agent-roles)
- [Installation and Usage](#installation-and-usage)
- [How it Works](#how-it-works)
- [Development Workflow](#development-workflow)
- [AI Tool Commands](#ai-tool-commands)
- [Generated Files Structure](#generated-files-structure)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [FAQ](#-frequently-asked-questions)
- [Project Structure](#project-structure)
- [License](#license)

## 🚀 Key Features

### 1. Smart & Agile Workflow
- **Hybrid Flow:** Supports both "Waterfall" planning (for new projects) and "Agile" execution (for hotfixes/features).
- **Smart Context:** Agents automatically scan your `package.json`, `go.mod`, or `requirements.txt` to understand your stack. No more explaining "I use React" every time.
- **Unified Memory:** All context is stored in a hidden `.sdd-toolkit/` folder, keeping your root directory clean.

### 2. Multi-Language Support
The toolkit supports English, Portuguese (Brazil), and Spanish. Agents automatically adapt their responses to your preferred language.

### 3. AI Agent Installation
Reads agnostic definitions (YAML) and converts them to specific formats:
- **Gemini CLI:** Generates `.toml` configuration files.
-   **Roo Code:** Generates agents in `.roo/commands/*.md`.
-   **Cline:** Generates custom modes (`_custom_modes.json`) and context rules in `.cline/`.
-   **GitHub Copilot:** Generates instructions in `.github/prompts.md` and agents in `.github/prompts/*.md`.
-   **Cursor:** Generates rules in `.cursor/commands/*.mdc`.
-   **Windsurf:** Generates workflows in `.windsurf/workflows/*.md`.
-   **Trae:** Generates instructions in `.trae/instructions.md`.
-   **OpenCode:** Generates agents in `.opencode/commands/*.md`.
-   **Kilo Code:** Generates Markdown prompts (`.kilocode/workflows/*.md`).

## 👥 The Squad (Agent Roles)

The system installs a team of specialized agents:

### 🏗️ Strategic Agents
- **@Project Architect:** Defines the scope and principles.
- **@Requirements Engineer:** Defines the tech stack (Auto-detected).

### ⚡ Execution Agents
- **@Feature Manager:** Manages features, milestones, and tasks.
- **@Coder:** The senior developer. Implements code following SOLID principles.

### 🛡️ Quality Agents
- **@QA Engineer:** Reviews code against the spec.
- **@Release Manager:** Consolidates logs and manages the changelog.
- **@SDD Helper:** Provides access to all agents and help.

## Installation and Usage

### Initial Setup
Run the tool directly via `npx` without prior installation:

```bash
npx sdd-toolkit
```

### View Project Dashboard
Check your current project status:

```bash
sdd-toolkit view
```

### Upgrade Existing Installation
Update installed agents without reconfiguration:

```bash
sdd-toolkit upgrade
```

### Global Installation
Or install globally:

```bash
npm install -g sdd-toolkit
sdd-toolkit
```

## How it Works

1.  **Initialization:** The wizard detects your tools and sets up the hidden `.sdd-toolkit/` context folder.
2.  **Agent Building:** Reads the agent definitions (YAML) and compiles them into your AI tool's native format.
3.  **Execution:** Interact with agents using simplified commands (e.g., `/project`, `/coder`, `/feature`).

## Development Workflow

The sdd-toolkit provides a structured workflow with specialized agents:

### 1. Define Project
- Command: `/project`
- Creates `.sdd-toolkit/project.md` with project scope and principles.

### 2. Define Requirements
- Command: `/requirements`
- Analyzes your stack and creates `.sdd-toolkit/requirements.md`.

### 3. Plan Features
- Command: `/feature`
- Creates `.sdd-toolkit/features/[name].md` with milestones and tasks.

### 4. Implement Code
- Command: `/coder [task-id]`
- Implements tasks from feature plan and logs work.

### 5. Review Code
- Command: `/review [task-id]`
- QA Engineer reviews implementation against requirements.

### 6. Release
- Command: `/log` or `/dev:release`
- Consolidates logs into changelog and archives completed work.

## AI Tool Commands

Once agents are installed, use these commands in your AI coding assistant:

### Access Agents
- **`/sdd`** - Display available agents and help
- **`/project`** - Activate Project Architect
- **`/requirements`** - Activate Requirements Engineer
- **`/feature`** - Activate Feature Manager
- **`/coder`** - Activate Coder
- **`/review`** - Activate QA Engineer
- **`/log`** - Activate Release Manager

### Special Commands
- **`/dev:review [Task_ID]`** - Trigger code review for a specific task
- **`/dev:release`** - Consolidate logs and create changelog

## Generated Files Structure

After running `sdd-toolkit`, the following structure is created in your project:

```
.sdd-toolkit/
├── project.md              # Project scope and principles
├── requirements.md         # Technical requirements and stack
├── guidelines.md           # Project development guidelines
├── milestones.md           # Development roadmap
├── task.md                # Task execution backlog
├── features/               # Individual feature specifications
│   └── [feature-name].md
├── logs/
│   ├── executions/         # Task execution logs
│   ├── reviews/           # Code review reports
│   └── archive/          # Archived completed work
└── agents/               # Custom agent definitions (optional overrides)
```

## Project Structure

- `definitions/`: YAML agent definitions
- `templates/`: Documentation templates
- `src/`: CLI source code

## Usage Examples

### Complete Workflow: New Feature

1. **Define project:**
   ```
   /project
   ```
   Creates `.sdd-toolkit/project.md` with scope and principles.

2. **Define technical requirements:**
   ```
   /requirements
   ```
   Analyzes your `package.json`/`go.mod` and creates `.sdd-toolkit/requirements.md`.

3. **Plan a new feature:**
   ```
   /feature
   ```
   Specify your feature (e.g., "Add user authentication"). Creates `.sdd-toolkit/features/auth.md`.

4. **Implement tasks:**
   ```
   /coder MT01-task-1
   ```
   Coder implements task following SOLID principles and logs work.

5. **Review implementation:**
   ```
   /review MT01-task-1
   ```
   QA Engineer validates implementation against requirements.

6. **Release changes:**
   ```
   /log
   ```
   Consolidates logs into changelog and archives completed work.

### Quick Bug Fix

1. **Use Coder directly:**
   ```
   /coder fix-login-bug
   ```
   Coder analyzes, fixes, and documents change.

2. **Review fix:**
   ```
   /review fix-login-bug
   ```
   Validates that fix meets requirements.

## License

MIT

---

**Nota:** Uma versão em português deste README está disponível em [README.pt.md](README.pt.md).

## Troubleshooting

### Agents not appearing in your AI tool

**Problem:** After running `sdd-toolkit`, agents don't appear in your AI coding assistant.

**Solutions:**
- **Roo Code/Cline:** Check if you've configured Custom Modes in your settings. See the warning message after installation.
- **Cursor:** Restart the IDE after installation.
- **OpenCode:** Refresh the command palette.
- **Gemini CLI:** Verify `.gemini/commands/dev/` folder exists with `.toml` files.

### Permission denied when running sdd-toolkit

**Problem:** Getting "Permission denied" or EACCES error when running `npx sdd-toolkit`.

**Solutions:**
- **Option 1:** Run with elevated permissions (not recommended):
  ```bash
  sudo npx sdd-toolkit
  ```
- **Option 2:** Fix npm permissions:
  ```bash
  npm config set prefix ~/.npm-global
  export PATH=~/.npm-global/bin:$PATH
  ```
- **Option 3:** Install globally with sudo:
  ```bash
  sudo npm install -g sdd-toolkit
  ```

### Agents responding in wrong language

**Problem:** Agents are not responding in your preferred language.

**Solution:**
- Re-run `sdd-toolkit` and ensure you select the correct language during setup (English, Portuguese, or Spanish).
- Or manually edit the `LANGUAGE_RULES` in your agent files.

### Stack profile not applying rules

**Problem:** Selected stack profile rules are not being used by agents.

**Solution:**
- The stack profile is only applied during initial installation or upgrade. Run:
  ```bash
  sdd-toolkit upgrade
  ```
  Ensure you select the same stack profile again.

### `.sdd-toolkit/` folder not created

**Problem:** The hidden folder structure is not created after installation.

**Solutions:**
- Check that you're running the command from your project's root directory (where `package.json` is located).
- Verify write permissions in the directory.
- Check for error messages during installation.

## ❓ Frequently Asked Questions

**Q: Can I use multiple AI assistants simultaneously?**

A: Yes! You can install agents for multiple AI tools in the same project. Each tool has its own folder structure (`.roo/`, `.cline/`, `.cursor/`, etc.) and they can coexist without conflicts.

**Q: How do I update agents after initial setup?**

A: Run `sdd-toolkit upgrade`. This will update all installed agents without requiring you to reconfigure your stack profile or global rules.

**Q: Can I customize agent definitions?**

A: Yes! Create custom YAML files in `.sdd-toolkit/agents/` folder. The toolkit will use your custom versions instead of the default ones. You can copy and modify the default definitions from the `definitions/` folder in the toolkit.

**Q: What happens if I run `sdd-toolkit` multiple times?**

A: The tool is idempotent - running it again will only update or regenerate missing files without duplicating existing configurations. Your existing project docs in `.sdd-toolkit/` will be preserved.

**Q: Can I use this with projects that already have existing code?**

A: Yes! The "Requirements Engineer" agent can analyze your existing `package.json`, `go.mod`, or `requirements.txt` to auto-detect your stack. The "Project Architect" can also formalize existing projects in "hybrid" mode.

**Q: Do I need to commit `.sdd-toolkit/` to my repository?**

A: Yes, it's recommended. The `.sdd-toolkit/` folder contains your project documentation, specifications, and agent configurations. Committing them ensures consistency across your team and preserves context for future sessions.

**Q: How do I remove sdd-toolkit from my project?**

A: Simply delete the `.sdd-toolkit/` folder and any tool-specific folders (`.roo/`, `.cline/`, `.cursor/`, etc.). These are all generated files and won't affect your source code.

**Q: Are my code changes tracked by sdd-toolkit?**

A: No, sdd-toolkit only manages documentation and AI agent configurations. It does not track code changes, read your source files, or interfere with version control.

**Q: Can I add my own stack profiles?**

A: Currently, stack profiles are hardcoded in the toolkit. To add a custom profile, you can use the "Global Rules" feature during setup to inject your own conventions, or you can fork the repository and add your profile to `src/lib/profiles.js`.

**Q: Is this suitable for enterprise projects?**

A: Yes, sdd-toolkit is designed to scale. The `.sdd-toolkit/` folder can be committed to your repository, ensuring all team members use the same agent configurations and follow the same development principles defined in `guidelines.md`.
