const fsp = require('fs/promises');
const path = require('path');
const { toClaudeCommand, toClaudeSkill, toClaudeSubagent } = require('../transformers');

/**
 * Handles installation for Claude Code
 * @param {Array} agents - List of agents to install
 * @param {Object} options - Installation options
 */
async function install(agents, options) {
    const commandsDir = path.join(process.cwd(), '.claude', 'commands', 'agents');
    const skillsDir = path.join(process.cwd(), '.claude', 'skills');
    const agentsDir = path.join(process.cwd(), '.claude', 'agents');
    
    await fsp.mkdir(commandsDir, { recursive: true });
    await fsp.mkdir(skillsDir, { recursive: true });
    await fsp.mkdir(agentsDir, { recursive: true });

    await Promise.all(
        agents.map(async (agent) => {
            const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            // Generate Command
            const command = toClaudeCommand(agent, options);
            await fsp.writeFile(path.join(commandsDir, `${agent.slug}.md`), command);

            // Generate Skill
            const agentSkillDir = path.join(skillsDir, skillName);
            await fsp.mkdir(agentSkillDir, { recursive: true });
            const skill = toClaudeSkill(agent, options);
            await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skill);

            // Generate Subagent
            const subagent = toClaudeSubagent(agent, options);
            await fsp.writeFile(path.join(agentsDir, `${skillName}.md`), subagent);
        })
    );
}

module.exports = { install };
