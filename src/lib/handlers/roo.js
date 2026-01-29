const fsp = require('fs/promises');
const path = require('path');
const { toRooSkill } = require('../transformers');

/**
 * Handles installation for Roo Code
 * @param {Array} agents - List of agents to install
 * @param {Object} options - Installation options
 */
async function install(agents, options) {
    const skillsDir = path.join(process.cwd(), '.roo', 'skills');
    await fsp.mkdir(skillsDir, { recursive: true });

    await Promise.all(
        agents.map(async (agent) => {
            const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            // Generate Skill: .roo/skills/[agent-slug]/SKILL.md
            const agentSkillDir = path.join(skillsDir, skillName);
            await fsp.mkdir(agentSkillDir, { recursive: true });
            const skillContent = toRooSkill(agent, options);
            await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skillContent);
        })
    );
}

module.exports = { install };
