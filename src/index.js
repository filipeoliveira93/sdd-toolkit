#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { intro, outro, multiselect, spinner, note } = require('@clack/prompts');
const pc = require('picocolors');

// Módulos Internos
const { loadAgents } = require('./lib/agents');
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
        intro(pc.bgBlue(pc.white(' SDD TOOLKIT: UPGRADE MODE ')));
        
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
            note('No existing configuration detected for upgrade. Starting standard installation.', 'Info');
        } else {
            note(`Tools detected: ${tools.join(', ')}`, 'Upgrading...');
            await processAgentsInstallation(tools);
            outro(pc.green('Agents updated successfully! 🚀'));
            process.exit(0);
        }
    } else {
        intro(pc.bgMagenta(pc.white(' UNIVERSAL SPEC CLI ')));
    }

    // 1. Scaffold Automático (Sempre executa)
    const created = generateWorkflowGuide(process.cwd());
    if (created) {
        console.log(pc.green('✔ Workflow structure (docs/) verified.'));
    }

    // 2. Tool Selection
    const tools = await multiselect({
        message: 'Which tools do you want to install Agents for?',
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

    await processAgentsInstallation(tools);

    // 3. Instalação de Scripts Auxiliares
    const scriptsDir = path.join(process.cwd(), '.sdd', 'scripts');
    await fsp.mkdir(scriptsDir, { recursive: true });
    
    // Copia scripts da fonte (assumindo que estão em ./src/scripts no pacote instalado)
    // Em desenvolvimento local, o caminho pode variar, então ajustamos:
    const srcScriptsDir = path.join(__dirname, 'scripts'); 
    
    if (fs.existsSync(srcScriptsDir)) {
        const scriptFiles = fs.readdirSync(srcScriptsDir);
        for (const file of scriptFiles) {
            await fsp.copyFile(path.join(srcScriptsDir, file), path.join(scriptsDir, file));
        }
    }

    // Tenta adicionar ao package.json do usuário
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
            pkg.scripts = pkg.scripts || {};
            pkg.scripts['sdd:status'] = 'node .sdd/scripts/status.js';
            pkg.scripts['sdd:reset'] = 'node .sdd/scripts/reset.js';
            pkg.scripts['sdd:archive'] = 'node .sdd/scripts/archive.js';
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
            note('Added npm scripts: sdd:status, sdd:reset, sdd:archive', 'NPM Scripts');
        } catch (e) {
            // Ignore invalid JSON error
        }
    }

    outro(pc.green('Configuration completed successfully! 🚀'));
}

async function processAgentsInstallation(tools) {
    const s = spinner();
    s.start('Loading definitions...');

    try {
        const validAgents = await loadAgents();

        if (validAgents.length === 0) {
            s.stop('No valid agents found.');
            return;
        }

        s.message(`Installing agents for: ${tools.join(', ')}...`);

        // Itera sobre cada ferramenta selecionada
        for (const tool of tools) {
            
            // Instalação Específica por Ferramenta
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
        
        s.stop('Installation complete!');
        
        // Consolidated Feedback
        if (tools.includes('roo') || tools.includes('cline')) {
            note('Remember to configure Custom Modes in settings.json for Roo/Cline.', 'Notice');
        }

    } catch (e) {
        s.stop('Failed');
        console.error(pc.red(e.message));
    }
}

main().catch(console.error);
