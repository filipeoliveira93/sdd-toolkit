#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { intro, outro, multiselect, spinner, note, select, text } = require('@clack/prompts');
const pc = require('picocolors');

// Internal Modules
const { loadAgents } = require('./lib/agents');
const { setLocale, t, getLocale } = require('./lib/i18n');
const { generateWorkflowGuide } = require('./lib/docs');
const { view } = require('./commands/view');
const handlers = require('./lib/handlers');

async function main() {
    console.clear();

    const args = process.argv.slice(2);

    if (args[0] === 'view') {
        await view();
        process.exit(0);
    }

    const isUpgrade = args.includes('upgrade') || args.includes('--upgrade');

    // 0. Language Selection
    if (!isUpgrade) {
        intro(pc.bgMagenta(pc.white(' UNIVERSAL SPEC CLI ')));

        const lang = await select({
            message: 'Select Language / Selecione o Idioma / Seleccione el Idioma',
            options: [
                { value: 'en', label: 'English' },
                { value: 'pt_br', label: 'Português (Brasil)' },
                { value: 'es', label: 'Español' }
            ]
        });

        if (typeof lang === 'symbol') {
            outro(pc.yellow('Operation cancelled.'));
            process.exit(0);
        }

        setLocale(lang);
    } else {
        setLocale('en');
    }

    if (isUpgrade) {
        intro(pc.bgBlue(pc.white(t('INTRO.UPGRADE_TITLE'))));

        const tools = [];
        if (fs.existsSync(path.join(process.cwd(), '.gemini'))) tools.push('gemini');
        if (fs.existsSync(path.join(process.cwd(), '.roo'))) tools.push('roo');
        if (fs.existsSync(path.join(process.cwd(), '.cline'))) tools.push('cline');
        if (fs.existsSync(path.join(process.cwd(), '.cursor'))) tools.push('cursor');
        if (fs.existsSync(path.join(process.cwd(), '.windsurf'))) tools.push('windsurf');
        if (fs.existsSync(path.join(process.cwd(), '.claude'))) tools.push('claude');
        if (fs.existsSync(path.join(process.cwd(), '.trae'))) tools.push('trae');
        if (fs.existsSync(path.join(process.cwd(), '.kilocode'))) tools.push('kilo');
        if (fs.existsSync(path.join(process.cwd(), '.github'))) tools.push('copilot');
        if (fs.existsSync(path.join(process.cwd(), '.roo'))) tools.push('roo');
        if (fs.existsSync(path.join(process.cwd(), '.opencode'))) tools.push('opencode');
        if (fs.existsSync(path.join(process.cwd(), 'prompts'))) tools.push('web');

        if (fs.existsSync(path.join(process.cwd(), '.antigravity'))) tools.push('antigravity');
        if (tools.length === 0) {
            note(t('UPGRADE.NO_CONFIG'), t('UPGRADE.NO_CONFIG_TITLE'));
        } else {
            note(t('UPGRADE.DETECTED_TOOLS', tools.join(', ')), t('UPGRADE.DETECTED_TITLE'));
            
            // 1. Smart Scaffolding (Update folders, preserve files)
            const s = spinner();
            s.start(t('SCAFFOLD.LOADING'));
            try {
                const stats = generateWorkflowGuide(process.cwd());
                if (stats.created > 0) {
                     s.stop(`${t('SCAFFOLD.SUCCESS')} (${stats.created} new, ${stats.verified} verified)`);
                } else {
                     s.stop(t('SCAFFOLD.ALREADY_EXISTS'));
                }
            } catch (e) {
                s.stop(pc.red(t('SCAFFOLD.ERROR')));
            }

            // 2. Update Agents
            await processAgentsInstallation(tools, { locale: getLocale() });
            outro(pc.green(t('UPGRADE.SUCCESS')));
            process.exit(0);
        }
    }

    // 1. Automatic Scaffold
    const s = spinner();
    s.start(t('SCAFFOLD.LOADING'));

    try {
        const stats = generateWorkflowGuide(process.cwd());
        if (stats.created > 0) {
            s.stop(`${t('SCAFFOLD.SUCCESS')} (${stats.created} new, ${stats.verified} verified)`);
        } else {
            s.stop(t('SCAFFOLD.ALREADY_EXISTS'));
        }
    } catch (e) {
        s.stop(pc.red(t('SCAFFOLD.ERROR')));
    }

    // 2. Feature 3: Global Rules
    const globalRules = await text({
        message: t('SETUP.GLOBAL_RULES'),
        placeholder: t('SETUP.GLOBAL_RULES_HINT'),
        required: false
    });

    if (typeof globalRules === 'symbol') {
        outro(pc.yellow(t('GENERAL.CANCELLED')));
        process.exit(0);
    }

    // 4. Tool Selection
    const tools = await multiselect({
        message: t('SETUP.TOOL_SELECT'),
        options: [
            { value: 'gemini', label: t('TOOLS.GEMINI'), hint: '.gemini/commands/* & skills/*' },
            { value: 'roo', label: t('TOOLS.ROO'), hint: '.roo/skills/*' },
            { value: 'cursor', label: t('TOOLS.CURSOR'), hint: '.cursor/commands/* & skills/*' },
            { value: 'claude', label: 'Claude Code', hint: '.claude/commands/* & skills/* & agents/*' },
            { value: 'kilo', label: t('TOOLS.KILO'), hint: '.kilocode/workflows/* & skills/*' },
            { value: 'opencode', label: t('TOOLS.OPENCODE'), hint: '.opencode/skills/* & agents/*' },
            { value: 'antigravity', label: t('TOOLS.ANTIGRAVITY'), hint: '.agent/skills/* & workflows/*' }
        ],
        required: true,
        hint: t('SETUP.TOOL_HINT')
    });

    if (typeof tools === 'symbol') {
        outro(pc.yellow(t('GENERAL.CANCELLED')));
        process.exit(0);
    }

    if (!tools || tools.length === 0) {
        outro(t('SETUP.NO_TOOLS'));
        process.exit(0);
    }

    await processAgentsInstallation(tools, { globalRules, locale: getLocale() });

    outro(pc.green(t('SETUP.SUCCESS')));
}

async function processAgentsInstallation(tools, options) {
    const s = spinner();
    s.start(t('INSTALL.LOADING'));

    try {
        const validAgents = await loadAgents(options);

        if (validAgents.length === 0) {
            s.stop(t('INSTALL.NO_AGENTS'));
            return;
        }

        s.message(t('INSTALL.INSTALLING', tools.join(', ')));

        for (const tool of tools) {
            const handler = handlers[tool];
            if (handler && typeof handler.install === 'function') {
                await handler.install(validAgents, options);
            }
        }

        s.stop(t('INSTALL.FINISHED'));

        if (tools.includes('roo') || tools.includes('cline')) {
            note(t('INSTALL.ROO_WARNING'), t('INSTALL.ROO_WARNING_TITLE'));
        }
    } catch (e) {
        s.stop(pc.red(`${t('INSTALL.FAILED')}: ${e.message}`));
        process.exit(1);
    }
}

main().catch(console.error);
