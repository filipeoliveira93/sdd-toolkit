const fs = require('fs/promises');
const path = require('path');
const pc = require('picocolors');
const { t } = require('./i18n');

const DOCS_DIR = '.sdd-toolkit';
const PROJECT_FILE = path.join(DOCS_DIR, 'project.md');
const TASKS_FILE = path.join(DOCS_DIR, 'task.md');
const LOGS_DIR = path.join(DOCS_DIR, 'logs', 'executions');
const PACKAGE_FILE = 'package.json';

/**
 * Extracts metadata from package.json (priority) or project.md
 */
async function getProjectMetadata() {
    let meta = { title: 'Project', version: '0.0.0', status: 'Active' };

    // Try reading package.json first (Single Source of Truth for Version)
    try {
        const pkgContent = await fs.readFile(PACKAGE_FILE, 'utf8');
        const pkg = JSON.parse(pkgContent);
        if (pkg.name) meta.title = pkg.name;
        if (pkg.version) meta.version = pkg.version;
    } catch (e) {
        // Ignore if no package.json
    }

    // Try reading project.md for status or title fallback
    try {
        const content = await fs.readFile(PROJECT_FILE, 'utf8');
        
        // Only override title if package.json didn't provide one
        if (meta.title === 'Project') {
            const titleMatch = content.match(/title:\s*(.+)/);
            if (titleMatch) meta.title = titleMatch[1].trim();
        }

        const statusMatch = content.match(/status:\s*(.+)/);
        if (statusMatch) meta.status = statusMatch[1].trim();

    } catch (e) {
        // Ignore errors
    }

    return meta;
}

/**
 * Parses task.md to calculate progress metrics
 */
async function getTaskProgress() {
    try {
        const content = await fs.readFile(TASKS_FILE, 'utf8');
        
        // Extract Milestone Name
        const milestoneMatch = content.match(/# Execution Backlog:\s*(.+)/);
        const milestone = milestoneMatch ? milestoneMatch[1].trim() : 'General Tasks';

        // Count Checkboxes
        const total = (content.match(/- \[ \]/g) || []).length + (content.match(/- \[x\]/g) || []).length;
        const done = (content.match(/- \[x\]/g) || []).length;
        const pending = total - done;
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;

        return { milestone, total, done, pending, percent };
    } catch (e) {
        return { milestone: 'No active plan', total: 0, done: 0, pending: 0, percent: 0 };
    }
}

/**
 * Retrieves the N most recent execution logs
 */
async function getRecentLogs(limit = 5) {
    try {
        // Ensure dir exists to avoid crash
        await fs.access(LOGS_DIR);
        
        const files = await fs.readdir(LOGS_DIR);
        
        // Read stats for sorting
        const fileStats = await Promise.all(
            files
                .filter(f => f.endsWith('.md'))
                .map(async (file) => {
                    const filePath = path.join(LOGS_DIR, file);
                    const stats = await fs.stat(filePath);
                    return { file, mtime: stats.mtime, filePath };
                })
        );

        // Sort by time desc
        const sorted = fileStats.sort((a, b) => b.mtime - a.mtime).slice(0, limit);

        // Read content to get status/task ID if possible (simplified for now)
        const logs = sorted.map(item => {
            const name = item.file.replace('.md', '');
            return {
                name,
                date: item.mtime.toLocaleDateString(),
                status: 'Completed' 
            };
        });

        return logs;
    } catch (e) {
        return [];
    }
}

/**
 * UI Component: Progress Bar
 * [██████░░░░] 60%
 */
function drawProgressBar(percent, width = 20) {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    
    const bar = pc.green('█'.repeat(filled)) + pc.gray('░'.repeat(empty));
    return `[${bar}] ${pc.bold(percent + '%')}`;
}

/**
 * UI Component: Box
 */
function drawBox(lines) {
    const maxWidth = Math.max(60, ...lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length));
    const borderTop = '╭' + '─'.repeat(maxWidth + 2) + '╮';
    const borderBottom = '╰' + '─'.repeat(maxWidth + 2) + '╯';
    
    console.log(pc.gray(borderTop));
    lines.forEach(line => {
        const len = line.replace(/\x1b\[[0-9;]*m/g, '').length;
        const padding = ' '.repeat(maxWidth - len);
        console.log(pc.gray('│ ') + line + padding + pc.gray(' │'));
    });
    console.log(pc.gray(borderBottom));
}

/**
 * Main Render Function
 */
async function renderDashboard() {
    console.clear();
    
    // Fetch Data Parallel
    const [meta, progress, logs] = await Promise.all([
        getProjectMetadata(),
        getTaskProgress(),
        getRecentLogs(5)
    ]);

    // Header (using i18n keys)
    drawBox([
        `${pc.magenta(t('DASHBOARD.TITLE'))} ${pc.bold(meta.title)} (v${meta.version})`,
        `${pc.cyan(t('DASHBOARD.PHASE'))}    ${progress.milestone}`,
        `${pc.yellow(t('DASHBOARD.STATUS'))}  ${meta.status}`
    ]);

    console.log(''); // Spacing

    // Progress Section
    console.log(pc.bold(t('DASHBOARD.OVERALL')));
    console.log(drawProgressBar(progress.percent, 40));
    console.log(`${pc.green('✅ ' + progress.done + ' ' + t('DASHBOARD.COMPLETED'))}  |  ${pc.red('⭕ ' + progress.pending + ' ' + t('DASHBOARD.PENDING'))}`);
    
    console.log(''); // Spacing

    // Recent Logs Section
    if (logs.length > 0) {
        console.log(pc.bold(t('DASHBOARD.RECENT')));
        logs.forEach(log => {
            console.log(`${pc.gray('•')} ${pc.dim(`[${log.date}]`)} ${log.name}`);
        });
    } else {
        console.log(pc.gray(t('DASHBOARD.NO_ACTIVITY')));
    }

    console.log(''); // Spacing
    console.log(pc.bgMagenta(pc.black(t('DASHBOARD.ACTION'))) + ' ' + t('DASHBOARD.HINT') + ' ' + pc.cyan('/dev:coder <Task_ID>') + ' ' + t('DASHBOARD.HINT_SUFFIX'));
}

module.exports = {
    getProjectMetadata,
    getTaskProgress,
    getRecentLogs,
    renderDashboard
};