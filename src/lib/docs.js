const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

/**
 * Generates the workflow guide and the necessary folder structure for the agents
 */
function generateWorkflowGuide(baseDir) {
    const docsDir = path.join(baseDir, 'docs');
    const logsDir = path.join(docsDir, 'logs');
    
    // Create folder structure recursively
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    // README.md content
    const content = `# 🤖 Agent Workflow Guide

This document describes the standard development workflow using the installed Agents.
The system follows a **Waterfall** process for planning (precision) and **Iterative** for execution.

---

## 1. 🏗️ Project Spec (@Project Architect)
**Role:** The Visionary.
**Goal:** Translate your vague idea into a concrete Specification with defined "Project Principles".
- **Command:** \
/dev:project "I want a Todo App that..."
- **Output:** 
`docs/project.md`

## 2. 🧱 Requirements Engineering (@Requirements Engineer)
**Role:** The Tech Lead.
**Goal:** Lock in technical decisions (Stack, Database, Libs).
- **Why?** Prevents the Coder from "inventing" architecture. Creates the "Contract".
- **Command:** 
/dev:requirements
- **Output:** 
`docs/requirements.md`

## 3. 🗺️ Roadmap Strategy (@Milestone Manager)
**Role:** The Strategist.
**Goal:** Slice the project into delivery phases (MVPs).
- **Command:** 
/dev:milestone
- **Output:** 
`docs/milestones.md`

## 4. 📋 Task Planning (@Task Planner)
**Role:** The Manager.
**Goal:** Break down a specific Milestone into atomic tasks for developers.
- **Why?** AIs fail with giant contexts. Small tasks = Perfect code.
- **Command:** 
/dev:tasks <Milestone_ID>
- **Output:** 
`docs/task.md`

## 5. 🕵️ Blueprint Audit (@Auditor)
**Role:** The Guardian.
**Goal:** Validate consistency between **Requirements** and **Tasks**.
- **Command:** 
/dev:auditor
- **Output:** 
`audit_report.md`

## 6. 💻 Implementation (@Coder)
**Role:** The Builder.
**Goal:** Execute *one task at a time* from the 
`task.md` file.
- **Command:** 
/dev:coder <Task_ID>
- **Buffer:** 
`work_log.md`

## 7. ⚖️ Quality Assurance (@QA Engineer)
**Role:** The Inspector.
**Goal:** Verify if the implementation matches the Requirements.
- **Command:** 
/dev:review <Task_ID>
- **Output:** 
`docs/logs/review_log.md`

## 8. 📦 Release Management (@Release Manager)
**Role:** The Historian.
**Goal:** Consolidate 
`work_log.md` into a permanent 
`changelog.md`.
- **Command:** 
/dev:log
- **Output:** 
`changelog.md`