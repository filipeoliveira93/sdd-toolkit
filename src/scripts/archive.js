const fs = require('fs');
const path = require('path');
const readline = require('readline');

const docsDir = path.join(process.cwd(), 'docs');
const archiveDir = path.join(docsDir, 'archive');

// Files to archive (Ephemeral context)
const filesToArchive = ['spec.md', 'plan.md', 'audit_report.md'];

// Files to keep (Long-term context)
// - guidelines.md (Laws)
// - context.md (Project Reality)
// - work_log.md (History)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('📦 SDD SESSION ARCHIVER');
console.log('This will move current Spec, Plan, and Audit reports to docs/archive/.');
console.log('Your Work Log and Context will remain untouched.\n');

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

    console.log(`\nMoving files to: docs/archive/${folderName}/
`);

    existingFiles.forEach(file => {
        const srcPath = path.join(docsDir, file);
        const destPath = path.join(targetDir, file);
        fs.renameSync(srcPath, destPath);
        console.log(`✔ Archived: ${file}`);
    });

    console.log('\n✅ Session archived successfully!');
    console.log('You are ready to start a new feature with /dev.spec');
    rl.close();
});
