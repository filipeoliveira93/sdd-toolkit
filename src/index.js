#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { intro, outro, multiselect, spinner, note, select, text } = require('@clack/prompts');
const pc = require('picocolors');

// Módulos Internos
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

    // 1. Scaffold Automático (Sempre executa)
    const created = generateWorkflowGuide(process.cwd());
    if (created) {
        console.log(pc.green('✔ Estrutura de pastas (docs/) verificada.'));
    }

    // 2. Feature 5: Seleção de Stack (Profile)
    const stackOptions = Object.entries(STACK_PROFILES).map(([key, profile]) => ({
        value: key,
        label: profile.label
    }));

    const stackProfile = await select({
        message: 'Qual é o perfil da sua Stack tecnológica?',
        options: stackOptions,
        initialValue: 'generic'
    });

    if (typeof stackProfile === 'symbol') { process.exit(0); } // Handle Cancel

    // 3. Feature 3: Regras Globais (Opcional)
    const globalRules = await text({
        message: 'Deseja adicionar alguma Regra Global para TODOS os agentes?',
        placeholder: 'Ex: Responda sempre em pt-BR; Use Conventional Commits...',
        required: false
    });

    if (typeof globalRules === 'symbol') { process.exit(0); } // Handle Cancel

    // 4. Seleção de Ferramentas (Múltipla escolha)
    const tools = await multiselect({
        message: 'Para quais ferramentas você deseja instalar os Agentes?',
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
        hint: 'Espaço para selecionar, Enter para confirmar'
    });

    if (!tools || tools.length === 0) {
        outro('Nenhuma ferramenta selecionada. Operação cancelada.');
        process.exit(0);
    }

    await processAgentsInstallation(tools, { stackProfile, globalRules });

    outro(pc.green('Configuração concluída com sucesso! 🚀'));
}

async function processAgentsInstallation(tools, options) {
    const s = spinner();
    s.start('Carregando definições...');

    try {
        const validAgents = await loadAgents(options);

        if (validAgents.length === 0) {
            s.stop('Nenhum agente válido encontrado.');
            return;
        }

        s.message(`Instalando agentes para: ${tools.join(', ')}...`);

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
        
        s.stop('Instalação finalizada!');
        
        // Feedback consolidado
        if (tools.includes('roo') || tools.includes('cline')) {
            note('Lembre-se de configurar os Custom Modes no settings.json para Roo/Cline.', 'Aviso');
        }

    } catch (e) {
        s.stop('Falha');
        console.error(pc.red(e.message));
    }
}

main().catch(console.error);
