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
        SUCCESS: '✔ Folder structure (.sdd-toolkit/) created.',
        ALREADY_EXISTS: '✔ Folder structure (.sdd-toolkit/) verified.',
        ERROR: 'Failed to verify workspace structure.',
    },
    SETUP: {
        GLOBAL_RULES: 'Do you want to add any Global Rules for ALL agents?',
        GLOBAL_RULES_HINT: 'Ex: Always reply in English; Use Conventional Commits...',
        TOOL_SELECT: 'Which tools do you want to install Agents for?',
        TOOL_HINT: 'Space to select, Enter to confirm',
        NO_TOOLS: 'No tools selected. Operation cancelled.',
        SUCCESS: 'Setup completed successfully! 🚀',
    },
    INSTALL: {
        LOADING: 'Loading definitions...',
        NO_AGENTS: 'No valid agents found.',
        INSTALLING: (tools) => `Installing agents for: ${tools}...`,
        FINISHED: 'Installation finished!',
        CLINE_WARNING: 'Remember to configure Custom Modes in settings.json for Cline.',
        CLINE_WARNING_TITLE: 'Warning',
        FAILED: 'Failed',
    },
    TOOLS: {
        GEMINI: 'Gemini CLI',
        CLINE: 'Cline',
        CURSOR: 'Cursor',
        WINDSURF: 'Windsurf',
        TRAE: 'Trae IDE',
        KILO: 'Kilo Code',
        COPILOT: 'GitHub Copilot',
        WEB: 'OpenAI / Claude',
        OPENCODE: 'OpenCode (Skills)',
        ANTIGRAVITY: 'Antigravity (Skills)',
    },
    LANGUAGE_RULES: {
        EN: 'Always reply in English unless told otherwise.',
        PT_BR: 'Responda sempre em Português (Brasil), a menos que solicitado o contrário.',
        ES: 'Responda siempre en Español, a menos que se solicite lo contrario.',
    },
    DASHBOARD: {
        TITLE: '🚀 PROJECT:',
        PHASE: '📅 PHASE:',
        STATUS: '📡 STATUS:',
        OVERALL: 'OVERALL STATUS',
        COMPLETED: 'Completed',
        PENDING: 'Pending',
        RECENT: 'RECENT ACTIVITY',
        NO_ACTIVITY: 'No recent activity recorded.',
        ACTION: ' 👉 ACTION: ',
        HINT: 'Use',
        HINT_SUFFIX: 'to work.',
        LOADING: 'Loading Dashboard...',
        SUCCESS: 'Dashboard updated.',
        ERROR: 'Error loading dashboard.'
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
        SUCCESS: '✔ Estrutura de pastas (.sdd-toolkit/) criada.',
        ALREADY_EXISTS: '✔ Estrutura de pastas (.sdd-toolkit/) verificada.',
        ERROR: 'Falha ao verificar estrutura do workspace.',
    },
    SETUP: {
        GLOBAL_RULES: 'Deseja adicionar alguma Regra Global para TODOS os agentes?',
        GLOBAL_RULES_HINT: 'Ex: Sempre responder em Português; Usar Commits Convencionais...',
        TOOL_SELECT: 'Quais ferramentas você deseja instalar os Agentes?',
        TOOL_HINT: 'Espaço para selecionar, Enter para confirmar',
        NO_TOOLS: 'Nenhuma ferramenta selecionada. Operação cancelada.',
        SUCCESS: 'Configuração concluída com sucesso! 🚀',
    },
    INSTALL: {
        LOADING: 'Carregando definições...',
        NO_AGENTS: 'Nenhum agente válido encontrado.',
        INSTALLING: (tools) => `Instalando agentes para: ${tools}...`,
        FINISHED: 'Instalação finalizada!',
        CLINE_WARNING: 'Lembre-se de configurar os Custom Modes em settings.json para Cline.',
        CLINE_WARNING_TITLE: 'Aviso',
        FAILED: 'Falhou',
    },
    TOOLS: {
        GEMINI: 'Gemini CLI',
        CLINE: 'Cline',
        CURSOR: 'Cursor',
        WINDSURF: 'Windsurf',
        TRAE: 'Trae IDE',
        KILO: 'Kilo Code',
        COPILOT: 'GitHub Copilot',
        WEB: 'OpenAI / Claude',
        OPENCODE: 'OpenCode (Skills)',
        ANTIGRAVITY: 'Antigravity (Skills)',
    },
    LANGUAGE_RULES: {
        EN: 'Always reply in English unless told otherwise.',
        PT_BR: 'Responda sempre em Português (Brasil), a menos que solicitado o contrário.',
        ES: 'Responda sempre en Español, a menos que se solicite lo contrario.',
    },
    DASHBOARD: {
        TITLE: '🚀 PROJETO:',
        PHASE: '📅 FASE:',
        STATUS: '📡 STATUS:',
        OVERALL: 'STATUS GERAL',
        COMPLETED: 'Concluídas',
        PENDING: 'Pendentes',
        RECENT: 'ATIVIDADE RECENTE',
        NO_ACTIVITY: 'Nenhuma atividade recente registrada.',
        ACTION: ' 👉 AÇÃO: ',
        HINT: 'Use',
        HINT_SUFFIX: 'para trabalhar.',
        LOADING: 'Carregando Dashboard...',
        SUCCESS: 'Dashboard atualizado.',
        ERROR: 'Erro ao carregar dashboard.'
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
        SUCCESS: '✔ Estructura de carpetas (.sdd-toolkit/) creada.',
        ALREADY_EXISTS: '✔ Estructura de carpetas (.sdd-toolkit/) verificada.',
        ERROR: 'Fallo al verificar estructura del espacio de trabajo.',
    },
    SETUP: {
        GLOBAL_RULES: '¿Desea agregar alguna Regla Global para TODOS los agentes?',
        GLOBAL_RULES_HINT: 'Ej: Siempre responder en Español; Usar Commits Convencionales...',
        TOOL_SELECT: '¿Qué herramientas desea instalar los Agentes?',
        TOOL_HINT: 'Espacio para seleccionar, Enter para confirmar',
        NO_TOOLS: 'Ninguna herramienta seleccionada. Operación cancelada.',
        SUCCESS: '¡Configuración completada con éxito! 🚀',
    },
    INSTALL: {
        LOADING: 'Cargando definiciones...',
        NO_AGENTS: 'No se encontraron agentes válidos.',
        INSTALLING: (tools) => `Instalando agentes para: ${tools}...`,
        FINISHED: '¡Instalación finalizada!',
        CLINE_WARNING: 'Recuerde configurar los Modos Personalizados en settings.json para Cline.',
        CLINE_WARNING_TITLE: 'Aviso',
        FAILED: 'Falló',
    },
    TOOLS: {
        GEMINI: 'Gemini CLI',
        CLINE: 'Cline',
        CURSOR: 'Cursor',
        WINDSURF: 'Windsurf',
        TRAE: 'Trae IDE',
        KILO: 'Kilo Code',
        COPILOT: 'GitHub Copilot',
        WEB: 'OpenAI / Claude',
        OPENCODE: 'OpenCode (Skills)',
        ANTIGRAVITY: 'Antigravity (Skills)',
    },
    LANGUAGE_RULES: {
        EN: 'Always reply in English unless told otherwise.',
        PT_BR: 'Responda siempre em Português (Brasil), a menos que solicitado o contrário.',
        ES: 'Responda siempre en Español, a menos que se solicite lo contrario.',
    },
    DASHBOARD: {
        TITLE: '🚀 PROYECTO:',
        PHASE: '📅 FASE:',
        STATUS: '📡 ESTADO:',
        OVERALL: 'ESTADO GENERAL',
        COMPLETED: 'Completadas',
        PENDING: 'Pendientes',
        RECENT: 'ACTIVIDAD RECIENTE',
        NO_ACTIVITY: 'No hay actividad reciente registrada.',
        ACTION: ' 👉 ACCIÓN: ',
        HINT: 'Use',
        HINT_SUFFIX: 'para trabajar.',
        LOADING: 'Cargando Dashboard...',
        SUCCESS: 'Dashboard actualizado.',
        ERROR: 'Error al cargar dashboard.'
    }
};

const TRANSLATIONS = {
    en: EN,
    pt_br: PT_BR,
    es: ES
};

module.exports = { TRANSLATIONS, MESSAGES: EN };
