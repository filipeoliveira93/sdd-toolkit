# sdd-toolkit (Ferramenta de Instalação de Agentes de Desenvolvimento)

Ferramenta para instalar agentes de desenvolvimento pré-definidos em ferramentas de IA, formatando-os no formato correto para cada uma.

## Visão Geral

O **sdd-toolkit** instala agentes de desenvolvimento pré-definidos (definidos em YAML) em ferramentas de IA como Gemini, Roo Code, Cursor, etc. Ele converte as definições agnósticas em configurações específicas, permitindo que os agentes sejam chamados diretamente nessas ferramentas. Não executa workflows próprios – apenas prepara os agentes para uso.

## 🚀 Recursos Principais

### 1. Instalação de Agentes

- Agentes prontos: Coder, Feature Manager, Project Architect, etc.
- Formatação automática: Converte YAML para formatos como .toml (Gemini), .mdc (Cursor), .md (Roo Code), etc.
- Instalação em pastas do projeto: Coloca os arquivos nas localizações corretas para que as ferramentas reconheçam e ativem os agentes.

### 2. Estruturação de Documentação

- Cria `.sdd-toolkit/` com templates (project.md, requirements.md) e pastas para logs/features.
- Suporte a stacks detectadas automaticamente (React, Node, etc.).

### 3. Dashboard e Atualização

- Comando `view`: Mostra progresso baseado nos arquivos scaffolded.
- Modo `upgrade`: Atualiza agentes instalados.

## 👥 Agentes Disponíveis

Agentes pré-definidos prontos para instalação:

- **Coder:** Agente de implementação e codificação.
- **Feature Manager:** Gerenciamento de funcionalidades.
- **Project Architect:** Definição de escopo e princípios.
- **Requirements Engineer:** Definição de stack técnica.
- **Milestone Manager:** Criação de roadmap.
- **Task Planner:** Quebra de tarefas.
- **QA Engineer:** Revisão de código.
- **DevOps Engineer:** Configurações de infraestrutura.
- **Release Manager:** Gerenciamento de releases.
- **SDD Helper:** Acesso e ajuda.

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

1.  **Inicialização:** O wizard detecta suas ferramentas e configura a pasta `.sdd-toolkit/` para documentação.
2.  **Instalação de Agentes:** Lê definições YAML e converte para formatos específicos das ferramentas de IA escolhidas.
3.  **Uso:** Os agentes ficam prontos nas ferramentas alvo para serem chamados diretamente.

## Estrutura do Projeto

- `src/`: Código da ferramenta de instalação.
- `definitions/`: YAML dos agentes prontos.
- `templates/`: Modelos de documentação.

## Licença

MIT

---

**Nota:** Uma versão em português deste README está disponível em [README.pt.md](README.pt.md).
