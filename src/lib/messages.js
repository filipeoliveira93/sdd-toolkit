/**
 * Centralized User-Facing Strings
 * Used for future Internationalization (i18n)
 */

const EN = {
    INTRO: {
        TITLE: ' UNIVERSAL SPEC CLI ',
        UPGRADE_TITLE: ' SDD TOOLKIT: UPGRADE MODE ',
    },
    GENERAL: {
        CANCELLED: 'Operation cancelled.',
    },
    UPGRADE: {
        NO_CONFIG: 'No existing configuration detected for upgrade. Starting standard installation.',
        NO_CONFIG_TITLE: 'Info',
        DETECTED_TOOLS: (tools) => `Tools detected: ${tools}`,
        DETECTED_TITLE: 'Upgrading...',
        SUCCESS: 'Agents updated successfully! 🚀',
    },
    SCAFFOLD: {
        LOADING: 'Checking workspace structure...',
        SUCCESS: '✔ Folder structure (docs/) created.',
        ALREADY_EXISTS: '✔ Folder structure (docs/) verified.',
        ERROR: 'Failed to verify workspace structure.',
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
        ES: 'Responda siempre en Español, a menos que se solicite lo contrario.',
    }
};

const PT_BR = {
    INTRO: {
        TITLE: ' UNIVERSAL SPEC CLI ',
        UPGRADE_TITLE: ' SDD TOOLKIT: MODO ATUALIZAÇÃO ',
    },
    GENERAL: {
        CANCELLED: 'Operação cancelada.',
    },
    UPGRADE: {
        NO_CONFIG: 'Nenhuma configuração existente detectada. Iniciando instalação padrão.',
        NO_CONFIG_TITLE: 'Info',
        DETECTED_TOOLS: (tools) => `Ferramentas detectadas: ${tools}`,
        DETECTED_TITLE: 'Atualizando...',
        SUCCESS: 'Agentes atualizados com sucesso! 🚀',
    },
    SCAFFOLD: {
        LOADING: 'Verificando estrutura do workspace...',
        SUCCESS: '✔ Estrutura de pastas (docs/) criada.',
        ALREADY_EXISTS: '✔ Estrutura de pastas (docs/) verificada.',
        ERROR: 'Falha ao verificar estrutura do workspace.',
    },
    SETUP: {
        STACK_SELECT: 'Qual é o perfil de tecnologia (Stack)?',
        GLOBAL_RULES: 'Deseja adicionar Regras Globais para TODOS os agentes?',
        GLOBAL_RULES_HINT: 'Ex: Sempre responda em Português; Use Conventional Commits...',
        TOOL_SELECT: 'Para quais ferramentas você deseja instalar os Agentes?',
        TOOL_HINT: 'Espaço para selecionar, Enter para confirmar',
        NO_TOOLS: 'Nenhuma ferramenta selecionada. Operação cancelada.',
        SUCCESS: 'Instalação concluída com sucesso! 🚀',
    },
    INSTALL: {
        LOADING: 'Carregando definições...',
        NO_AGENTS: 'Nenhum agente válido encontrado.',
        INSTALLING: (tools) => `Instalando agentes para: ${tools}...`,
        FINISHED: 'Instalação finalizada!',
        ROO_WARNING: 'Lembre-se de configurar os Custom Modes em settings.json para Roo/Cline.',
        ROO_WARNING_TITLE: 'Aviso',
        FAILED: 'Falhou',
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
        ES: 'Responda siempre en Español, a menos que se solicite lo contrario.',
    }
};

const ES = {
    INTRO: {
        TITLE: ' UNIVERSAL SPEC CLI ',
        UPGRADE_TITLE: ' SDD TOOLKIT: MODO ACTUALIZACIÓN ',
    },
    GENERAL: {
        CANCELLED: 'Operación cancelada.',
    },
    UPGRADE: {
        NO_CONFIG: 'No se detectó configuración existente. Iniciando instalación estándar.',
        NO_CONFIG_TITLE: 'Info',
        DETECTED_TOOLS: (tools) => `Herramientas detectadas: ${tools}`,
        DETECTED_TITLE: 'Actualizando...',
        SUCCESS: '¡Agentes actualizados con éxito! 🚀',
    },
    SCAFFOLD: {
        LOADING: 'Verificando estructura del espacio de trabajo...',
        SUCCESS: '✔ Estructura de carpetas (docs/) creada.',
        ALREADY_EXISTS: '✔ Estructura de carpetas (docs/) verificada.',
        ERROR: 'Fallo al verificar estructura del espacio de trabajo.',
    },
    SETUP: {
        STACK_SELECT: '¿Cuál es su perfil tecnológico (Stack)?',
        GLOBAL_RULES: '¿Desea agregar Reglas Globales para TODOS los agentes?',
        GLOBAL_RULES_HINT: 'Ej: Siempre responda en Español; Use Conventional Commits...',
        TOOL_SELECT: '¿Para qué herramientas desea instalar los Agentes?',
        TOOL_HINT: 'Espacio para seleccionar, Enter para confirmar',
        NO_TOOLS: 'Ninguna herramienta seleccionada. Operación cancelada.',
        SUCCESS: '¡Instalación completada con éxito! 🚀',
    },
    INSTALL: {
        LOADING: 'Cargando definiciones...',
        NO_AGENTS: 'No se encontraron agentes válidos.',
        INSTALLING: (tools) => `Instalando agentes para: ${tools}...`,
        FINISHED: '¡Instalación finalizada!',
        ROO_WARNING: 'Recuerde configurar los Modos Personalizados en settings.json para Roo/Cline.',
        ROO_WARNING_TITLE: 'Aviso',
        FAILED: 'Falló',
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
        ES: 'Responda siempre en Español, a menos que se solicite lo contrario.',
    }
};

const TRANSLATIONS = {
    en: EN,
    pt_br: PT_BR,
    es: ES
};

module.exports = { TRANSLATIONS, MESSAGES: EN };