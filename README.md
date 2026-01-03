# sdd-toolkit (Universal Spec CLI)

CLI tool to automatically set up the development environment and install AI agents (Auditor, Coder, etc.) for various modern AI tools.

## Overview

**sdd-toolkit** is an "AI Agent Package Manager". It defines a standard squad of AI Developers and installs them directly into the context of your favorite AI Coding Assistant (such as Gemini, Roo Code, Kilo Code, OpenCode).

The main idea is to stop creating prompts from scratch and install a proven, structured workflow.

## 🚀 Key Features

### 1. Smart & Agile Workflow
- **Hybrid Flow:** Supports both "Waterfall" planning (for new projects) and "Agile" execution (for hotfixes/features).
- **Smart Context:** Agents automatically scan your `package.json`, `go.mod`, or `requirements.txt` to understand your stack. No more explaining "I use React" every time.
- **Unified Memory:** All context is stored in a hidden `.sdd-toolkit/` folder, keeping your root directory clean.

### 2. "Power Commands"
Agents come equipped with special execution modes triggered by commands:
- **`/flow:debug`**: Paste an error log, and the Coder enters "Surgical Mode" to fix it immediately.
- **`/flow:tdd`**: Forces the Red-Green-Refactor cycle for high-quality code.
- **`/flow:refactor`**: Applies Clean Code principles to an existing file.
- **`/flow:gen-tests`**: Automatically generates unit tests for your code.
- **`/flow:security`**: Scans your code/plan for vulnerabilities (OWASP).
- **`/flow:sync`**: Updates the documentation (`project.md`) to match the actual code (Reverse Engineering).

### 3. AI Agent Installation
Reads agnostic definitions (YAML) and converts them to specific formats:
- **Gemini CLI:** Generates `.toml` configuration files.
-   **Roo Code / Cline:** Generates custom modes (`_custom_modes.json`) and context rules in `.roo/` or `.cline/`.
-   **GitHub Copilot:** Generates instructions in `.github/copilot-instructions.md` and agents in `.github/agents/`.
-   **Cursor:** Generates rules in `.cursor/rules/*.mdc`.
-   **Windsurf:** Generates rules in `.windsurfrules`.
-   **Trae:** Generates instructions in `.trae/instructions.md`.
-   **OpenCode:** Generates agents in `.opencode/`.
-   **Kilo Code:** Generates Markdown prompts (`.kilo/prompts/*.md`).

## 👥 The Squad (Agent Roles)

The system installs a team of specialized agents:

### 🏗️ Strategic Agents
- **@Project Architect:** Defines the scope and principles.
- **@Requirements Engineer:** Defines the tech stack (Auto-detected).
- **@Milestone Manager:** Creates the roadmap.

### ⚡ Execution Agents
- **@Task Planner:** Breaks down milestones into atomic tasks.
- **@Feature Manager:** The agile entry point. Handles requests like "Add Google Login" and decides the best path (Hotfix vs Milestone).
- **@Coder:** The senior developer. Supports TDD, Debug, Refactor, and Test Generation modes.

### 🛡️ Quality Agents
- **@Auditor:** Checks consistency between requirements and tasks.
- **@QA Engineer:** Reviews code against the spec.
- **@DevOps Engineer:** Handles Docker, CI/CD, and Configs.

## Installation and Usage

You can run the tool directly via `npx` without prior installation:

```bash
npx sdd-toolkit
```

Or install globally:

```bash
npm install -g sdd-toolkit
sdd-toolkit
```

## How it Works

1.  **Initialization:** The wizard detects your tools and sets up the hidden `.sdd-toolkit/` context folder.
2.  **Agent Building:** It reads the "Thinking Protocols" (YAML) and compiles them into your AI tool's native format.
3.  **Execution:** You interact with the agents using the `/dev:*` commands or the new `/flow:*` triggers.

## Project Structure

-   `src/`: CLI source code.
-   `definitions/`: YAML agent definitions (agnostic).
-   `templates/`: Documentation templates.

## License

MIT
