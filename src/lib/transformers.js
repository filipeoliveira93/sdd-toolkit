const { MESSAGES } = require('./messages');

/**
 * Returns the language rule based on the locale
 * @param {string} locale - 'en', 'pt-br', etc.
 */
function getLanguageRule(locale = 'en') {
    const normalized = locale.toLowerCase();
    if (normalized === 'pt-br') return MESSAGES.LANGUAGE_RULES.PT_BR;
    return MESSAGES.LANGUAGE_RULES.EN;
}

/**
 * Converte definição do agente para TOML do Gemini CLI
 */
function toGeminiTOML(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    // Escapa aspas duplas na descrição
    const description = (agent.description || agent.role).replace(/"/g, '\\"');
    
    // Constrói o prompt completo
    const parts = [
        `# Identity`,
        `You are **${agent.name}** ${agent.emoji}`,
        `Role: ${agent.role}\n`,
        `# Core Instructions`,
        agent.systemPrompt.trim(),
        '\n'
    ];

    const allRules = [languageRule, ...(agent.rules || [])];

    if (allRules.length > 0) {
        parts.push(`# Rules & Guidelines`);
        allRules.forEach(rule => parts.push(`- ${rule}`));
        parts.push('\n');
    }

    const fullPrompt = parts.join('\n');
    
    // Escapa aspas triplas para o bloco multilinha TOML
    const escapedPrompt = fullPrompt.replace(/"""/g, '\\"\\\"\\\"');
    
    // Monta o TOML final
    let toml = `description = "${description}"\n`;
    toml += `prompt = """\n${escapedPrompt}\n"""\n`;
    
    // Mantém rules como array separado se a ferramenta suportar (Gemini CLI suporta)
    if (allRules.length > 0) {
        toml += 'rules = [\n';
        allRules.forEach(rule => {
            const escaped = rule.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            toml += `  "${escaped}",\n`;
        });
        toml += ']\n';
    }

    return toml;
}

/**
 * Converte para configuração de Custom Mode do Roo Code / Cline (JSON)
 */
function toRooConfig(agent, slug, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const promptParts = [
        `# ${agent.name} (${agent.role})`,
        `\n${agent.systemPrompt.trim()}\n`
    ];

    const allRules = [languageRule, ...(agent.rules || [])];

    if (allRules.length > 0) {
        promptParts.push(`## Rules & Guidelines`);
        allRules.forEach(rule => promptParts.push(`- ${rule}`));
    }

    return {
        slug: slug,
        name: `${agent.emoji} ${agent.name}`,
        roleDefinition: promptParts.join('\n'),
        groups: ["read", "edit", "browser", "command", "mcp"]
    };
}

/**
 * Converte para Markdown do Kilo Code
 */
function toKiloMarkdown(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const parts = [
        `<!--- Kilo Code Agent Config --->`,
        `# ${agent.name} ${agent.emoji}`,
        `**Role**: ${agent.role}\n`,
        `## Instructions`,
        agent.systemPrompt.trim(),
        '\n'
    ];

    const allRules = [languageRule, ...(agent.rules || [])];

    if (allRules.length > 0) {
        parts.push(`## Constraints`);
        allRules.forEach(rule => parts.push(`- ${rule}`));
    }

    return parts.join('\n');
}

/**
 * Converte para Instruções do GitHub Copilot (.github/copilot-instructions.md)
 */
function toCopilotInstructions(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const parts = [
        `<!-- GitHub Copilot Instructions for ${agent.name} -->`,
        `# Identity and Role`,
        `You are **${agent.name}** ${agent.emoji}.`,
        `**Role**: ${agent.role}`,
        `\n## Core Instructions`,
        agent.systemPrompt.trim(),
        '\n'
    ];

    const allRules = [languageRule, ...(agent.rules || [])];

    if (allRules.length > 0) {
        parts.push(`## Rules & Guidelines`);
        allRules.forEach(rule => parts.push(`- ${rule}`));
    }
    
    // Adiciona uma seção de estilo de resposta para garantir conformidade
    parts.push(`\n## Response Style`);
    parts.push(`- Be concise and objective.`);
    parts.push(`- Follow the project conventions defined in the workspace.`);

    return parts.join('\n');
}

/**
 * Converte para Cursor Rules (.mdc)
 * Inclui Frontmatter para Contexto
 */
function toCursorMDC(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    // Tenta inferir globs baseados no papel do agente
    let globs = "*";
    const roleLower = agent.slug.toLowerCase();
    
    if (roleLower.includes('test') || roleLower.includes('qa')) globs = "*.test.*, *.spec.*, **/tests/**";
    if (roleLower.includes('css') || roleLower.includes('style')) globs = "*.css, *.scss, *.tailwind";
    if (roleLower.includes('sql') || roleLower.includes('db')) globs = "*.sql, *.prisma, *.schema";

    const allRules = [languageRule, ...(agent.rules || [])];

    return `--- 
description: ${agent.description || agent.role}
globs: ${globs}
---
# ${agent.name} ${agent.emoji}

Role: ${agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
}

/**
 * Converte para Windsurf (.windsurfrules)
 */
function toWindsurfRules(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];

    return `# ${agent.name} ${agent.emoji} Rules

Role: ${agent.role}

## Core Logic
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
}

/**
 * Converte para System Prompt Puro (OpenAI/Claude/Web)
 */
function toPlainSystemPrompt(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];
    
    return `You are ${agent.name} ${agent.emoji}
Role: ${agent.role}

[SYSTEM INSTRUCTIONS]
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '[GUIDELINES]\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
}

/**
 * Converte para Trae Instructions
 */
function toTraeRules(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];

    return `<!-- Trae Workspace Rules -->
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## Context & Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Constraints\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
}

module.exports = { 
    toGeminiTOML, 
    toRooConfig, 
    toKiloMarkdown, 
    toCopilotInstructions,
    toCursorMDC,
    toWindsurfRules,
    toPlainSystemPrompt,
    toTraeRules
};