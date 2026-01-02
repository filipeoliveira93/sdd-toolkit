# Work Log - Universal Spec CLI

## [2025-12-19] - Fundação do Projeto

### 1. Inicialização do Ambiente
- **Ação:** Executado `go mod init universal-spec`.
- **Motivo:** Definir o módulo base do projeto Go para gerenciamento de dependências.

### 2. Estrutura de Diretórios
- **Ação:** Criação das pastas `cmd`, `internal/core`, `internal/ui`, `internal/adapters`, `npm` e `examples`.
- **Motivo:** Organização seguindo as melhores práticas de Clean Architecture para projetos CLI em Go.

### 3. Gerenciamento de Dependências
- **Ação:** Instalação das bibliotecas `cobra`, `viper`, `bubbletea` e `lipgloss`.
- **Motivo:** 
    - `cobra`: Framework para comandos CLI.
    - `viper`: Gerenciamento de configurações (YAML).
    - `bubbletea` & `lipgloss`: Criação da interface interativa (TUI).

### 4. Ponto de Entrada (Main)
- **Ação:** Criado `cmd/main.go`.
- **Motivo:** Arquivo principal que delega a execução para o pacote de comandos `spec`.

### 5. Comando Raiz do CLI
- **Ação:** Criado `cmd/spec/root.go`.
- **Motivo:** Configuração do comando base `spec` e do subcomando `version` usando o framework Cobra.

### 6. Lógica de Configuração (Core)
- **Ação:** Criado `internal/core/config.go` com structs e função `LoadConfig`.
- **Motivo:** Implementar o parsing do arquivo `spec.yaml` usando Viper e mapeá-lo para structs Go tipadas.

### 7. Comando Init (Draft)
- **Ação:** Criado `cmd/spec/init.go`.
- **Motivo:** Implementação inicial do comando `init` que carrega a configuração e valida o arquivo `spec.yaml`. Conclui a Fase 1.

### 8. Interface Interativa (TUI)
- **Ação:** Implementado `internal/ui/initial_model.go` e atualizado `cmd/spec/init.go`.
- **Motivo:** Criação de um menu de seleção interativo (Checklist) usando `bubbletea`, permitindo ao usuário escolher quais componentes instalar (VS Code, Shell, Git) diretamente no terminal. Conclui a Fase 2.

### 9. Pivot para Node.js Puro
- **Ação:**
    - Removido todo o código Go (`cmd`, `internal`, `go.mod`).
    - Inicializado projeto Node.js (`package.json`, `npm install`).
    - Criado `src/index.js` usando `@clack/prompts` para UI e `js-yaml` para parsing.
    - Implementada lógica de instalação de agentes lendo de `definitions/` e gerando TOML.
- **Motivo:** Simplificar drasticamente a distribuição e manutenção. Agora o projeto é um pacote NPM padrão, sem necessidade de compilação de binários ou scripts de post-install complexos. O usuário final roda `npx agents-dev` e funciona.

### 10. Suporte Multi-Ferramenta
- **Ação:** Atualizado `src/index.js` para suportar:
    - **Roo Code / Cline:** Gera arquivos JSON (`*_custom_modes.json`) compatíveis com a configuração de "Custom Modes" destas extensões.
    - **Kilo Code:** Gera arquivos `.md` na pasta `.kilo/prompts`.
    - **Gemini CLI:** Mantido suporte a `.toml`.
- **Motivo:** Flexibilidade para o usuário escolher sua ferramenta de IA preferida e ter os agentes (`Coder`, `Auditor`, etc.) configurados automaticamente no formato correto.

### 11. Refatoração Modular e Validação (Clean Code)
- **Ação:**
    - Extraída lógica de validação para `src/lib/schema.js` usando `zod`.
    - Extraída lógica de conversão para `src/lib/transformers.js`.
    - Criado `src/lib/docs.js` para gerar documentação automática (`docs/README.md`) explicando o fluxo de trabalho dos agentes.
    - Simplificado `src/index.js` para atuar apenas como orquestrador da UI.
- **Motivo:** Melhorar a manutenibilidade, robustez (validando os YAMLs antes de processar) e experiência do usuário (entregando documentação de uso junto com os agentes).

### 12. Personalização e Contexto de Stack (Novas Features)
- **Ação:**
    - **Feature 2 (Sobrescrita Local):** Implementada lógica em `src/lib/agents.js` que verifica a existência de arquivos na pasta `.sdd/agents/`. Se existirem, eles têm prioridade sobre as definições padrão.
    - **Feature 3 (Regras Globais):** Adicionado prompt `text` no CLI para capturar regras personalizadas do usuário. Estas regras são injetadas em todos os agentes carregados.
    - **Feature 5 (Perfis de Stack):** Criado `src/lib/profiles.js` com perfis pré-definidos (React, Node, Python, Go). O usuário seleciona o perfil no início do CLI e as regras específicas da tecnologia são injetadas nos agentes (ex: Coder e Auditor).
- **Motivo:** Aumentar a flexibilidade do toolkit para diferentes tipos de projeto e permitir que o usuário refine o comportamento da IA sem editar o código fonte do CLI.

## [2025-12-31] - Revisão do Roadmap e Internacionalização

### 13. Revisão das Milestones
- **Ação:** Atualizado `docs/milestones.md`.
- **Motivo:** Refinar os objetivos das próximas fases (M3, M4, M5), traduzir o roadmap para Português (Brasil) e alinhar as metas com o estado atual do código (que já possui Stack Profiles e Global Rules).
- **Detalhes:**
    - **M3:** Focada em Estabilização, refatoração de strings do CLI e injeção consistente de regras de idioma.
    - **M4:** Focada na criação de templates oficiais para a metodologia (project, milestones, task) e no diretório de configuração unificado `.sdd-toolkit`.
    - **M5:** Focada no suporte nativo a multi-idioma (i18n) tanto no CLI quanto no output dos agentes.

### 14. Centralização de Strings (Refatoração)
- **Ação:** 
  - Criado `src/lib/messages.js` para armazenar todas as mensagens da interface.
  - Refatorado `src/index.js` para importar e usar `MESSAGES`.
- **Motivo:** Preparar o código base para a futura internacionalização (M5), eliminando strings hardcoded e facilitando a tradução.
- **Status:** M3-T01 Concluída.

### 15. Injeção de Lógica de Idioma
- **Ação:**
  - Atualizado `src/lib/messages.js` com regras de idioma (EN/PT-BR).
  - Atualizado `src/lib/transformers.js` para aceitar `options.locale` e injetar a regra correta.
  - Atualizado `src/index.js` para repassar o objeto `options` para os transformadores.
- **Motivo:** Garantir que os agentes gerados saibam em qual idioma devem responder.
- **Status:** M3-T02 Concluída.
