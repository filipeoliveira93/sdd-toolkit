const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const { AgentSchema } = require('./schema');
const { STACK_PROFILES } = require('./profiles');
const pc = require('picocolors');

/**
 * Loads and validates all agent definitions from the definitions folder.
 * Supports local override (sdd-toolkit/agents) and rule injection.
 * 
 * @param {Object} options
 * @param {string} options.stackProfile - Stack profile key (e.g., 'frontend-react')
 * @param {string} options.globalRules - Global rules separated by newlines
 * @returns {Promise<Array>} List of validated agents
 */
async function loadAgents(options = {}) {
    const definitionsDir = path.join(__dirname, '..', '..', 'definitions');
    const localDefinitionsDir = path.join(process.cwd(), '.sdd-toolkit', 'agents');
    
    // Check default directory
    try {
        await fs.access(definitionsDir);
    } catch {
        throw new Error(`Default definitions folder not found: ${definitionsDir}`);
    }

    // Identify default files
    const files = await fs.readdir(definitionsDir);
    const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

    // Check if local override directory exists
    let hasLocalOverrides = false;
    try {
        await fs.access(localDefinitionsDir);
        hasLocalOverrides = true;
    } catch {
        // Ignore if it doesn't exist
    }
    
    // Parallel reading and processing
    const results = await Promise.all(yamlFiles.map(async (file) => {
        try {
            let content;
            let source = 'default';

            // Feature 2: Local Override
            if (hasLocalOverrides) {
                try {
                    const localPath = path.join(localDefinitionsDir, file);
                    await fs.access(localPath);
                    content = await fs.readFile(localPath, 'utf8');
                    source = 'local';
                } catch {
                    // Local file doesn't exist, use default
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
                    error: 'Schema validation failed',
                    details: parsed.error.format()
                };
            }

            const agent = parsed.data;
            
            // Normalize slug
            agent.slug = file.replace(/\.ya?ml$/, '').replace(/\./g, '-');
            agent.originalName = file.replace(/\.ya?ml$/, '');
            agent.source = source; // Useful metadata for logs

            // Feature 5: Stack Rules Injection
            if (options.stackProfile && STACK_PROFILES[options.stackProfile]) {
                const stackRules = STACK_PROFILES[options.stackProfile].rules;
                if (stackRules && stackRules.length > 0) {
                    agent.rules = [...agent.rules, ...stackRules];
                }
            }

            // Feature 3: Global Rules Injection
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

    // Separate successes and failures
    const validAgents = [];
    const errors = [];

    results.forEach(res => {
        if (res.success) {
            validAgents.push(res.agent);
        } else {
            errors.push(res);
            console.warn(pc.yellow(`⚠️  Skipping ${res.file}: ${res.error}`));
        }
    });

    return validAgents;
}

module.exports = { loadAgents };
