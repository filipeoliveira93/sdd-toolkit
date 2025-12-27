const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const { AgentSchema } = require('./schema');
const { STACK_PROFILES } = require('./profiles');
const pc = require('picocolors');

/**
 * Carrega e valida todas as definições de agentes da pasta definitions
 * Suporta sobrescrita local (.sdd/agents) e injeção de regras
 * 
 * @param {Object} options
 * @param {string} options.stackProfile - Chave do perfil de stack (ex: 'frontend-react')
 * @param {string} options.globalRules - Regras globais separadas por quebra de linha
 * @returns {Promise<Array>} Lista de agentes validados
 */
async function loadAgents(options = {}) {
    const definitionsDir = path.join(__dirname, '..', '..', 'definitions');
    const localDefinitionsDir = path.join(process.cwd(), '.sdd', 'agents');
    
    // Verifica diretório padrão
    try {
        await fs.access(definitionsDir);
    } catch {
        throw new Error(`Pasta de definições padrão não encontrada: ${definitionsDir}`);
    }

    // Identifica arquivos padrão
    const files = await fs.readdir(definitionsDir);
    const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

    // Verifica se existe diretório de sobrescrita local
    let hasLocalOverrides = false;
    try {
        await fs.access(localDefinitionsDir);
        hasLocalOverrides = true;
    } catch {
        // Ignora se não existir
    }
    
    // Leitura e processamento em paralelo
    const results = await Promise.all(yamlFiles.map(async (file) => {
        try {
            let content;
            let source = 'default';

            // Feature 2: Sobrescrita Local
            if (hasLocalOverrides) {
                try {
                    const localPath = path.join(localDefinitionsDir, file);
                    await fs.access(localPath);
                    content = await fs.readFile(localPath, 'utf8');
                    source = 'local';
                } catch {
                    // Arquivo local não existe, usa padrão
                }
            }

            if (!content) {
                content = await fs.readFile(path.join(definitionsDir, file), 'utf8');
            }

            const raw = yaml.load(content);
            
            const parsed = AgentSchema.safeParse(raw);
            if (!parsed.success) {
                return { 
                    success: false, 
                    file, 
                    error: 'Validação do Schema falhou',
                    details: parsed.error.format()
                };
            }

            const agent = parsed.data;
            
            // Normaliza o slug
            agent.slug = file.replace(/\.ya?ml$/, '').replace(/\./g, '-');
            agent.originalName = file.replace(/\.ya?ml$/, '');
            agent.source = source; // Metadata útil para logs

            // Feature 5: Injeção de Regras de Stack
            if (options.stackProfile && STACK_PROFILES[options.stackProfile]) {
                const stackRules = STACK_PROFILES[options.stackProfile].rules;
                if (stackRules && stackRules.length > 0) {
                    agent.rules = [...agent.rules, ...stackRules];
                }
            }

            // Feature 3: Injeção de Regras Globais
            if (options.globalRules && typeof options.globalRules === 'string') {
                const customRules = options.globalRules
                    .split('\n')
                    .map(r => r.trim())
                    .filter(r => r.length > 0);
                
                if (customRules.length > 0) {
                    agent.rules = [...agent.rules, ...customRules];
                }
            }
            
            return { success: true, agent };

        } catch (e) {
            return { success: false, file, error: e.message };
        }
    }));

    // Separa sucessos e falhas
    const validAgents = [];
    const errors = [];

    results.forEach(res => {
        if (res.success) {
            validAgents.push(res.agent);
        } else {
            errors.push(res);
            console.warn(pc.yellow(`⚠️  Ignorando ${res.file}: ${res.error}`));
        }
    });

    return validAgents;
}

module.exports = { loadAgents };
