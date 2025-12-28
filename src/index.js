#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { intro, outro, multiselect, spinner, note, select, text } = require('@clack/prompts');
const pc = require('picocolors');

// Internal Modules
const { loadAgents } = require('./lib/agents');
const { STACK_PROFILES } = require('./lib/profiles');
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
    intro(pc.bgMagenta(pc.white(' UNIVERSAL SPEC CLI ')));

    // 1. Automatic Scaffold
    const created = generateWorkflowGuide(process.cwd());
    if (created) {
        console.log(pc.green('✔ Folder structure (docs/) verified.'));
    }

    // 2. Feature 5: Stack Selection (Profile)
    const stackOptions = Object.entries(STACK_PROFILES).map(([key, profile]) => ({
        value: key,
        label: profile.label
    }));

    const stackProfile = await select({
        message: 'What is your technology Stack profile?',
        options: stackOptions,
        initialValue: 'generic'
    });

    if (typeof stackProfile === 'symbol') { process.exit(0); } // Handle Cancel

    // 3. Feature 3: Global Rules (Optional)
    const globalRules = await text({
        message: 'Do you want to add any Global Rules for ALL agents?',
        placeholder: 'Ex: Always reply in English; Use Conventional Commits...',
        required: false
    });

    if (typeof globalRules === 'symbol') { process.exit(0); } // Handle Cancel

    // 4. Tool Selection (Multiple choice)
    const tools = await multiselect({
        message: 'Which tools do you want to install the Agents for?',
        options: [
            { value: 'gemini', label: 'Gemini CLI', hint: '.gemini/commands/dev' },
            { value: 'roo', label: 'Roo Code', hint: '.roo/ & custom_modes.json' },
            { value: 'cline', label: 'Cline', hint: '.cline/ & custom_modes.json' },
            { value: 'cursor', label: 'Cursor', hint: '.cursor/rules/*.mdc' },
            { value: 'windsurf', label: 'Windsurf', hint: '.windsurfrules' },
            { value: 'trae', label: 'Trae IDE', hint: '.trae/instructions.md' },
            { value: 'kilo', label: 'Kilo Code', hint: '.kilo/prompts/*.md' },
            { value: 'copilot', label: 'GitHub Copilot', hint: '.github/copilot-instructions.md' },
            { value: 'web', label: 'OpenAI / Claude', hint: 'prompts/*.txt' },
            { value: 'opencode', label: 'OpenCode', hint: '.opencode/*.md' },
        ],
        required: true,
        hint: 'Space to select, Enter to confirm'
    });

    if (!tools || tools.length === 0) {
        outro('No tools selected. Operation cancelled.');
        process.exit(0);
    }

    await processAgentsInstallation(tools, { stackProfile, globalRules });

    outro(pc.green('Setup completed successfully! 🚀'));
}

async function processAgentsInstallation(tools, options) {
    const s = spinner();
    s.start('Loading definitions...');

    try {
        const validAgents = await loadAgents(options);

        if (validAgents.length === 0) {
            s.stop('No valid agents found.');
            return;
        }

        s.message(`Installing agents for: ${tools.join(', ')}...`);

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
        
        s.stop('Installation finished!');
        
        // Consolidated feedback
        if (tools.includes('roo') || tools.includes('cline')) {
            note('Remember to configure Custom Modes in settings.json for Roo/Cline.', 'Warning');
        }

    } catch (e) {
        s.stop('Failed');
        console.error(pc.red(e.message));
    }
}

main().catch(console.error);