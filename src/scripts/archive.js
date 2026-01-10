const fs = require('fs');
const path = require('path');
const readline = require('readline');

const docsDir = path.join(process.cwd(), '.sdd-toolkit');
const archiveDir = path.join(docsDir, 'logs', 'archive');

// Files to archive (Ephemeral context)
const filesToArchive = ['project.md', 'task.md', 'audit_report.md', 'requirements.md', 'milestones.md'];

// Files to keep (Long-term context)
// - context.md (Project Reality)
// - system.md (System State)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('📦 SDD SESSION ARCHIVER');
console.log('This will move current Spec, Plan, and Audit reports to .sdd-toolkit/logs/archive/.');
console.log('Your Context and System files will remain untouched.\n');

// Check if there is anything to archive
const existingFiles = filesToArchive.filter(f => fs.existsSync(path.join(docsDir, f)));

if (existingFiles.length === 0) {
    console.log('❌ No active session files found (spec.md, plan.md, etc). Nothing to archive.');
    process.exit(0);
}

rl.question('Enter a name for this feature/session (e.g., "auth-system"): ', (name) => {
    const safeName = (name || 'untitled').replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const folderName = `${timestamp}_${safeName}`;
    const targetDir = path.join(archiveDir, folderName);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log(`\nMoving files to: .sdd-toolkit/logs/archive/${folderName}/
`);

    existingFiles.forEach(file => {
        const srcPath = path.join(docsDir, file);
        const destPath = path.join(targetDir, file);
        fs.renameSync(srcPath, destPath);
        console.log(`✔ Archived: ${file}`);
    });

    console.log('\n✅ Session archived successfully!');
    console.log('You are ready to start a new feature with /feature');
    rl.close();
});
