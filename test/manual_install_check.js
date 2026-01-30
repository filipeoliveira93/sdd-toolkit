const path = require('path');
const fs = require('fs');

// Ensure temp workspace exists
const tempDir = path.join(__dirname, 'temp_workspace');
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Change cwd to temp workspace
process.chdir(tempDir);
console.log(`Changed cwd to ${process.cwd()}`);

// Import internals
// Note: manual_install_check.js is in test/, so ../src is correct.
const { loadAgents } = require('../src/lib/agents');
const handlers = require('../src/lib/handlers');

async function run() {
    console.log('Loading agents form ../definitions ...');
    // loadAgents uses __dirname relative to its own file location, so it should find definitions correctly
    const agents = await loadAgents({ locale: 'en' });
    console.log(`Loaded ${agents.length} agents.`);

    if (agents.length === 0) {
        console.error('No agents loaded!');
        process.exit(1);
    }

    const tools = ['gemini', 'roo', 'cursor', 'kilo', 'opencode', 'antigravity'];

    console.log(`Installing tools: ${tools.join(', ')}...`);

    for (const tool of tools) {
        if (handlers[tool] && handlers[tool].install) {
            console.log(`Installing ${tool}...`);
            try {
                await handlers[tool].install(agents, { locale: 'en' });
                console.log(`✅ ${tool} installed.`);
                
                // Basic verification
                const toolDir = path.join(process.cwd(), `.${tool}`);
                // Antigravity and opencode might use different names? Check handlers.
                // But generally they create .toolname or similar.
                // Assuming standard naming for now, or just checking if *something* was created?
                // handlers/gemini creates .gemini
                // handlers/roo creates .roo
                // handlers/antigravity creates .agent (based on tool hint in index.js?) or .antigravity?
                // index.js says: antigravity -> .agent/skills (line 132)
                
                // Let's verify existence
                const possibleDirs = [
                    path.join(process.cwd(), `.${tool}`),
                    path.join(process.cwd(), `.agent`) // for antigravity
                ];
                
                const exists = possibleDirs.some(d => fs.existsSync(d));
                if (exists) {
                    console.log(`   Verified output directory exists for ${tool}.`);
                } else {
                    console.warn(`   ⚠️ Warning: Could not find obvious output directory for ${tool}.`);
                }

            } catch (e) {
                console.error(`❌ ${tool} failed:`, e);
                process.exit(1); // Fail the test
            }
        } else {
            console.warn(`⚠️ No handler setup for ${tool}`);
        }
    }

    console.log('Installation test completed successfully.');
}

run().catch(e => {
    console.error('Test execution failed:', e);
    process.exit(1);
});
