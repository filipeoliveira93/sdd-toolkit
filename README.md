# sdd-toolkit (Universal Spec CLI)

CLI tool to automatically set up the development environment and install AI agents (Auditor, Coder, etc.) for various modern AI tools.

## Overview

**sdd-toolkit** is an "AI Agent Package Manager". It defines a standard squad of AI Developers and installs them directly into the context of your favorite AI Coding Assistant (such as Gemini, Roo Code, Kilo Code, OpenCode).

The main idea is to stop creating prompts from scratch and install a proven, structured workflow.

## Key Features

### 1. AI Agent Installation

Reads agnostic definitions (YAML) and converts them to specific formats:

-   **Gemini CLI:** Generates `.toml` configuration files.
-   **Roo Code / Cline:** Generates custom modes (`_custom_modes.json`) and context rules in `.roo/` or `.cline/`.
-   **GitHub Copilot:** Generates instructions in `.github/copilot-instructions.md` and agents in `.github/agents/`.
-   **Cursor:** Generates rules in `.cursor/rules/*.mdc`.
-   **Windsurf:** Generates rules in `.windsurfrules`.
-   **Trae:** Generates instructions in `.trae/instructions.md`.
-   **OpenCode:** Generates agents in `.opencode/`.
-   **OpenAI / Claude (Web):** Generates plain text prompts in the `prompts/` folder.
-   **Kilo Code:** Generates Markdown prompts (`.kilo/prompts/*.md`).

### 2. Workflow Configuration

Automates the creation of the documentation structure (`.sdd-toolkit/` and `.sdd-toolkit/logs/`) to support the agents' workflow.

## 👥 The Squad (Agent Roles)

The system works best when you follow the defined pipeline. Each agent saves its "Brain" (context) in the `.sdd-toolkit/` folder, which serves as the base for the next agent in the chain.

### 🏗️ 1. Project Architect

**"The Visionary"**
Transforms your raw idea into a professional specification. Acts as an interviewer to uncover hidden requirements.

-   **Trigger:** `/dev.project "I want an Uber clone for dog walking"`
-   **Action:** Asks clarifying questions about features, target audience, and constraints.
-   **Output:** `.sdd-toolkit/project.md` (Scope, User Stories, Fundamental Principles).

### 🧱 2. Requirements Engineer

**"The Technical Lead"**
Decides _how_ to build. Defines the technology stack, database schema, and technical boundaries based on the specification.

-   **Trigger:** `/dev.requirements`
-   **Action:** Selects libraries (e.g., "Prisma vs TypeORM"), defines API contracts and security rules.
-   **Output:** `.sdd-toolkit/requirements.md` (The "Technical Contract" the Coder must obey).

### 🗺️ 3. Milestone Manager

**"The Strategist"**
Prevents you from trying to build everything at once. Breaks the project into logical "MVPs" (Phases).

-   **Trigger:** `/dev.milestone`
-   **Output:** `.sdd-toolkit/milestones.md` (e.g., Phase 1: Auth, Phase 2: Payment, Phase 3: GPS).

### 📋 4. Task Planner

**"The Project Manager"**
Takes **ONE Milestone** and breaks it down into small, atomic tasks for the AI Coder.

-   **Reasoning:** AI Coders hallucinate less when the context is small.
-   **Trigger:** `/dev.tasks 1` (Plan Milestone 1)
-   **Output:** `.sdd-toolkit/task.md` (A checklist of 5-10 specific file operations).

### 🕵️ 5. Auditor

**"The Guardian"**
A safety check before coding starts. Reads the **Requirements** and **Task Plan** to ensure nothing was lost in translation.

-   **Trigger:** `/dev.auditor`
-   **Action:** "Hey, you planned the Login UI but forgot the 'Forgot Password' flow mentioned in the Requirements."
-   **Output:** `audit_report.md` (Pass/Fail).

### 💻 6. Coder

**"The Senior Developer"**
The executor. Runs ONE checklist task at a time.

-   **Features:**
    -   **Context Aware:** Reads `project.md` to know "Project Principles" (e.g., "Use Functional Components").
    -   **Safety:** Checks `.gitignore` before creating files.
    -   **TDD:** Can write tests before code if requested.
-   **Trigger:** `/dev.coder 1.1` (Implement Task 1.1)
-   **Output:** Writes code in `src/` and logs in `work_log.md`.

### ⚖️ 7. QA Engineer

**"The Reviewer"**
Simulates a Pull Request review. Checks if the code matches the Requirements contracts.

-   **Trigger:** `/dev.review 1.1`
-   **Action:** Reads the code and `requirements.md`. If variables are poorly named or logic is insecure, it REJECTS the task.

### 📦 8. Release Manager

**"The Historian"**
Consolidates the messy daily `work_log.md` into a clean `CHANGELOG`.

-   **Trigger:** `/dev.log`

## 🛠️ On-Demand Toolkit

### 🏗️ DevOps Engineer

**"The Config Specialist"**
Call this agent specifically for infrastructure tasks, so you don't waste the main agent's context.

-   **Trigger:** `/dev.ops`
-   **Examples:** "Create Dockerfile", "Setup Github Actions", "Configure ESLint".

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

## How the CLI Works

When you run `npx sdd-toolkit`, the installation wizard starts:

1.  **Initialization:** The wizard asks which shell you use (Windows or Unix) and generates a custom workflow guide in the `.sdd-toolkit/` folder.
2.  **Agent Building:** The wizard reads agent definitions (either from the `definitions/` folder or a local `agents.md` file) and "compiles" them into your chosen AI assistant's format.
3.  **Supported Destinations:**

    -   **Gemini CLI:** Generates `.toml` files in `.gemini/commands/`.
    -   **Roo Code / Cline:** Generates custom modes (`_custom_modes.json`) and rules in `.roo/` or `.cline/`.
    -   **GitHub Copilot:** Generates instructions in `.github/copilot-instructions.md` and agents in `.github/agents/`.
    -   **Kilo Code:** Generates workflows in `.kilocode/workflows/`.
    -   **OpenCode:** Generates files in `.opencode/command/`.
    -   **Others:** Support for Cursor, Windsurf, Trae, OpenAI/Claude Web.

This way, **sdd-toolkit** acts as a bridge between agent behavior definitions and the tool you use for coding, ensuring your AI "team" is always configured and ready to work.

## Project Structure

-   `src/`: CLI source code.
-   `definitions/`: YAML agent definitions (agnostic).

## License

MIT
