const fs = require('fs');
const path = require('path');

/**
 * Generates the necessary folder structure for the agents
 */
function generateWorkflowGuide(baseDir) {
    const docsDir = path.join(baseDir, 'docs');
    const logsDir = path.join(docsDir, 'logs');
    
    let created = false;

    // Create folder structure recursively
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
        created = true;
    }

    const guidelinesPath = path.join(docsDir, 'guidelines.md');

    if (!fs.existsSync(guidelinesPath)) {
        const guidelinesContent = `# 📜 Project Guidelines

This document defines the "Universal Laws" of the project. All agents must read this file before executing tasks.

---

## 🏗️ Architecture Patterns
- [Ex: Use Clean Architecture]
- [Ex: Layers: Entities, UseCases, Repositories]

## 💻 Code Conventions
- [Ex: Use ESModules (import/export)]
- [Ex: Semicolons: true]
- [Ex: Naming: camelCase for variables, PascalCase for classes]

## 🛠️ Tech Stack & Versions
- Node.js: >=18.0.0

## 🛡️ Security & Performance
- [Ex: Never commit .env]
- [Ex: Validate all inputs with Zod/Joi]
`;
        fs.writeFileSync(guidelinesPath, guidelinesContent);
        created = true;
    }
    
    return created;
}

module.exports = { generateWorkflowGuide };