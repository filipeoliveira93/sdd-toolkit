const fsp = require('fs/promises');
const path = require('path');
const { toAntigravitySkill } = require('../transformers');

/**
 * Handles installation for Antigravity
 * @param {Array} agents - List of agents to install
 * @param {Object} options - Installation options
 */
async function install(agents, options) {
    const skillsDir = path.join(process.cwd(), '.agent', 'skills');
    
    await fsp.mkdir(skillsDir, { recursive: true });

    await Promise.all(
        agents.map(async (agent) => {
             const skillName = agent.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

             // Generate Skill: .agent/skills/[agent-slug]/SKILL.md
             const agentSkillDir = path.join(skillsDir, skillName);
             await fsp.mkdir(agentSkillDir, { recursive: true });
             const skillContent = toAntigravitySkill(agent, options);
             await fsp.writeFile(path.join(agentSkillDir, 'SKILL.md'), skillContent);
        })
    );

    // Install Pre-defined Skills (from definitions/skills)
    const predefinedSkillsDir = path.join(__dirname, '..', '..', '..', 'definitions', 'skills');
    try {
        await fsp.access(predefinedSkillsDir);
        const skillFolders = await fsp.readdir(predefinedSkillsDir);
        
        await Promise.all(skillFolders.map(async (folder) => {
            const srcPath = path.join(predefinedSkillsDir, folder);
            const stats = await fsp.stat(srcPath);
            
            if (stats.isDirectory()) {
                const destPath = path.join(skillsDir, folder);
                await fsp.cp(srcPath, destPath, { recursive: true, force: true });
            }
        }));
    } catch (e) {
        // Silently ignore if definitions/skills doesn't exist or is inaccessible
        // console.error('Error installing predefined skills:', e);
    }
}

module.exports = { install };
