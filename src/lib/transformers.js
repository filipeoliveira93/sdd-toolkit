const { TRANSLATIONS } = require('./messages');

/**
 * Returns the language rule based on the locale
 * @param {string} locale - 'en', 'pt-br', 'es', etc.
 */
function getLanguageRule(locale = 'en') {
    const normalized = locale.toLowerCase().replace('-', '_');
    
    // Mapping locale slug to property key in messages
    const keyMap = {
        'en': 'EN',
        'pt_br': 'PT_BR',
        'es': 'ES'
    };

    const ruleKey = keyMap[normalized] || 'EN';
    
    // Get dictionary for the target locale or fallback to EN
    const dict = TRANSLATIONS[normalized] || TRANSLATIONS['en'];
    
    return dict.LANGUAGE_RULES[ruleKey];
}

/**
 */
function toGeminiTOML(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    // Escapa aspas duplas na descrição
    const description = (agent.description || agent.role).replace(/"/g, '\"');
    
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
    const escapedPrompt = fullPrompt.replace(/"""/g, '\"\"\"');
    
    // Monta o TOML final
    let toml = `description = "${description}"\n`;
    toml += `prompt = """\n${escapedPrompt}\n"""\n`;
    
    if (allRules.length > 0) {
        toml += 'rules = [\n';
        allRules.forEach(rule => {
            const escaped = rule.replace(/\\/g, '\\\\').replace(/"/g, '\"');
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
    const parts = [
        `# ${agent.name} (${agent.role})`,
        `\n${agent.systemPrompt.trim()}\n`
    ];

    const allRules = [languageRule, ...(agent.rules || [])];

        parts.push(`## Rules & Guidelines`);
    }

    return {
        slug: slug,
        roleDefinition: parts.join('\n'),
        groups: ["read", "edit", "browser", "command", "mcp"]
    };
}

/**
 * Converte para Markdown do Kilo Code
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
 * Converte para Windsurf Workflow (.windsurf/workflows/*.md)
 * Cascade reconhece esses arquivos como comandos de workflow
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
 * Converte para Claude Code Command (.claude/commands/agents/*.md)
 */
function toClaudeCommand(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];

    return `---
name: Agent: ${agent.name}
description: ${agent.description || agent.role}
category: Agents
---
# ${agent.name} ${agent.emoji}

Role: ${agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
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

/**
 * Converte para OpenCode Agent (.opencode/agent/*.md)
 */
function toOpenCodeAgent(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];

    // Configurar permissões baseado no tipo de agente
    const isReadOnly = agent.slug.includes('review') || agent.slug.includes('audit') || agent.name.includes('Architect') || agent.role.includes('QA') || agent.role.includes('Review');
    const tools = {
        write: !isReadOnly,
        edit: !isReadOnly,
        bash: !isReadOnly
    };

    const frontmatter = {
        description: agent.description || agent.role,
        mode: 'subagent',
        temperature: 0.3,
        tools
    };

    const frontmatterStr = Object.entries(frontmatter)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');

    return `---
${frontmatterStr}
---

# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

${agent.systemPrompt.trim()}

## Rules
${allRules.map(rule => `- ${rule}`).join('\n')}
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
}

module.exports = {
    toGeminiTOML,
    toRooConfig,
    toKiloMarkdown,
    toCopilotInstructions,
    toCursorMDC,
    toWindsurfRules,
    toClaudeCommand,
    toPlainSystemPrompt,
    toOpenCodeAgent
};
