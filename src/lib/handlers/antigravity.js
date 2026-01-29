const fsp = require('fs/promises');
const path = require('path');
const { toAntigravitySkill, toAntigravityWorkflow } = require('../transformers');

/**
 * Handles installation for Antigravity
 * @param {Array} agents - List of agents to install
 * @param {Object} options - Installation options
 */
async function install(agents, options) {
    const skillsDir = path.join(process.cwd(), '.agent', 'skills');
    const workflowsDir = path.join(process.cwd(), '.agent', 'workflows');
    
    await fsp.mkdir(skillsDir, { recursive: true });
    await fsp.mkdir(workflowsDir, { recursive: true });

    await Promise.all(
        agents.map(async (agent) => {
             const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

             // Generate Skill: .agent/skills/[agent-slug]/SKILL.md
             const agentSkillDir = path.join(skillsDir, skillName);
             await fsp.mkdir(agentSkillDir, { recursive: true });
             const skillContent = toAntigravitySkill(agent, options);
             await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skillContent);

             // Generate Workflow: .agent/workflows/[agent-slug].md
             const workflowContent = toAntigravityWorkflow(agent, options);
             await fsp.writeFile(path.join(workflowsDir, `${skillName}.md`), workflowContent);
        })
    );
}

module.exports = { install };
