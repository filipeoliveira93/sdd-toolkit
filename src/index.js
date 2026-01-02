#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { intro, outro, multiselect, spinner, note, select, text } = require('@clack/prompts');
const pc = require('picocolors');

// Internal Modules
const { loadAgents } = require('./lib/agents');
const { STACK_PROFILES } = require('./lib/profiles');
const { setLocale, t, getLocale } = require('./lib/i18n');
const { 
    toGeminiTOML, 
    toRooConfig, 
    toKiloMarkdown, 
    toCopilotInstructions,
    toCursorMDC,
    toWindsurfRules,
    toPlainSystemPrompt,
    toTraeRules
} = require('./lib/transformers');
const { generateWorkflowGuide } = require('./lib/docs');

async function main() {
    console.clear();
    
    const args = process.argv.slice(2);
    const isUpgrade = args.includes('upgrade') || args.includes('--upgrade');

    // 0. Language Selection (Always first unless forced upgrade silent mode - but upgrade has interaction)
    // We show this before Upgrade title to ensure upgrade messages are localized too if possible
    // But typically flags like --lang would be better. For now, interactive.
    
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
        // Default EN for upgrade for now
        setLocale('en'); 
    }

    if (isUpgrade) {
        intro(pc.bgBlue(pc.white(t('INTRO.UPGRADE_TITLE'))));
        
        // Detecção de Ferramentas Existentes
        const tools = [];
        if (fs.existsSync(path.join(process.cwd(), '.gemini'))) tools.push('gemini');
        if (fs.existsSync(path.join(process.cwd(), '.roo'))) tools.push('roo');
        if (fs.existsSync(path.join(process.cwd(), '.cline'))) tools.push('cline');
        if (fs.existsSync(path.join(process.cwd(), '.cursor'))) tools.push('cursor');
        if (fs.existsSync(path.join(process.cwd(), '.windsurfrules'))) tools.push('windsurf');
        if (fs.existsSync(path.join(process.cwd(), '.trae'))) tools.push('trae');
        if (fs.existsSync(path.join(process.cwd(), '.kilo'))) tools.push('kilo');
        if (fs.existsSync(path.join(process.cwd(), '.github'))) tools.push('copilot'); // Assume copilot se .github existir
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

    // 2. Feature 5: Stack Selection (Profile)
    const stackOptions = Object.entries(STACK_PROFILES).map(([key, profile]) => ({
        value: key,
        label: profile.label
    }));

    const stackProfile = await select({
        message: t('SETUP.STACK_SELECT'),
        options: stackOptions,
        initialValue: 'generic'
    });

    if (typeof stackProfile === 'symbol') { 
        outro(pc.yellow(t('GENERAL.CANCELLED')));
        process.exit(0); 
    }

    // 3. Feature 3: Global Rules (Optional)
    const globalRules = await text({
        message: t('SETUP.GLOBAL_RULES'),
        placeholder: t('SETUP.GLOBAL_RULES_HINT'),
        required: false
    });

    if (typeof globalRules === 'symbol') {
        outro(pc.yellow(t('GENERAL.CANCELLED')));
        process.exit(0);
    }

    // 4. Tool Selection (Multiple choice)
    const tools = await multiselect({
        message: t('SETUP.TOOL_SELECT'),
        options: [
            { value: 'gemini', label: t('TOOLS.GEMINI'), hint: '.gemini/commands/dev' },
            { value: 'roo', label: t('TOOLS.ROO'), hint: '.roo/ & custom_modes.json' },
            { value: 'cline', label: t('TOOLS.CLINE'), hint: '.cline/ & custom_modes.json' },
            { value: 'cursor', label: t('TOOLS.CURSOR'), hint: '.cursor/rules/*.mdc' },
            { value: 'windsurf', label: t('TOOLS.WINDSURF'), hint: '.windsurfrules' },
            { value: 'trae', label: t('TOOLS.TRAE'), hint: '.trae/instructions.md' },
            { value: 'kilo', label: t('TOOLS.KILO'), hint: '.kilo/prompts/*.md' },
            { value: 'copilot', label: t('TOOLS.COPILOT'), hint: '.github/copilot-instructions.md' },
            { value: 'web', label: t('TOOLS.WEB'), hint: 'prompts/*.txt' },
            { value: 'opencode', label: t('TOOLS.OPENCODE'), hint: '.opencode/*.md' },
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

    // Pass locale to installation process
    await processAgentsInstallation(tools, { stackProfile, globalRules, locale: getLocale() });

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

        // Iterate over each selected tool
        for (const tool of tools) {
            
            // Tool-Specific Installation
            if (tool === 'gemini') {
                const targetDir = path.join(process.cwd(), '.gemini', 'commands', 'dev');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const toml = toGeminiTOML(agent, options);
                    const fileName = `${agent.originalName}.toml`; 
                    return fsp.writeFile(path.join(targetDir, fileName), toml);
                }));
            } 
            else if (tool === 'roo' || tool === 'cline') {
                const configDir = tool === 'roo' ? '.roo' : '.cline';
                const targetDir = path.join(process.cwd(), configDir);
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const md = toKiloMarkdown(agent, options);
                    return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                }));

                const modes = validAgents.map(agent => toRooConfig(agent, agent.slug, options));
                const jsonContent = JSON.stringify({ customModes: modes }, null, 2);
                const fileName = `${tool}_custom_modes.json`;
                await fsp.writeFile(path.join(process.cwd(), fileName), jsonContent);
            } 
            else if (tool === 'kilo') {
                const targetDir = path.join(process.cwd(), '.kilo', 'prompts');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const md = toKiloMarkdown(agent, options);
                    return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                }));
            }
            else if (tool === 'copilot') {
                const githubDir = path.join(process.cwd(), '.github');
                const agentsDir = path.join(githubDir, 'agents');
                await fsp.mkdir(agentsDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const md = toCopilotInstructions(agent, options);
                    return fsp.writeFile(path.join(agentsDir, `${agent.slug}.md`), md);
                }));

                const mainAgent = validAgents.find(a => a.slug.includes('coder')) || validAgents[0];
                const mainInstructions = toCopilotInstructions(mainAgent, options);
                await fsp.writeFile(path.join(githubDir, 'copilot-instructions.md'), mainInstructions);
            }
            else if (tool === 'cursor') {
                const rulesDir = path.join(process.cwd(), '.cursor', 'rules');
                await fsp.mkdir(rulesDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const mdc = toCursorMDC(agent, options);
                    return fsp.writeFile(path.join(rulesDir, `${agent.slug}.mdc`), mdc);
                }));
            }
            else if (tool === 'windsurf') {
                const mainAgent = validAgents.find(a => a.slug.includes('coder')) || validAgents[0];
                const rules = toWindsurfRules(mainAgent, options);
                await fsp.writeFile(path.join(process.cwd(), '.windsurfrules'), rules);
            }
            else if (tool === 'trae') {
                const traeDir = path.join(process.cwd(), '.trae');
                await fsp.mkdir(traeDir, { recursive: true });
                
                const mainAgent = validAgents.find(a => a.slug.includes('coder')) || validAgents[0];
                const rules = toTraeRules(mainAgent, options);
                await fsp.writeFile(path.join(traeDir, 'instructions.md'), rules);
            }
            else if (tool === 'web') {
                const targetDir = path.join(process.cwd(), 'prompts');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const txt = toPlainSystemPrompt(agent, options);
                    return fsp.writeFile(path.join(targetDir, `${agent.slug}.txt`), txt);
                }));
            }
            else if (tool === 'opencode') {
                const targetDir = path.join(process.cwd(), '.opencode');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const md = toKiloMarkdown(agent, options);
                    return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                }));
            }
        }
        
        s.stop(t('INSTALL.FINISHED'));
        
        // Consolidated feedback
        if (tools.includes('roo') || tools.includes('cline')) {
            note(t('INSTALL.ROO_WARNING'), t('INSTALL.ROO_WARNING_TITLE'));
        }

    } catch (e) {
        s.stop(pc.red(`${t('INSTALL.FAILED')}: ${e.message}`));
        process.exit(1);
    }
}

main().catch(console.error);
