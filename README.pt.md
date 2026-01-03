# sdd-toolkit (CLI de Especificação Universal)

CLI tool para configurar automaticamente o ambiente de desenvolvimento e instalar agentes de IA (Auditor, Coder, etc.) para várias ferramentas modernas de IA.

## Visão Geral

**sdd-toolkit** é um "Gerenciador de Pacotes de Agentes de IA". Ele define uma equipe padrão de Desenvolvedores de IA e os instala diretamente no contexto de sua assistente de codificação de IA favorita (como Gemini, Roo Code, Kilo Code, OpenCode).

A ideia principal é parar de criar prompts do zero e instalar um workflow comprovado e estruturado.

## 🚀 Recursos Principais

### 1. Workflow Inteligente e Ágil
- **Fluxo Híbrido:** Suporta planejamento "Waterfall" (para novos projetos) e execução "Agile" (para hotfixes).
- **Contexto Inteligente:** Os agentes escaneiam automaticamente seu `package.json`, `go.mod`, ou `requirements.txt` para entender sua stack. Não mais explicar "Eu uso React" toda vez.
- **Memória Unificada:** Todo contexto é armazenado em uma pasta oculta `.sdd-toolkit/`, mantendo sua raiz limpa.

### 2. "Comandos de Potência"
Os agentes vêm equipados com modos de execução especiais acionados por comandos:
- **`/flow:debug`**: Cole um log de erro e o Coder entra no "Modo Cirúrgico" para corrigir imediatamente.
- **`/flow:tdd`**: Força o ciclo Red-Green-Refactor para código de alta qualidade.
- **`/flow:refactor`**: Aplica princípios de Clean Code a um arquivo existente.
- **`/flow:gen-tests`**: Gera automaticamente testes unitários para seu código.
- **`/flow:security`**: Escaneia seu código/plano em busca de vulnerabilidades (OWASP).
- **`/flow:sync`**: Atualiza a documentação (`project.md`) para corresponder ao código real (Engenharia Reversa).

### 3. Instalação de Agentes de IA
Lê definições agnósticas (YAML) e as converte para formatos específicos:
- **Gemini CLI:** Gera arquivos de configuração `.toml`.
-   **Roo Code / Cline:** Gera modos customizados (`_custom_modes.json`) e regras de contexto em `.roo/` ou `.cline/`.
-   **GitHub Copilot:** Gera instruções em `.github/copilot-instructions.md` e agentes em `.github/agents/`.
-   **Cursor:** Gera regras em `.cursor/rules/*.mdc`.
-   **Windsurf:** Gera regras em `.windsurfrules`.
-   **Trae:** Gera instruções em `.trae/instructions.md`.
-   **OpenCode:** Gera agentes em `.opencode/`.
-   **Kilo Code:** Gera prompts Markdown (`.kilo/prompts/*.md`).

## 👥 A Equipe (Funções dos Agentes)

O sistema instala uma equipe de agentes especializados:

### 🏗️ Agentes Estratégicos
- **@Arquitetos de Projeto:** Define o escopo e princípios.
- **@Engenheiros de Requisitos:** Define a stack técnica (Auto-detectada).
- **@Gerenciadores de Marcos:** Cria o roadmap.

### ⚡ Agentes de Execução
- **@Planejadores de Tarefas:** Quebra marcos em tarefas atômicas.
- **@Gerenciadores de Recursos:** O ponto de entrada ágil. Trata solicitações como "Adicionar Login Google" e decide o melhor caminho (Hotfix vs Milestone).
- **@Codificadores:** O desenvolvedor sênior. Suporta modos TDD, Debug, Refactor e Geração de Testes.

### 🛡️ Agentes de Qualidade
- **@Auditores:** Verifica consistência entre requisitos e tarefas.
- **@QA Engineers:** Revisa código contra a especificação.
- **@DevOps Engineers:** Trata Docker, CI/CD e Configs.

## Instalação e Uso

Você pode executar a ferramenta diretamente via `npx` sem instalação prévia:

```bash
npx sdd-toolkit
```

Ou instalar globalmente:

```bash
npm install -g sdd-toolkit
sdd-toolkit
```

## Como Funciona

1.  **Inicialização:** O assistente detecta suas ferramentas e configura a pasta de contexto oculta `.sdd-toolkit/`.
2.  **Construção de Agentes:** Lê os "Protocolos de Pensamento" (YAML) e os compila no formato nativo de sua ferramenta de IA.
3.  **Execução:** Você interage com os agentes usando os comandos `/dev:*` ou os novos gatilhos `/flow:*`.

## Fluxo Completo de Desenvolvimento

O sdd-toolkit implementa um **fluxo de trabalho híbrido unificado** que se adapta às suas necessidades, combinando planejamento estruturado para novos projetos com execução ágil para correções rápidas. Ele garante rastreabilidade, justificativa e qualidade através de colaboração IA-humana.

### Visão Geral do Fluxo Híbrido Unificado

- **Iniciação Inteligente:** Comece com `/dev:start "Descrição"` para roteamento inteligente. O sistema verifica docs existentes e decide entre caminhos quick ou estruturados.
- **Planejamento Condicional:** Se necessário, escala para planejamento completo (Arquitetos de Projeto → Engenheiros de Requisitos → Gerenciadores de Marcos → Planejadores de Tarefas).
- **Execução Padronizada:** Codificadores implementam tarefas com logs, seguidos de validação unificada (QA e Auditores).
- **Finalização:** Gerenciadores de Releases consolidam em changelog com confirmação humana.

### Passos Detalhados do Fluxo

#### 1. Iniciação (Inteligente)
- Comando: `/dev:start "Construir um sistema de login"`
- Ação: Arquitetos de Projeto verifica se `.sdd-toolkit/project.md` existe.
  - Se não: Entra no modo entrevista para básicos.
  - Se existe: Confirma prosseguir ou reiniciar.
- Saída: Atualiza `project.md` com notas híbridas (ex.: pontos de aprovação).

#### 2. Planejamento (Condicional)
- Se hotfix: Gerenciadores de Recursos roteia diretamente para criação de tarefas.
- Se projeto: Gerenciadores de Marcos gera roadmap com aprovação humana.
- Comandos: `/dev:requirements`, `/dev:milestone`, `/dev:tasks`.
- Saída: `requirements.md`, `milestones.md`, `task.md`.

#### 3. Execução (Padronizada)
- Comando: `/dev:coder`
- Ação: Codificador lê contexto, implementa, registra logs em `executions/`, marca tarefas como concluídas.
- Modos: `/flow:debug`, `/flow:refactor`, `/flow:tdd`, etc.
- Saída: Mudanças no código + logs de execução.

#### 4. Validação (Unificada)
- Comandos: `/dev:review`, `/dev:auditor`
- Ação: QA revisa código, Auditores verificam consistência. Pausa para entrada humana em ambiguidades.
- Saída: Relatórios de revisão em `logs/reviews/`.

#### 5. Finalização (Com Confirmação)
- Comando: `/dev:release` ou implícito após aprovação.
- Ação: Gerenciadores de Releases atualiza `changelog.md` e arquiva logs após confirmação humana.
- Saída: Changelog limpo e logs arquivados.

### Interações dos Agentes
Agentes compartilham contexto via arquivos `.sdd-toolkit/`, garantindo sem alucinações. Comandos de potência habilitam modos especializados. O fluxo promove justificativa (ex.: "Por que essa decisão?") e handoffs IA-humana para confiabilidade.

Para exemplos, veja os guias de workflow gerados em `.sdd-toolkit/`.

## Estrutura do Projeto

-   `src/`: Código fonte da CLI.
-   `definitions/`: Definições YAML de agentes (agnósticas).
-   `templates/`: Modelos de documentação.

## Licença

MIT