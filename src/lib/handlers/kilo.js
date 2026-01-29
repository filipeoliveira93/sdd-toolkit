const fsp = require('fs/promises');
const path = require('path');
const { toKiloMarkdown, toKiloSkill } = require('../transformers');

/**
 * Handles installation for Kilo Code
 * @param {Array} agents - List of agents to install
 * @param {Object} options - Installation options
 */
async function install(agents, options) {
    const workflowsDir = path.join(process.cwd(), '.kilocode', 'workflows');
    const skillsDir = path.join(process.cwd(), '.kilocode', 'skills');
    
    await fsp.mkdir(workflowsDir, { recursive: true });
    await fsp.mkdir(skillsDir, { recursive: true });

    await Promise.all(
        agents.map(async (agent) => {
            const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            // Generate Workflow
            const workflow = toKiloMarkdown(agent, options);
            await fsp.writeFile(path.join(workflowsDir, `${agent.slug}.md`), workflow);

            // Generate Skill
            const agentSkillDir = path.join(skillsDir, skillName);
            await fsp.mkdir(agentSkillDir, { recursive: true });
            const skill = toKiloSkill(agent, options);
            await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skill);
        })
    );
}

module.exports = { install };
