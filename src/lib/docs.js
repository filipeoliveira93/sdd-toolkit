const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

/**
 * Gera o guia de workflow e a estrutura de pastas necessária para os agentes
 */
function generateWorkflowGuide(baseDir) {
    const docsDir = path.join(baseDir, 'docs');
    const logsDir = path.join(docsDir, 'logs');
    
    // Cria a estrutura de pastas recursivamente (Funciona em Windows, Mac e Linux)
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const readmePath = path.join(docsDir, 'README.md');
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
    }

    // Conteúdo do README.md
    const content = `# 🧭 Project Context Dashboard

Este arquivo serve como índice central para a inteligência do projeto.
Agentes de IA devem consultar este mapa para entender o estado atual.

## 📁 Documentação Viva (v3)
| Documento | Função | Status (IA check) |
|-----------|--------|-------------------|
| [📜 guidelines.md](./guidelines.md) | Leis e Padrões do Projeto | 🛑 **Mandatory** |
| [🔭 context.md](./context.md) | Relatório de Contexto/Exploração | ℹ️ Optional |
| [📐 spec.md](./spec.md) | Especificação Unificada (Product + Tech) | ✅ Active |
| [🗺️ plan.md](./plan.md) | Plano de Execução (Tasks) | ⚡ Dynamic |
| [📝 work_log.md](../work_log.md) | Diário de Bordo | 📝 Append Only |

---

# 🚀 sdd-toolkit Workflow (v3)

Fluxo simplificado para máxima eficiência.

## 0. 🔭 Explore (@Explorer)
**Comando:** \`/dev.explore "Analise a autenticação atual"\`
**Saída:** \`docs/context.md\`
*Use antes de começar para entender o terreno.*

## 1. 📐 Spec (@Spec Maker)
**Comando:** \`/dev.spec "Quero um sistema de login"\`
**Saída:** \`docs/spec.md\`
*Define O QUE (Negócio) e COMO (Stack).*

## 2. 🗺️ Plan (@Planner)
**Comando:** \`/dev.plan "Fase 1"\`
**Saída:** \`docs/plan.md\`
*Quebra a Spec em tarefas atômicas.*

## 3. 🔨 Build (@Builder)
**Comando:** \`/dev.build "Task 1"\`
**Log:** \`work_log.md\`
*Executa o plano seguindo as guidelines.*

## 4. ⚖️ Check (@Checker)
**Comando:** \`/dev.check "Task 1"\`
**Saída:** \`audit_report.md\`
*Valida qualidade e segurança.*

## 5. 📦 Finish
**Comando:** \`npm run sdd:archive\`
*Move Spec/Plan atual para \`docs/archive/\` e limpa o quadro.*

---
**🎸 Solo Mode:** Use \`/dev.solo\` para alterações independentes ou refatorações rápidas.
`;
    
    // Garante spec.md e context.md vazios se não existirem
    if (!fs.existsSync(path.join(docsDir, 'spec.md'))) fs.writeFileSync(path.join(docsDir, 'spec.md'), '');
    if (!fs.existsSync(path.join(docsDir, 'context.md'))) fs.writeFileSync(path.join(docsDir, 'context.md'), '');


    if (!fs.existsSync(readmePath)) {
        fs.writeFileSync(readmePath, content);
        return true;
    }
    
    return true; // Retorna true indicando que a estrutura foi garantida
}

module.exports = { generateWorkflowGuide };
