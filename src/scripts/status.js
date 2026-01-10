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
    console.log(`${pc.red('✖ Spec Missing')} (Run /project)`);
}

// 2. Plan Status - Check for new structure
const contextFile = checkFile('context.md');
const stateFiles = fs.readdirSync(path.join(docsDir, 'features')).filter(f => f.endsWith('state.md'));
const featuresCount = stateFiles.length;

if (featuresCount > 0) {
    console.log(`${pc.green('✔ Features Active')} (${featuresCount} features)`);
} else {
    console.log(`${pc.yellow('⚠ No Features Found')} (Run /feature)`);
}

console.log('');
console.log('Use /coder <Task_ID> to continue work.');
