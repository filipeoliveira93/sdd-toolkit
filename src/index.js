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
    toRooConfig,
    toKiloMarkdown,
    toCopilotInstructions,
    toCursorMDC,
    toWindsurfRules,
    toClaudeCommand,
    toPlainSystemPrompt,
    toTraeRules,
    toOpenCodeAgent
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
            { value: 'gemini', label: t('TOOLS.GEMINI'), hint: '.gemini/commands/dev' },
            { value: 'roo', label: t('TOOLS.ROO'), hint: '.roo/commands/*.md' },
            { value: 'cline', label: t('TOOLS.CLINE'), hint: '.cline/ & custom_modes.json' },
            { value: 'cursor', label: t('TOOLS.CURSOR'), hint: '.cursor/commands/*.mdc' },
            { value: 'windsurf', label: t('TOOLS.WINDSURF'), hint: '.windsurf/workflows/*.md' },
            { value: 'claude', label: 'Claude Code', hint: '.claude/commands/agents/*.md' },
            { value: 'trae', label: t('TOOLS.TRAE'), hint: '.trae/instructions.md' },
            { value: 'kilo', label: t('TOOLS.KILO'), hint: '.kilocode/workflows/*.md' },
            { value: 'copilot', label: t('TOOLS.COPILOT'), hint: '.github/prompts/*.md' },
            { value: 'web', label: t('TOOLS.WEB'), hint: 'prompts/*.txt' },
            { value: 'opencode', label: t('TOOLS.OPENCODE'), hint: '.opencode/commands/*.md' }
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
                const targetDir = path.join(process.cwd(), '.gemini', 'commands', 'dev');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const toml = toGeminiTOML(agent, options);
                        const fileName = `${agent.originalName}.toml`;
                        return fsp.writeFile(path.join(targetDir, fileName), toml);
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
                const targetDir = path.join(process.cwd(), '.claude', 'commands', 'agents');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const md = toClaudeCommand(agent, options);
                        return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                    })
                );
            },
            cursor: async (validAgents, options) => {
                const commandsDir = path.join(process.cwd(), '.cursor', 'commands');
                await fsp.mkdir(commandsDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const mdc = toCursorMDC(agent, options);
                        return fsp.writeFile(path.join(commandsDir, `${agent.slug}.mdc`), mdc);
                    })
                );
            },
            kilo: async (validAgents, options) => {
                const targetDir = path.join(process.cwd(), '.kilocode', 'workflows');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const md = toKiloMarkdown(agent, options);
                        return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
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
                const targetDir = path.join(process.cwd(), '.opencode', 'commands');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(
                    validAgents.map((agent) => {
                        const md = toOpenCodeAgent(agent, options);
                        return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                    })
                );

                // Generate AGENTS.md with interaction rules and agent location
                const agentsMdPath = path.join(process.cwd(), 'AGENTS.md');
                let agentsMdContent = `# Interaction Rules

- Always respond to the user in the language they initially interact in; if they interact in English, respond in English, if they interact in Portuguese, respond in Portuguese.
- If possible, display reasoning in the user's language as well.
- Be didactic when explaining things, focus on providing complete responses and not just summaries.
- Whenever possible, provide examples to illustrate concepts.

# Allowed Commands

- Never execute rm or rm -rf commands without confirming with the user.
- Whenever possible, use more specific commands instead of generic ones.
- Be cautious when using commands that may affect critical systems, such as shutdown or reboot.
- For commands that may affect files or directories, always confirm with the user before executing.
- Never execute commands that require administrative privileges (sudo, admin) without explicit permission from the user.
- Avoid running background processes or daemons unless explicitly requested.
- Be cautious when using commands that alter network settings, firewall configurations, or external connections.
- Always quote file paths that contain spaces to avoid interpretation errors.
- For package installation commands (npm install, pip install, etc.), confirm that the user has control over dependencies and versions.
- Avoid irreversible git operations (such as force push or reset --hard) without confirmation.

# Agent Location

Custom agents are located in .opencode/commands/`;

                let userRules = '';
                if (options.globalRules && options.globalRules.trim()) {
                    userRules = '\n\n# User Specified Rules\n\n' + options.globalRules.split('\n').filter(line => line.trim()).map(line => '- ' + line.trim()).join('\n');
                }
                agentsMdContent += userRules;

                await fsp.writeFile(agentsMdPath, agentsMdContent);
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
