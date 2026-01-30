const path = require('path');
const fs = require('fs');

// Ensure temp workspace exists
const tempDir = path.join(__dirname, 'temp_workspace_upgrade_verification');
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Mock existing tools
const mockTools = ['.gemini', '.roo', '.cursor', '.agent', '.windsurf']; // windsurf should NOT be detected now
mockTools.forEach(tool => {
    fs.mkdirSync(path.join(tempDir, tool), { recursive: true });
});

// Change cwd to temp workspace
process.chdir(tempDir);
console.log(`Changed cwd to ${process.cwd()}`);

// Read and parse src/index.js logic (simplified)
// Instead of running the whole CLI which requires full environment, 
// we will verify the logic by running a snippet that mirrors the fixed code.
// Or we can invoke node ../src/index.js upgrade?
// Invoking the real script is better to catch runtime issues.

const { loadAgents } = require('../src/lib/agents');
// We need to mock handlers potentially if we don't want real installation?
// But real installation is fine in temp dir.

async function verifyUpgrade() {
    console.log('--- Verifying Upgrade Logic ---');
    
    // We will run the ACTUAL index.js in a child process, but we need to mock user input?
    // Upgrade mode is non-interactive! So it should run without input.
    // We just need to make sure we are not in a TTY if prompts are shown?
    // But upgrade mode should not show prompts.

    const { execSync } = require('child_process');
    
    // We need to point to the correct src/index.js
    const indexJs = path.resolve(__dirname, '../src/index.js');
    console.log(`Running node ${indexJs} upgrade`);

    try {
        const output = execSync(`node "${indexJs}" upgrade`, { 
            cwd: tempDir,
            encoding: 'utf8',
            stdio: 'pipe' // Capture output
        });
        console.log('Output:\n', output);

        // Verify output content
        if (output.includes('Detected Tools:')) {
            // Check if windsurf is ABSENT
            if (output.includes('windsurf')) {
                console.error('FAIL: windsurf was detected!');
                process.exit(1);
            } else {
                console.log('PASS: windsurf was incorrectly ignored (GOOD)');
            }

            // Check if roo is present ONCE (hard to check from output string "gemini, roo, cursor...")
            // The output is join(', ')
            // "Detected Tools: gemini, roo, cursor, antigravity"
            
            // Check antigravity (from .agent folder)
            if (output.includes('antigravity')) {
                console.log('PASS: antigravity detected from .agent folder');
            } else {
                console.error('FAIL: antigravity NOT detected from .agent folder');
                process.exit(1);
            }
        }
        
        console.log('Upgrade verification successful.');

    } catch (e) {
        console.error('Execution failed:', e.message);
        console.error('Stdout:', e.stdout);
        console.error('Stderr:', e.stderr);
        process.exit(1);
    }
}

verifyUpgrade();
