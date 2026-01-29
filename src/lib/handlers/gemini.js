const fsp = require('fs/promises');
const path = require('path');
const { toGeminiTOML, toGeminiSkill } = require('../transformers');

/**
 * Handles installation for Gemini
 * @param {Array} agents - List of agents to install
 * @param {Object} options - Installation options
 */
async function install(agents, options) {
    const commandsDir = path.join(process.cwd(), '.gemini', 'commands', 'dev');
    const skillsDir = path.join(process.cwd(), '.gemini', 'skills');
    
    await fsp.mkdir(commandsDir, { recursive: true });
    await fsp.mkdir(skillsDir, { recursive: true });

    await Promise.all(
        agents.map(async (agent) => {
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
}

module.exports = { install };
