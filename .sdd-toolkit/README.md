# 🤖 Agent Workflow Guide

This document describes how to operate the "AI Squad" installed by `sdd-toolkit`.
The system adopts a **Hybrid approach**: Structured Planning for large features and Agile Execution for day-to-day tasks.

---

## ⚡ Workflows

### 1. 🟢 Quick Flow (Hotfixes & Small Features)
Use for bugs, minor improvements, or when you already know what you want.

1.  **Start:** Call the `@Feature Manager`.
    -   **Command:** `/dev:feature "Fix login error"` or `/dev:feature "Add logout button"`
2.  **Decision:** The agent will ask if you want to add the task directly to `task.md` (Current Sprint) or create a new Milestone.
3.  **Execution:** The agent inserts the task into the plan.
4.  **Code:** Call the `@Coder` to execute the new task.

### 2. 🔵 Structured Flow (New Projects or Large Modules)
Use to start a project from scratch or for major refactors.

1.  **Specification:** `/dev:project` (Generates `project.md`)
2.  **Requirements:** `/dev:requirements` (Defines Stack & Rules)
3.  **Roadmap:** `/dev:milestone` (Breaks into phases)
4.  **Planning:** `/dev:tasks` (Generates technical tasks)
5.  **Execution:** `/dev:coder` (Implements)

---

## 🛠️ Power Commands

Some agents have special modes to speed up your work. Use them to skip conversations and get straight to the action.

### `@Coder`
-   **`/flow:debug`**
    -   **Usage:** `/flow:debug <Paste Error Log Here>`
    -   **Action:** The agent skips theoretical explanations, analyzes the stack trace, and provides *only* the corrected code.
-   **`/flow:tdd`**
    -   **Usage:** `/flow:tdd <Feature Description>`
    -   **Action:** Initiates the Red-Green-Refactor cycle. It first creates the failing test, waits for you to run it, and only then writes the code.
-   **`/flow:docs`**
    -   **Usage:** `/flow:docs` (with a file open)
    -   **Action:** Adds JSDoc/Comments to existing code without changing the logic.

---

## 🧠 Cognitive Protocols

The agents have been upgraded to be smarter and more transparent.

1.  **Thinking Process:**
    -   Agents like `@Auditor`, `@QA`, and `@DevOps` now "think before they speak." They follow a sequential mental checklist to avoid hallucinations.
    -   *Example:* The Auditor cross-references every Requirement with the Tasks before giving the green light.

2.  **Justification Protocol (The "Why?"):**
    -   Strategic agents (`@Project`, `@Requirements`, `@Coder`) are required to justify their decisions.
    -   *Example:* The Coder won't just use a library; it will explain *why* it chose that specific library for your context.

3.  **Smart Context (Config Scan):**
    -   The `@Requirements Engineer` automatically reads your `package.json`, `Cargo.toml`, or `requirements.txt`.
    -   You no longer need to explain your stack repeatedly.

---

## 👥 The Squad Roles

### 🏗️ 1. Project Architect
**Role:** The Visionary.
**Goal:** Translate your idea into a Specification.
- **Output:** `.sdd-toolkit/project.md`

### 🧱 2. Requirements Engineer
**Role:** The Tech Lead.
**Goal:** Lock in technical decisions and Stack.
- **Feature:** *Config Scan* (Reads your stack automatically).
- **Output:** `.sdd-toolkit/requirements.md`

### 🗺️ 3. Milestone Manager
**Role:** The Strategist.
**Goal:** Generate the delivery roadmap.
- **Output:** `.sdd-toolkit/milestones.md`

### 📋 4. Task Planner
**Role:** The Project Manager.
**Goal:** Break down Milestones into atomic tasks.
- **Feature:** *Update Mode* (Allows adding tasks without recreating the file).
- **Output:** `.sdd-toolkit/task.md`

### ✨ 5. Feature Manager
**Role:** The Facilitator.
**Goal:** Inject new demands without bureaucracy.
- **Action:** Decides if a new feature is a Task, Milestone, or Project Change.

### 💻 6. Coder
**Role:** The Builder.
**Goal:** Execute code with quality.
- **Modes:** Standard, TDD, Debug, Docs.
- **Buffer:** `work_log.md`

### ⚖️ 7. QA Engineer
**Role:** The Inspector.
**Goal:** Validate implementation against Requirements.
- **Output:** `.sdd-toolkit/logs/review_log.md`

### 🏗️ 8. DevOps Engineer
**Role:** Infrastructure Specialist.
**Goal:** Docker, CI/CD, Linters, Configs.
- **Protocol:** *Security First* (Never commits secrets).
