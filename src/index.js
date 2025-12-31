#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { intro, outro, multiselect, spinner, note, select, text } = require('@clack/prompts');
const pc = require('picocolors');

// Internal Modules
const { loadAgents } = require('./lib/agents');
const { STACK_PROFILES } = require('./lib/profiles');
const { MESSAGES } = require('./lib/messages');
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

    if (isUpgrade) {
        intro(pc.bgBlue(pc.white(MESSAGES.INTRO.UPGRADE_TITLE)));
        
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
            note(MESSAGES.UPGRADE.NO_CONFIG, MESSAGES.UPGRADE.NO_CONFIG_TITLE);
        } else {
            note(MESSAGES.UPGRADE.DETECTED_TOOLS(tools.join(', ')), MESSAGES.UPGRADE.DETECTED_TITLE);
            await processAgentsInstallation(tools);
            outro(pc.green(MESSAGES.UPGRADE.SUCCESS));
            process.exit(0);
        }
    } else {
        intro(pc.bgMagenta(pc.white(MESSAGES.INTRO.TITLE)));
    }

    // 1. Automatic Scaffold
    const created = generateWorkflowGuide(process.cwd());
    if (created) {
        console.log(pc.green(MESSAGES.SCAFFOLD.SUCCESS));
    }

    // 2. Feature 5: Stack Selection (Profile)
    const stackOptions = Object.entries(STACK_PROFILES).map(([key, profile]) => ({
        value: key,
        label: profile.label
    }));

    const stackProfile = await select({
        message: MESSAGES.SETUP.STACK_SELECT,
        options: stackOptions,
        initialValue: 'generic'
    });

    if (typeof stackProfile === 'symbol') { process.exit(0); } // Handle Cancel

    // 3. Feature 3: Global Rules (Optional)
    const globalRules = await text({
        message: MESSAGES.SETUP.GLOBAL_RULES,
        placeholder: MESSAGES.SETUP.GLOBAL_RULES_HINT,
        required: false
    });

    if (typeof globalRules === 'symbol') { process.exit(0); } // Handle Cancel

    // 4. Tool Selection (Multiple choice)
    const tools = await multiselect({
        message: MESSAGES.SETUP.TOOL_SELECT,
        options: [
            { value: 'gemini', label: MESSAGES.TOOLS.GEMINI, hint: '.gemini/commands/dev' },
            { value: 'roo', label: MESSAGES.TOOLS.ROO, hint: '.roo/ & custom_modes.json' },
            { value: 'cline', label: MESSAGES.TOOLS.CLINE, hint: '.cline/ & custom_modes.json' },
            { value: 'cursor', label: MESSAGES.TOOLS.CURSOR, hint: '.cursor/rules/*.mdc' },
            { value: 'windsurf', label: MESSAGES.TOOLS.WINDSURF, hint: '.windsurfrules' },
            { value: 'trae', label: MESSAGES.TOOLS.TRAE, hint: '.trae/instructions.md' },
            { value: 'kilo', label: MESSAGES.TOOLS.KILO, hint: '.kilo/prompts/*.md' },
            { value: 'copilot', label: MESSAGES.TOOLS.COPILOT, hint: '.github/copilot-instructions.md' },
            { value: 'web', label: MESSAGES.TOOLS.WEB, hint: 'prompts/*.txt' },
            { value: 'opencode', label: MESSAGES.TOOLS.OPENCODE, hint: '.opencode/*.md' },
        ],
        required: true,
        hint: MESSAGES.SETUP.TOOL_HINT
    });

    if (!tools || tools.length === 0) {
        outro(MESSAGES.SETUP.NO_TOOLS);
        process.exit(0);
    }

    await processAgentsInstallation(tools, { stackProfile, globalRules });

    outro(pc.green(MESSAGES.SETUP.SUCCESS));
}

async function processAgentsInstallation(tools, options) {
    const s = spinner();
    s.start(MESSAGES.INSTALL.LOADING);

    try {
        const validAgents = await loadAgents(options);

        if (validAgents.length === 0) {
            s.stop(MESSAGES.INSTALL.NO_AGENTS);
            return;
        }

        s.message(MESSAGES.INSTALL.INSTALLING(tools.join(', ')));

        // Iterate over each selected tool
        for (const tool of tools) {
            
            // Tool-Specific Installation
            if (tool === 'gemini') {
                const targetDir = path.join(process.cwd(), '.gemini', 'commands', 'dev');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const toml = toGeminiTOML(agent);
                    const fileName = `${agent.originalName}.toml`; 
                    return fsp.writeFile(path.join(targetDir, fileName), toml);
                }));
            } 
            else if (tool === 'roo' || tool === 'cline') {
                const configDir = tool === 'roo' ? '.roo' : '.cline';
                const targetDir = path.join(process.cwd(), configDir);
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const md = toKiloMarkdown(agent);
                    return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                }));

                const modes = validAgents.map(agent => toRooConfig(agent, agent.slug));
                const jsonContent = JSON.stringify({ customModes: modes }, null, 2);
                const fileName = `${tool}_custom_modes.json`;
                await fsp.writeFile(path.join(process.cwd(), fileName), jsonContent);
            } 
            else if (tool === 'kilo') {
                const targetDir = path.join(process.cwd(), '.kilo', 'prompts');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const md = toKiloMarkdown(agent);
                    return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                }));
            }
            else if (tool === 'copilot') {
                const githubDir = path.join(process.cwd(), '.github');
                const agentsDir = path.join(githubDir, 'agents');
                await fsp.mkdir(agentsDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const md = toCopilotInstructions(agent);
                    return fsp.writeFile(path.join(agentsDir, `${agent.slug}.md`), md);
                }));

                const mainAgent = validAgents.find(a => a.slug.includes('coder')) || validAgents[0];
                const mainInstructions = toCopilotInstructions(mainAgent);
                await fsp.writeFile(path.join(githubDir, 'copilot-instructions.md'), mainInstructions);
            }
            else if (tool === 'cursor') {
                const rulesDir = path.join(process.cwd(), '.cursor', 'rules');
                await fsp.mkdir(rulesDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const mdc = toCursorMDC(agent);
                    return fsp.writeFile(path.join(rulesDir, `${agent.slug}.mdc`), mdc);
                }));
            }
            else if (tool === 'windsurf') {
                const mainAgent = validAgents.find(a => a.slug.includes('coder')) || validAgents[0];
                const rules = toWindsurfRules(mainAgent);
                await fsp.writeFile(path.join(process.cwd(), '.windsurfrules'), rules);
            }
            else if (tool === 'trae') {
                const traeDir = path.join(process.cwd(), '.trae');
                await fsp.mkdir(traeDir, { recursive: true });
                
                const mainAgent = validAgents.find(a => a.slug.includes('coder')) || validAgents[0];
                const rules = toTraeRules(mainAgent);
                await fsp.writeFile(path.join(traeDir, 'instructions.md'), rules);
            }
            else if (tool === 'web') {
                const targetDir = path.join(process.cwd(), 'prompts');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const txt = toPlainSystemPrompt(agent);
                    return fsp.writeFile(path.join(targetDir, `${agent.slug}.txt`), txt);
                }));
            }
            else if (tool === 'opencode') {
                const targetDir = path.join(process.cwd(), '.opencode');
                await fsp.mkdir(targetDir, { recursive: true });

                await Promise.all(validAgents.map(agent => {
                    const md = toKiloMarkdown(agent);
                    return fsp.writeFile(path.join(targetDir, `${agent.slug}.md`), md);
                }));
            }
        }
        
        s.stop(MESSAGES.INSTALL.FINISHED);
        
        // Consolidated feedback
        if (tools.includes('roo') || tools.includes('cline')) {
            note(MESSAGES.INSTALL.ROO_WARNING, MESSAGES.INSTALL.ROO_WARNING_TITLE);
        }

    } catch (e) {
        s.stop(MESSAGES.INSTALL.FAILED);
        console.error(pc.red(e.message));
    }
}

main().catch(console.error);
