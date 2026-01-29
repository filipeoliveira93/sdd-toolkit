const fsp = require('fs/promises');
const path = require('path');
const { toOpenCodeSkill, toOpenCodeSubagent } = require('../transformers');

/**
 * Handles installation for OpenCode
 * @param {Array} agents - List of agents to install
 * @param {Object} options - Installation options
 */
async function install(agents, options) {
    const skillsDir = path.join(process.cwd(), '.opencode', 'skills');
    const agentsDir = path.join(process.cwd(), '.opencode', 'agents');
    
    // Ensure base directories exist
    await fsp.mkdir(skillsDir, { recursive: true });
    await fsp.mkdir(agentsDir, { recursive: true });

    await Promise.all(
        agents.map(async (agent) => {
             // Ensure compatibility with naming rules (lowercase, alphanumeric, single hyphens)
             const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
             
             // Generate Skill: .opencode/skills/[agent-slug]/SKILL.md
             const agentSkillDir = path.join(skillsDir, skillName);
             await fsp.mkdir(agentSkillDir, { recursive: true });
             const skillContent = toOpenCodeSkill(agent, options);
             await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skillContent);

             // Generate Subagent: .opencode/agents/[agent-slug].md
             const subagentContent = toOpenCodeSubagent(agent, options);
             await fsp.writeFile(path.join(agentsDir, `${skillName}.md`), subagentContent);
        })
    );
}

module.exports = { install };
