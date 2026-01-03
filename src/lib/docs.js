const fs = require('fs');
const path = require('path');

/**
 * Generates the necessary folder structure for the agents
 * Implements Smart Scaffolding: Only creates missing files/folders.
 */
function generateWorkflowGuide(baseDir) {
    const docsDir = path.join(baseDir, '.sdd-toolkit');
    
    // 1. Define folder structure based on new logging architecture
    const folders = [
        path.join(docsDir, 'features'),
        path.join(docsDir, 'logs'),
        path.join(docsDir, 'logs', 'executions'),
        path.join(docsDir, 'logs', 'reviews'),
        path.join(docsDir, 'logs', 'archive'),
    ];

    let stats = { created: 0, verified: 0 };

    // Create folders
    folders.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            stats.created++;
        } else {
            stats.verified++;
        }
    });

    // 2. Define Templates Mapping
    // Assumes templates are located in project_root/templates/
    // __dirname is src/lib/, so templates is ../../templates
    const templatesDir = path.join(__dirname, '..', '..', 'templates');
    
    const templateFiles = [
        { src: 'guidelines.md', dest: 'guidelines.md' },
        { src: 'project.md', dest: 'project.md' },
        { src: 'requirements.md', dest: 'requirements.md' },
        { src: 'milestones.md', dest: 'milestones.md' },
        { src: 'task.md', dest: 'task.md' }
    ];

    // Create files if they don't exist
    templateFiles.forEach(tpl => {
        const destPath = path.join(docsDir, tpl.dest);
        if (!fs.existsSync(destPath)) {
            try {
                // Ensure template exists before reading
                const templatePath = path.join(templatesDir, tpl.src);
                if (fs.existsSync(templatePath)) {
                    const content = fs.readFileSync(templatePath, 'utf8');
                    fs.writeFileSync(destPath, content);
                    stats.created++;
                }
            } catch (e) {
                // Fail silently/warn, do not crash the installer
                console.warn(`Warning: Could not scaffold ${tpl.dest}`);
            }
        } else {
            stats.verified++;
        }
    });
    
    return stats;
}

module.exports = { generateWorkflowGuide };
