const fs = require('fs');
const path = require('path');

// Tenta carregar picocolors se estiver disponível no projeto do usuário, senão usa fallback
let pc = { 
    green: s => s, 
    blue: s => s, 
    yellow: s => s, 
    red: s => s, 
    bold: s => s, 
    bgBlue: s => s 
};
try { pc = require('picocolors'); } catch (e) {}

const docsDir = path.join(process.cwd(), '.sdd-toolkit');

function checkFile(name) {
    const p = path.join(docsDir, name);
    if (fs.existsSync(p)) {
        const stats = fs.statSync(p);
        return { exists: true, size: stats.size, mtime: stats.mtime };
    }
    return { exists: false };
}

console.clear();
console.log(pc.bgBlue(pc.bold(' 📊 SDD PROJECT STATUS ')));
console.log('');

// 1. Spec Status
const spec = checkFile('project.md');
if (spec.exists && spec.size > 100) {
    console.log(`${pc.green('✔ Spec Defined')} (Last update: ${spec.mtime.toLocaleString()})`);
} else {
    console.log(`${pc.red('✖ Spec Missing')} (Run /dev.project)`);
}

// 2. Plan Status
const plan = checkFile('task.md');
if (plan.exists && plan.size > 100) {
    console.log(`${pc.green('✔ Plan Active')} (Last update: ${plan.mtime.toLocaleString()})`);
    
    // Tenta ler progresso simples
    try {
        const content = fs.readFileSync(path.join(docsDir, 'task.md'), 'utf-8');
        const total = (content.match(/- \[ \]/g) || []).length + (content.match(/- \[x\]/g) || []).length;
        const done = (content.match(/- \[x\]/g) || []).length;
        if (total > 0) {
            const percent = Math.round((done / total) * 100);
            console.log(`   Progress: [${'#'.repeat(Math.floor(percent/10))}${'-'.repeat(10 - Math.floor(percent/10))}] ${percent}% (${done}/${total} tasks)`);
        }
    } catch (e) {}
} else {
    console.log(`${pc.yellow('⚠ Plan Missing')} (Run /dev.tasks)`);
}

console.log('');
console.log('Use /dev.build to continue work.');
