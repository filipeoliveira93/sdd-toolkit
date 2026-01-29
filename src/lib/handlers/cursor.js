const fsp = require('fs/promises');
const path = require('path');
const { toCursorMDC, toCursorSkill } = require('../transformers');

/**
 * Handles installation for Cursor
 * @param {Array} agents - List of agents to install
 * @param {Object} options - Installation options
 */
async function install(agents, options) {
    const commandsDir = path.join(process.cwd(), '.cursor', 'commands');
    const skillsDir = path.join(process.cwd(), '.cursor', 'skills');
    
    await fsp.mkdir(commandsDir, { recursive: true });
    await fsp.mkdir(skillsDir, { recursive: true });

    await Promise.all(
        agents.map(async (agent) => {
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
}

module.exports = { install };
