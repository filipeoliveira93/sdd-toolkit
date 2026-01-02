/**
 * Centralized User-Facing Strings
 * Used for future Internationalization (i18n)
 */

const MESSAGES = {
    INTRO: {
        TITLE: ' UNIVERSAL SPEC CLI ',
        UPGRADE_TITLE: ' SDD TOOLKIT: UPGRADE MODE ',
    },
    UPGRADE: {
        NO_CONFIG: 'No existing configuration detected for upgrade. Starting standard installation.',
        NO_CONFIG_TITLE: 'Info',
        DETECTED_TOOLS: (tools) => `Tools detected: ${tools}`,
        DETECTED_TITLE: 'Upgrading...',
        SUCCESS: 'Agents updated successfully! 🚀',
    },
    SCAFFOLD: {
        SUCCESS: '✔ Folder structure (docs/) verified.',
    },
    SETUP: {
        STACK_SELECT: 'What is your technology Stack profile?',
        GLOBAL_RULES: 'Do you want to add any Global Rules for ALL agents?',
        GLOBAL_RULES_HINT: 'Ex: Always reply in English; Use Conventional Commits...',
        TOOL_SELECT: 'Which tools do you want to install the Agents for?',
        TOOL_HINT: 'Space to select, Enter to confirm',
        NO_TOOLS: 'No tools selected. Operation cancelled.',
        SUCCESS: 'Setup completed successfully! 🚀',
    },
    INSTALL: {
        LOADING: 'Loading definitions...',
        NO_AGENTS: 'No valid agents found.',
        INSTALLING: (tools) => `Installing agents for: ${tools}...`,
        FINISHED: 'Installation finished!',
        ROO_WARNING: 'Remember to configure Custom Modes in settings.json for Roo/Cline.',
        ROO_WARNING_TITLE: 'Warning',
        FAILED: 'Failed',
    },
    TOOLS: {
        GEMINI: 'Gemini CLI',
        ROO: 'Roo Code',
        CLINE: 'Cline',
        CURSOR: 'Cursor',
        WINDSURF: 'Windsurf',
        TRAE: 'Trae IDE',
        KILO: 'Kilo Code',
        COPILOT: 'GitHub Copilot',
        WEB: 'OpenAI / Claude',
        OPENCODE: 'OpenCode',
    },
    LANGUAGE_RULES: {
        EN: 'Always reply in English unless told otherwise.',
        PT_BR: 'Responda sempre em Português (Brasil), a menos que solicitado o contrário.',
    }
};

module.exports = { MESSAGES };
