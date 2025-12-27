const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'docs');

console.log('⚠️  WARNING: This will wipe all documentation (Spec, Plan, Context).');
console.log('Your source code (src/) will NOT be touched.');
console.log('Are you sure? (Run with --force to execute)');

if (process.argv.includes('--force')) {
    ['spec.md', 'plan.md', 'context.md', 'audit_report.md'].forEach(file => {
        const p = path.join(docsDir, file);
        if (fs.existsSync(p)) {
            fs.unlinkSync(p);
            console.log(`Deleted: docs/${file}`);
        }
    });
    console.log('✅ Wipe complete. You can start fresh with /dev.explore');
}
