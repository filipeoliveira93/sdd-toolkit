# 📋 Projeto: Universal Spec CLI (sdd-toolkit Installer)

Objetivo: Ferramenta CLI (Node.js) que configura automaticamente o ambiente de desenvolvimento e instala agentes de IA (Auditor, Coder, etc.) para diversas ferramentas (Gemini CLI, Roo Code, Cline).

## Stack Tecnológica
*   **Linguagem:** Node.js (JavaScript)
*   **Interface (TUI):** `@clack/prompts`
*   **Parsing:** `js-yaml`
*   **Distribuição:** NPM Registry (`npx sdd-toolkit`)

## Arquitetura de Pastas
```
/universal-spec
├── /src
│   └── index.js          # Lógica principal e Interface
├── /definitions          # Arquivos YAML com a definição dos Agentes
│   ├── dev.coder.yaml
│   ├── dev.auditor.yaml
│   └── ...
├── package.json
└── README.md
```

## Funcionalidades
### 1. Instalação de Agentes de IA
Lê definições agnósticas (YAML) e converte para formatos específicos:
*   **Gemini CLI:** Gera `.gemini/commands/dev/*.toml`.
*   **Roo Code / Cline:** Gera `*_custom_modes.json` (Custom Modes).
*   **Kilo Code:** Gera `.kilo/prompts/*.md`.

### 2. Configuração de Ambiente (Roadmap)
*   VS Code (Settings & Tasks).
*   Shell Aliases.
*   Git Hooks.

## Fluxo de Uso
1.  Usuário roda: `npx sdd-toolkit` (ou `npm init sdd-toolkit`).
2.  CLI pergunta: "Qual seu sistema operacional?" (Win/Mac/Linux).
3.  CLI pergunta: "Para qual IA você quer instalar os agentes?" (Gemini, Roo Code, Copilot, etc).
4.  CLI lê as definições (`src/definitions/*.yaml`).
5.  CLI gera os arquivos de configuração específicos no diretório do usuário.
6.  CLI cria a estrutura de pastas `docs/` se não existir.
