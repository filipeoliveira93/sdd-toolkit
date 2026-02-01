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
 * Converte para Gemini CLI Skill (.gemini/skills/<name>/SKILL.md)
 * Ref: https://github.com/google-gemini/gemini-cli
 */
function toGeminiSkill(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];

    // Generate trigger description for Gemini to know when to activate
    const triggerHints = `Use when working on ${agent.role.toLowerCase()} tasks.`;

    return `---
name: ${agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}
description: ${agent.description || agent.role}. ${triggerHints}
---
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
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
 * Converte para Kilo Code Skill (.kilocode/skills/<name>/SKILL.md)
 * Ref: https://kilo.ai/docs/skills
 */
function toKiloSkill(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];
    const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return `---
name: ${skillName}
description: ${agent.description || agent.role}. Use when working on ${agent.role.toLowerCase()} tasks.
---
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
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
 * Converte para Cursor Skill (.cursor/skills/<nome>/SKILL.md)
 * Formato oficial: https://cursor.com/docs/context/skills
 */
function toCursorSkill(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];
    const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return `---
name: ${skillName}
description: ${agent.description || agent.role}. Use when working on ${agent.role.toLowerCase()} tasks.
---
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## When to Use
- Use this skill when working on ${agent.role.toLowerCase()} tasks
- This skill is helpful for ${agent.description || agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\\n' + allRules.map(r => `- ${r}`).join('\\n') : ''}
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
 * Converte para Claude Code Skill (.claude/skills/<name>/SKILL.md)
 * Ref: https://docs.anthropic.com/en/docs/claude-code/skills
 */
function toClaudeSkill(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];
    const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return `---
name: ${skillName}
description: ${agent.description || agent.role}. Use when working on ${agent.role.toLowerCase()} tasks.
---
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
}

/**
 * Converte para Claude Code Subagent (.claude/agents/<name>.md)
 * Ref: https://docs.anthropic.com/en/docs/claude-code/sub-agents
 */
function toClaudeSubagent(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];

    // Determine tool permissions based on agent role
    const roleLower = (agent.slug || '').toLowerCase();
    const isReadOnly = roleLower.includes('review') || roleLower.includes('security') || roleLower.includes('qa');
    const tools = isReadOnly ? 'Read, Glob, Grep' : 'Read, Edit, Write, Bash';

    return `---
name: ${agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}
description: ${agent.description || agent.role}
tools: ${tools}
model: sonnet
---
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
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
 * Converte para OpenCode Skill (SKILL.md)
 * Ref: https://opencode.ai/docs/skills/
 */
function toOpenCodeSkill(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];

    // Ensure slug is compliant (lowercase, alphanumeric, single hyphens)
    const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return `---
name: ${skillName}
description: ${agent.description || agent.role}
license: MIT
compatibility: opencode
metadata:
  role: ${agent.role}
---
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
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
 * Converte para Antigravity Skill (.agent/skills/<nome>/SKILL.md)
 * Ref: https://antigravity.google/docs/skills
 */
function toAntigravitySkill(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];
    const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return `---
name: ${skillName}
description: ${agent.description || agent.role}. Use when working on ${agent.role.toLowerCase()} tasks.
---
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## When to Use
- Use this skill when working on ${agent.role.toLowerCase()} tasks
- This skill is helpful for ${agent.description || agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
}

/**
 * Converte para Antigravity Workflow (.agent/workflows/<nome>.md)
 * Workflows são invocáveis via /workflow-name
 * Ref: https://antigravity.google/docs/rules-workflows
 */
function toAntigravityWorkflow(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];

    return `# ${agent.name} ${agent.emoji}

${agent.description || agent.role}

## Steps

1. **Understand the Context**: Review the current codebase and requirements
2. **Apply Role**: Act as ${agent.role}
3. **Follow Instructions**: Execute according to the guidelines below

## Instructions

${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
}

/**
 * Converte para OpenCode Agent (.opencode/agents/*.md)
 * Ref: https://opencode.ai/docs/agents
 */
function toOpenCodeAgent(agent, options = {}) {
    const languageRule = getLanguageRule(options.locale);
    const allRules = [languageRule, ...(agent.rules || [])];
    const mode = options.mode || 'all';

    // Determine tool permissions based on agent role
    const roleLower = (agent.slug || '').toLowerCase();
    const isReadOnly = roleLower.includes('review') || roleLower.includes('security') || roleLower.includes('qa');

    return `---
description: ${agent.description || agent.role}
mode: ${mode}
tools:
  write: ${!isReadOnly}
  edit: ${!isReadOnly}
  bash: ${!isReadOnly}
---
# ${agent.name} ${agent.emoji}

**Role**: ${agent.role}

## Instructions
${agent.systemPrompt.trim()}

${allRules.length > 0 ? '## Rules & Guidelines\n' + allRules.map(r => `- ${r}`).join('\n') : ''}
`;
}

module.exports = {
    toGeminiTOML,
    toGeminiSkill,

    toKiloMarkdown,
    toKiloSkill,
    toCopilotInstructions,
    toCursorMDC,
    toCursorSkill,
    toWindsurfRules,
    toClaudeCommand,
    toClaudeSkill,
    toClaudeSubagent,
    toPlainSystemPrompt,
    toOpenCodeSkill,
    toOpenCodeAgent,
    toTraeRules,
    toAntigravitySkill,
    toAntigravityWorkflow
};
