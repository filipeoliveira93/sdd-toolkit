# sdd-toolkit (CLI de Especificação Universal)

![npm version](https://img.shields.io/npm/v/sdd-toolkit)
![License: MIT](https://img.shields.io/npm/l/sdd-toolkit)
![Downloads](https://img.shields.io/npm/dm/sdd-toolkit)

CLI tool para configurar automaticamente o ambiente de desenvolvimento e instalar agentes de IA (Auditor, Coder, etc.) para várias ferramentas modernas de IA.

## Visão Geral

**sdd-toolkit** é um "Gerenciador de Pacotes de Agentes de IA". Ele define uma equipe padrão de Desenvolvedores de IA e os instala diretamente no contexto de sua assistente de codificação de IA favorita (como Gemini, Roo Code, Kilo Code, OpenCode).

A ideia principal é parar de criar prompts do zero e instalar um workflow comprovado e estruturado.

## 📑 Índice

- [Visão Geral](#visão-geral)
- [Recursos Principais](#-recursos-principais)
- [A Equipe](#-a-equipe-funções-dos-agentes)
- [Instalação e Uso](#instalação-e-uso)
- [Como Funciona](#como-funciona)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Comandos nas Ferramentas de IA](#comandos-nas-ferramentas-de-ia)
- [Estrutura de Arquivos Gerados](#estrutura-de-arquivos-gerados)
- [Exemplos de Uso](#exemplos-de-uso)
- [Solução de Problemas](#solução-de-problemas)
- [Perguntas Frequentes](#-perguntas-frequentes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Licença](#licença)

## 🚀 Recursos Principais

### 1. Workflow Inteligente e Ágil
- **Fluxo Híbrido:** Suporta planejamento "Waterfall" (para novos projetos) e execução "Agile" (para hotfixes).
- **Contexto Inteligente:** Os agentes escaneiam automaticamente seu `package.json`, `go.mod`, ou `requirements.txt` para entender sua stack. Não mais explicar "Eu uso React" toda vez.
- **Memória Unificada:** Todo contexto é armazenado em uma pasta oculta `.sdd-toolkit/`, mantendo sua raiz limpa.

### 2. Suporte Multi-Idiomas
O toolkit suporta Inglês, Português (Brasil) e Espanhol. Os agentes adaptam automaticamente suas respostas ao idioma preferido.

### 3. Instalação de Agentes de IA
Lê definições agnósticas (YAML) e as converte para formatos específicos:
- **Gemini CLI:** Gera arquivos de configuração `.toml`.
-   **Roo Code:** Gera agentes em `.roo/commands/*.md`.
-   **Cline:** Gera modos customizados (`_custom_modes.json`) e regras de contexto em `.cline/`.
-   **GitHub Copilot:** Gera instruções em `.github/prompts.md` e agentes em `.github/prompts/*.md`.
-   **Cursor:** Gera regras em `.cursor/commands/*.mdc`.
-   **Windsurf:** Gera workflows em `.windsurf/workflows/*.md`.
-   **Trae:** Gera instruções em `.trae/instructions.md`.
-   **OpenCode:** Gera agentes em `.opencode/commands/*.md`.
-   **Kilo Code:** Gera prompts Markdown (`.kilocode/workflows/*.md`).

## 👥 A Equipe (Funções dos Agentes)

O sistema instala uma equipe de agentes especializados:

### 🏗️ Agentes Estratégicos
- **@Arquiteto de Projeto:** Define o escopo e princípios.
- **@Engenheiro de Requisitos:** Define a stack técnica (Auto-detectada).

### ⚡ Agentes de Execução
- **@Gerente de Features:** Gerencia features, marcos e tarefas.
- **@Codificador:** O desenvolvedor sênior. Implementa código seguindo princípios SOLID.

### 🛡️ Agentes de Qualidade
- **@QA Engineer:** Revisa código contra a especificação.
- **@Gerente de Releases:** Consolida logs e gerencia o changelog.

## Instalação e Uso

### Configuração Inicial
Execute a ferramenta diretamente via `npx` sem instalação prévia:

```bash
npx sdd-toolkit
```

### Ver o Dashboard do Projeto
Verifique o status atual do seu projeto:

```bash
sdd-toolkit view
```

### Atualizar Instalação Existente
Atualize os agentes instalados sem reconfiguração:

```bash
sdd-toolkit upgrade
```

### Instalação Global
Ou instale globalmente:

```bash
npm install -g sdd-toolkit
sdd-toolkit
```

## Como Funciona

1.  **Inicialização:** O assistente detecta suas ferramentas e configura a pasta de contexto oculta `.sdd-toolkit/`.
2.  **Construção de Agentes:** Lê as definições dos agentes (YAML) e as compila no formato nativo da sua ferramenta de IA.
3.  **Execução:** Interaja com os agentes usando comandos simplificados (ex.: `/project`, `/coder`, `/feature`).

## Fluxo de Desenvolvimento

O sdd-toolkit fornece um fluxo de trabalho estruturado com agentes especializados:

### 1. Definir Projeto
- Comando: `/project`
- Cria `.sdd-toolkit/project.md` com o escopo e princípios do projeto.

### 2. Definir Requisitos
- Comando: `/requirements`
- Analisa sua stack e cria `.sdd-toolkit/requirements.md`.

### 3. Planejar Features
- Comando: `/feature`
- Cria `.sdd-toolkit/features/[nome].md` com marcos e tarefas.

### 4. Implementar Código
- Comando: `/coder [task-id]`
- Implementa tarefas do plano de features e registra o trabalho.

### 5. Revisar Código
- Comando: `/review [task-id]`
- QA Engineer revisa a implementação contra os requisitos.

### 6. Release
- Comando: `/log` ou `/dev:release`
- Consolida logs no changelog e arquiva o trabalho concluído.

## Comandos nas Ferramentas de IA

Uma vez que os agentes estejam instalados, use estes comandos no seu assistente de codificação de IA:

### Acessar Agentes
- **`/sdd`** - Exibe os agentes disponíveis e ajuda
- **`/sdd.project`** - Ativa o Arquiteto de Projeto
- **`/sdd.requirements`** - Ativa o Engenheiro de Requisitos
- **`/sdd.feature`** - Ativa o Gerente de Features
- **`/sdd.coder`** - Ativa o Codificador
- **`/sdd.review`** - Ativa o QA Engineer
- **`/sdd.log`** - Ativa o Gerente de Releases

### Comandos Especiais
- **`/dev:review [Task_ID]`** - Aciona revisão de código para uma tarefa específica
- **`/dev:release`** - Consolida logs e cria changelog

## Estrutura de Arquivos Gerados

Após executar `sdd-toolkit`, a seguinte estrutura é criada em seu projeto:

```
.sdd-toolkit/
├── project.md              # Escopo e princípios do projeto
├── requirements.md         # Requisitos técnicos e stack
├── guidelines.md           # Diretrizes de desenvolvimento do projeto
├── milestones.md           # Roadmap de desenvolvimento
├── task.md                # Backlog de execução de tarefas
├── features/               # Especificações individuais de features
│   └── [feature-name].md
├── logs/
│   ├── executions/         # Logs de execução de tarefas
│   ├── reviews/           # Relatórios de revisão de código
│   └── archive/          # Trabalho concluído arquivado
└── agents/               # Definições personalizadas de agentes (overrides opcionais)
```

## Estrutura do Projeto

- `definitions/`: Definições YAML de agentes
- `templates/`: Modelos de documentação
- `src/`: Código fonte da CLI

## Exemplos de Uso

### Fluxo Completo: Nova Feature

1. **Definir projeto:**
    ```
   /sdd.project
    ```
   Cria `.sdd-toolkit/project.md` com escopo e princípios.

2. **Definir requisitos técnicos:**
    ```
   /sdd.requirements
    ```
   Analisa seu `package.json`/`go.mod` e cria `.sdd-toolkit/requirements.md`.

3. **Planejar uma nova feature:**
    ```
   /sdd.feature
    ```
   Especifique sua feature (ex: "Adicionar autenticação de usuário"). Cria `.sdd-toolkit/features/auth.md`.

4. **Implementar tarefas:**
    ```
   /sdd.coder MT01-task-1
    ```
   Codificador implementa a tarefa seguindo princípios SOLID e registra o trabalho.

5. **Revisar implementação:**
    ```
   /sdd.review MT01-task-1
    ```
   QA Engineer valida a implementação contra os requisitos.

6. **Release das mudanças:**
    ```
   /sdd.log
    ```
   Consolida logs no changelog e arquiva o trabalho concluído.

### Correção Rápida de Bug

1. **Usar Codificador diretamente:**
    ```
   /sdd.coder fixar-bug-login
    ```
   Codificador analisa, corrige e documenta a mudança.

2. **Revisar correção:**
    ```
   /sdd.review fixar-bug-login
    ```
   Valida que a correção atende os requisitos.

## Licença

MIT

## ❓ Solução de Problemas

### Agentes não aparecem na sua ferramenta de IA

**Problema:** Depois de executar `sdd-toolkit`, os agentes não aparecem no seu assistente de codificação de IA.

**Soluções:**
- **Roo Code/Cline:** Verifique se você configurou os Modos Personalizados nas configurações. Veja a mensagem de aviso após a instalação.
- **Cursor:** Reinicie a IDE após a instalação.
- **OpenCode:** Atualize o painel de comandos.
- **Gemini CLI:** Verifique se a pasta `.gemini/commands/dev/` existe com arquivos `.toml`.

### Erro de permissão ao executar sdd-toolkit

**Problema:** Recebendo "Permissão negada" ou erro EACCES ao executar `npx sdd-toolkit`.

**Soluções:**
- **Opção 1:** Execute com permissões elevadas (não recomendado):
  ```bash
  sudo npx sdd-toolkit
  ```
- **Opção 2:** Corrija permissões do npm:
  ```bash
  npm config set prefix ~/.npm-global
  export PATH=~/.npm-global/bin:$PATH
  ```
- **Opção 3:** Instale globalmente com sudo:
  ```bash
  sudo npm install -g sdd-toolkit
  ```

### Agentes respondendo no idioma errado

**Problema:** Os agentes não estão respondendo no seu idioma preferido.

**Solução:**
- Execute `sdd-toolkit` novamente e certifique-se de selecionar o idioma correto durante a configuração (Inglês, Português ou Espanhol).
- Ou edite manualmente o `LANGUAGE_RULES` nos arquivos dos seus agentes.

### Perfil de stack não aplicando regras

**Problema:** As regras do perfil de stack selecionado não estão sendo usadas pelos agentes.

**Solução:**
- O perfil de stack é aplicado apenas durante a instalação inicial ou upgrade. Execute:
  ```bash
  sdd-toolkit upgrade
  ```
  Certifique-se de selecionar o mesmo perfil de stack novamente.

### Pasta `.sdd-toolkit/` não criada

**Problema:** A estrutura de pastas ocultas não é criada após a instalação.

**Soluções:**
- Verifique se você está executando o comando a partir do diretório raiz do seu projeto (onde está o `package.json`).
- Verifique as permissões de escrita no diretório.
- Verifique mensagens de erro durante a instalação.

## 🔎 Perguntas Frequentes

**P: Posso usar múltiplos assistentes de IA simultaneamente?**

R: Sim! Você pode instalar agentes para múltiplas ferramentas de IA no mesmo projeto. Cada ferramenta tem sua própria estrutura de pastas (`.roo/`, `.cline/`, `.cursor/`, etc.) e podem coexistir sem conflitos.

**P: Como atualizo os agentes após a configuração inicial?**

R: Execute `sdd-toolkit upgrade`. Isso atualizará todos os agentes instalados sem exigir que você reconfigure seu perfil de stack ou regras globais.

**P: Posso personalizar as definições dos agentes?**

R: Sim! Crie arquivos YAML personalizados na pasta `.sdd-toolkit/agents/`. O toolkit usará suas versões personalizadas em vez das padrão. Você pode copiar e modificar as definições padrão da pasta `definitions/` no toolkit.

**P: O que acontece se eu executar `sdd-toolkit` múltiplas vezes?**

R: A ferramenta é idempotente - executá-la novamente apenas atualizará ou regerará arquivos ausentes sem duplicar configurações existentes. Seus documentos de projeto existentes em `.sdd-toolkit/` serão preservados.

**P: Posso usar isso com projetos que já têm código existente?**

R: Sim! O agente "Engenheiro de Requisitos" pode analisar seu `package.json`, `go.mod` ou `requirements.txt` existente para detectar automaticamente sua stack. O "Arquiteto de Projeto" também pode formalizar projetos existentes em modo "híbrido".

**P: Preciso commitar a pasta `.sdd-toolkit/` no meu repositório?**

R: Sim, é recomendado. A pasta `.sdd-toolkit/` contém a documentação do seu projeto, especificações e configurações dos agentes. Commitá-la garante consistência em toda a equipe e preserva o contexto para sessões futuras.

**P: Como removo o sdd-toolkit do meu projeto?**

R: Simplesmente delete a pasta `.sdd-toolkit/` e quaisquer pastas específicas de ferramentas (`.roo/`, `.cline/`, `.cursor/`, etc.). Esses são todos arquivos gerados e não afetarão seu código fonte.

**P: Minhas mudanças de código são rastreadas pelo sdd-toolkit?**

R: Não, o sdd-toolkit apenas gerencia documentação e configurações de agentes de IA. Ele não rastreia mudanças de código, lê seus arquivos fonte, ou interfere com controle de versão.

**P: Posso adicionar meus próprios perfis de stack?**

R: Atualmente, os perfis de stack são codificados no toolkit. Para adicionar um perfil personalizado, você pode usar o recurso de "Regras Globais" durante a configuração para injetar suas próprias convenções, ou pode fazer um fork do repositório e adicionar seu perfil em `src/lib/profiles.js`.

**P: Isso é adequado para projetos empresariais?**

R: Sim, o sdd-toolkit é desenhado para escalar. A pasta `.sdd-toolkit/` pode ser commitada no seu repositório, garantindo que todos os membros da equipe usem as mesmas configurações de agentes e sigam os mesmos princípios de desenvolvimento definidos em `guidelines.md`.