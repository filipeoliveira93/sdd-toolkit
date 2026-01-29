#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { intro, outro, multiselect, spinner, note, select, text } = require('@clack/prompts');
const pc = require('picocolors');

// Internal Modules
const { loadAgents } = require('./lib/agents');
const { setLocale, t, getLocale } = require('./lib/i18n');
const {
    toGeminiTOML,
    toGeminiSkill,
    toRooConfig,
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
    toTraeRules,
    toOpenCodeSkill,
    toOpenCodeSubagent,
    toAntigravitySkill,
    toAntigravityWorkflow
} = require('./lib/transformers');
const { generateWorkflowGuide } = require('./lib/docs');
const { view } = require('./commands/view');

async function main() {
    console.clear();

    const args = process.argv.slice(2);

    if (args[0] === 'view') {
        await view();
        process.exit(0);
    }

    const isUpgrade = args.includes('upgrade') || args.includes('--upgrade');

    // 0. Language Selection
    if (!isUpgrade) {
        intro(pc.bgMagenta(pc.white(' UNIVERSAL SPEC CLI ')));

        const lang = await select({
            message: 'Select Language / Selecione o Idioma / Seleccione el Idioma',
            options: [
                { value: 'en', label: 'English' },
                { value: 'pt_br', label: 'Português (Brasil)' },
                { value: 'es', label: 'Español' }
            ]
        });

        if (typeof lang === 'symbol') {
            outro(pc.yellow('Operation cancelled.'));
            process.exit(0);
        }

        setLocale(lang);
    } else {
        setLocale('en');
    }

    if (isUpgrade) {
        intro(pc.bgBlue(pc.white(t('INTRO.UPGRADE_TITLE'))));

        const tools = [];
        if (fs.existsSync(path.join(process.cwd(), '.gemini'))) tools.push('gemini');
        if (fs.existsSync(path.join(process.cwd(), '.roo'))) tools.push('roo');
        if (fs.existsSync(path.join(process.cwd(), '.cline'))) tools.push('cline');
        if (fs.existsSync(path.join(process.cwd(), '.cursor'))) tools.push('cursor');
        if (fs.existsSync(path.join(process.cwd(), '.windsurf'))) tools.push('windsurf');
        if (fs.existsSync(path.join(process.cwd(), '.claude'))) tools.push('claude');
        if (fs.existsSync(path.join(process.cwd(), '.trae'))) tools.push('trae');
        if (fs.existsSync(path.join(process.cwd(), '.kilocode'))) tools.push('kilo');
        if (fs.existsSync(path.join(process.cwd(), '.github'))) tools.push('copilot');
        if (fs.existsSync(path.join(process.cwd(), '.roo'))) tools.push('roo');
        if (fs.existsSync(path.join(process.cwd(), '.opencode'))) tools.push('opencode');
        if (fs.existsSync(path.join(process.cwd(), 'prompts'))) tools.push('web');

        if (fs.existsSync(path.join(process.cwd(), '.antigravity'))) tools.push('antigravity');
        if (tools.length === 0) {
            note(t('UPGRADE.NO_CONFIG'), t('UPGRADE.NO_CONFIG_TITLE'));
        } else {
            note(t('UPGRADE.DETECTED_TOOLS', tools.join(', ')), t('UPGRADE.DETECTED_TITLE'));
            await processAgentsInstallation(tools, { locale: getLocale() });
            outro(pc.green(t('UPGRADE.SUCCESS')));
            process.exit(0);
        }
    }

    // 1. Automatic Scaffold
    const s = spinner();
    s.start(t('SCAFFOLD.LOADING'));

    try {
        const stats = generateWorkflowGuide(process.cwd());
        if (stats.created > 0) {
            s.stop(`${t('SCAFFOLD.SUCCESS')} (${stats.created} new, ${stats.verified} verified)`);
        } else {
            s.stop(t('SCAFFOLD.ALREADY_EXISTS'));
        }
    } catch (e) {
        s.stop(pc.red(t('SCAFFOLD.ERROR')));
    }

    // 2. Feature 3: Global Rules
    const globalRules = await text({
        message: t('SETUP.GLOBAL_RULES'),
        placeholder: t('SETUP.GLOBAL_RULES_HINT'),
        required: false
    });

    if (typeof globalRules === 'symbol') {
        outro(pc.yellow(t('GENERAL.CANCELLED')));
        process.exit(0);
    }

    // 4. Tool Selection
    const tools = await multiselect({
        message: t('SETUP.TOOL_SELECT'),
        options: [
            { value: 'gemini', label: t('TOOLS.GEMINI'), hint: '.gemini/commands/* & skills/*' },
            { value: 'roo', label: t('TOOLS.ROO'), hint: '.roo/commands/*.md' },
            { value: 'cline', label: t('TOOLS.CLINE'), hint: '.cline/ & custom_modes.json' },
            { value: 'cursor', label: t('TOOLS.CURSOR'), hint: '.cursor/commands/* & skills/*' },
            { value: 'windsurf', label: t('TOOLS.WINDSURF'), hint: '.windsurf/workflows/*.md' },
            { value: 'claude', label: 'Claude Code', hint: '.claude/commands/* & skills/* & agents/*' },
            { value: 'trae', label: t('TOOLS.TRAE'), hint: '.trae/instructions.md' },
            { value: 'kilo', label: t('TOOLS.KILO'), hint: '.kilocode/workflows/* & skills/*' },
            { value: 'copilot', label: t('TOOLS.COPILOT'), hint: '.github/prompts/*.md' },
            { value: 'web', label: t('TOOLS.WEB'), hint: 'prompts/*.txt' },
            { value: 'opencode', label: t('TOOLS.OPENCODE'), hint: '.opencode/skills/* & agents/*' },
            { value: 'antigravity', label: t('TOOLS.ANTIGRAVITY'), hint: '.agent/skills/* & workflows/*' }
        ],
        required: true,
        hint: t('SETUP.TOOL_HINT')
    });

    if (typeof tools === 'symbol') {
        outro(pc.yellow(t('GENERAL.CANCELLED')));
        process.exit(0);
    }

    if (!tools || tools.length === 0) {
        outro(t('SETUP.NO_TOOLS'));
        process.exit(0);
    }

    await processAgentsInstallation(tools, { globalRules, locale: getLocale() });

    outro(pc.green(t('SETUP.SUCCESS')));
}

async function processAgentsInstallation(tools, options) {
    const s = spinner();
    s.start(t('INSTALL.LOADING'));

    try {
        const validAgents = await loadAgents(options);

        if (validAgents.length === 0) {
            s.stop(t('INSTALL.NO_AGENTS'));
            return;
        }

        s.message(t('INSTALL.INSTALLING', tools.join(', ')));

        const toolHandlers = {
            gemini: async (validAgents, options) => {
                const commandsDir = path.join(process.cwd(), '.gemini', 'commands', 'dev');
                const skillsDir = path.join(process.cwd(), '.gemini', 'skills');
                
                await fsp.mkdir(commandsDir, { recursive: true });
                await fsp.mkdir(skillsDir, { recursive: true });

                await Promise.all(
                    validAgents.map(async (agent) => {
                        // Generate Command (TOML)
                        const toml = toGeminiTOML(agent, options);
                        const fileName = `${agent.originalName}.toml`;
                        await fsp.writeFile(path.join(commandsDir, fileName), toml);

                        // Generate Skill
                        const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                        const agentSkillDir = path.join(skillsDir, skillName);
                        await fsp.mkdir(agentSkillDir, { recursive: true });
                        const skillContent = toGeminiSkill(agent, options);
                        await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skillContent);
                    })
                );
            },
            roo: async (validAgents, options) => {
                const targetDir = path.join(process.cwd(), '.roo', 'commands');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const md = toOpenCodeAgent(agent, options);
                        return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                    })
                );
            },
            cline: async (validAgents, options) => {
                const targetDir = path.join(process.cwd(), '.cline');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const md = toKiloMarkdown(agent, options);
                        return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                    })
                );

                const modes = validAgents.map((agent) => toRooConfig(agent, agent.slug, options));
                const jsonContent = JSON.stringify({ customModes: modes }, null, 2);
                await fsp.writeFile(path.join(process.cwd(), 'cline_custom_modes.json'), jsonContent);
            },
            windsurf: async (validAgents, options) => {
                const targetDir = path.join(process.cwd(), '.windsurf', 'workflows');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const md = toWindsurfRules(agent, options);
                        return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                    })
                );
            },
            claude: async (validAgents, options) => {
                const commandsDir = path.join(process.cwd(), '.claude', 'commands', 'agents');
                const skillsDir = path.join(process.cwd(), '.claude', 'skills');
                const agentsDir = path.join(process.cwd(), '.claude', 'agents');
                
                await fsp.mkdir(commandsDir, { recursive: true });
                await fsp.mkdir(skillsDir, { recursive: true });
                await fsp.mkdir(agentsDir, { recursive: true });

                await Promise.all(
                    validAgents.map(async (agent) => {
                        const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                        // Generate Command
                        const command = toClaudeCommand(agent, options);
                        await fsp.writeFile(path.join(commandsDir, `${agent.slug}.md`), command);

                        // Generate Skill
                        const agentSkillDir = path.join(skillsDir, skillName);
                        await fsp.mkdir(agentSkillDir, { recursive: true });
                        const skill = toClaudeSkill(agent, options);
                        await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skill);

                        // Generate Subagent
                        const subagent = toClaudeSubagent(agent, options);
                        await fsp.writeFile(path.join(agentsDir, `${skillName}.md`), subagent);
                    })
                );
            },
            cursor: async (validAgents, options) => {
                const commandsDir = path.join(process.cwd(), '.cursor', 'commands');
                const skillsDir = path.join(process.cwd(), '.cursor', 'skills');
                
                await fsp.mkdir(commandsDir, { recursive: true });
                await fsp.mkdir(skillsDir, { recursive: true });

                await Promise.all(
                    validAgents.map(async (agent) => {
                        const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                        
                        // Generate Commands (.mdc)
                        const mdc = toCursorMDC(agent, options);
                        await fsp.writeFile(path.join(commandsDir, `${agent.slug}.mdc`), mdc);
                        
                        // Generate Skills (SKILL.md)
                        const skillDir = path.join(skillsDir, skillName);
                        await fsp.mkdir(skillDir, { recursive: true });
                        const skill = toCursorSkill(agent, options);
                        await fsp.writeFile(path.join(skillDir, 'SKILL.md'), skill);
                    })
                );
            },
            kilo: async (validAgents, options) => {
                const workflowsDir = path.join(process.cwd(), '.kilocode', 'workflows');
                const skillsDir = path.join(process.cwd(), '.kilocode', 'skills');
                
                await fsp.mkdir(workflowsDir, { recursive: true });
                await fsp.mkdir(skillsDir, { recursive: true });

                await Promise.all(
                    validAgents.map(async (agent) => {
                        const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                        // Generate Workflow
                        const workflow = toKiloMarkdown(agent, options);
                        await fsp.writeFile(path.join(workflowsDir, `${agent.slug}.md`), workflow);

                        // Generate Skill
                        const agentSkillDir = path.join(skillsDir, skillName);
                        await fsp.mkdir(agentSkillDir, { recursive: true });
                        const skill = toKiloSkill(agent, options);
                        await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skill);
                    })
                );
            },
            copilot: async (validAgents, options) => {
                const githubDir = path.join(process.cwd(), '.github');
                const promptsDir = path.join(githubDir, 'prompts');
                await fsp.mkdir(promptsDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const md = toCopilotInstructions(agent, options);
                        return fsp.writeFile(path.join(promptsDir, `${agent.slug}.md`), md);
                    })
                );

                const mainAgent = validAgents.find((a) => a.slug.includes('coder')) || validAgents[0];
                const mainInstructions = toCopilotInstructions(mainAgent, options);
                await fsp.writeFile(path.join(githubDir, 'prompts.md'), mainInstructions);
            },
            trae: async (validAgents, options) => {
                const traeDir = path.join(process.cwd(), '.trae');
                await fsp.mkdir(traeDir, { recursive: true });

                const mainAgent = validAgents.find((a) => a.slug.includes('coder')) || validAgents[0];
                const rules = toTraeRules(mainAgent, options);
                await fsp.writeFile(path.join(traeDir, 'instructions.md'), rules);
            },
            web: async (validAgents, options) => {
                const targetDir = path.join(process.cwd(), 'prompts');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const txt = toPlainSystemPrompt(agent, options);
                        return fsp.writeFile(path.join(targetDir, `${agent.slug}.txt`), txt);
                    })
                );
            },
            opencode: async (validAgents, options) => {
                const skillsDir = path.join(process.cwd(), '.opencode', 'skills');
                const agentsDir = path.join(process.cwd(), '.opencode', 'agents');
                
                // Ensure base directories exist
                await fsp.mkdir(skillsDir, { recursive: true });
                await fsp.mkdir(agentsDir, { recursive: true });

                await Promise.all(
                    validAgents.map(async (agent) => {
                         // Ensure compatibility with naming rules (lowercase, alphanumeric, single hyphens)
                         const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                         
                         // Generate Skill: .opencode/skills/[agent-slug]/SKILL.md
                         const agentSkillDir = path.join(skillsDir, skillName);
                         await fsp.mkdir(agentSkillDir, { recursive: true });
                         const skillContent = toOpenCodeSkill(agent, options);
                         await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skillContent);

                         // Generate Subagent: .opencode/agents/[agent-slug].md
                         const subagentContent = toOpenCodeSubagent(agent, options);
                         await fsp.writeFile(path.join(agentsDir, `${skillName}.md`), subagentContent);
                    })
                );
            },
            antigravity: async (validAgents, options) => {
                const skillsDir = path.join(process.cwd(), '.agent', 'skills');
                const workflowsDir = path.join(process.cwd(), '.agent', 'workflows');
                
                await fsp.mkdir(skillsDir, { recursive: true });
                await fsp.mkdir(workflowsDir, { recursive: true });

                await Promise.all(
                    validAgents.map(async (agent) => {
                         const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                         // Generate Skill: .agent/skills/[agent-slug]/SKILL.md
                         const agentSkillDir = path.join(skillsDir, skillName);
                         await fsp.mkdir(agentSkillDir, { recursive: true });
                         const skillContent = toAntigravitySkill(agent, options);
                         await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skillContent);

                         // Generate Workflow: .agent/workflows/[agent-slug].md
                         const workflowContent = toAntigravityWorkflow(agent, options);
                         await fsp.writeFile(path.join(workflowsDir, `${skillName}.md`), workflowContent);
                    })
                );
            }
        };

        for (const tool of tools) {
            const handler = toolHandlers[tool];
            if (handler) {
                await handler(validAgents, options);
            }
        }

        s.stop(t('INSTALL.FINISHED'));

        if (tools.includes('roo') || tools.includes('cline')) {
            note(t('INSTALL.ROO_WARNING'), t('INSTALL.ROO_WARNING_TITLE'));
        }
    } catch (e) {
        s.stop(pc.red(`${t('INSTALL.FAILED')}: ${e.message}`));
        process.exit(1);
    }
}

main().catch(console.error);
