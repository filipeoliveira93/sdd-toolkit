---
title: Requirements and Architecture Specification
scope: General
last_updated: 2025-12-30
---

# Requirements and Stack Catalog

## 1. Tech Stack and Standards (Tech Constraints)
**This section dictates mandatory tools for development.**
- **Runtime Environment:** Node.js (>= 18.0.0)
- **Language:** JavaScript (CommonJS/ES Modules compatibility)
- **CLI Interface:** `@clack/prompts` (for interactive wizard)
- **Output Styling:** `picocolors` (for terminal coloring)
- **Data Parsing:** `js-yaml` (for reading agent definitions)
- **Validation:** `zod` (for schema validation of agent definitions)
- **File System:** Node.js native `fs` and `path` modules
- **Distribution:** npm (publishable package)

## 2. Functional Requirements (FR)

### [FR-01] Installation Wizard (CLI)
**Description:** Interactive command-line interface to guide the user through the setup process.
- **Mandatory Lib:** `@clack/prompts`
- **Acceptance Criteria:**
  - *GIVEN* the user runs `npx sdd-toolkit`
  - *THEN* they should be greeted with a welcome message
  - *AND* prompted to select their target AI Assistant (Gemini, Roo Code, etc.)
  - *AND* prompted to select their Operating System (Windows/Unix).
- **Business Rules:**
  - [BR-01] The wizard must handle cancellation (`Ctrl+C`) gracefully.

### [FR-02] Agent Definitions Loader
**Description:** System to read and validate agnostic agent definitions from YAML files.
- **Mandatory Lib:** `js-yaml`, `zod`
- **Acceptance Criteria:**
  - *GIVEN* the CLI starts
  - *THEN* it must read all `.yaml` files from the internal `definitions/` directory.
  - *AND* validate each definition against the `AgentSchema` using `zod`.
- **Business Rules:**
  - [BR-02] If a definition file is invalid, the process should not crash but log a warning and skip the file (or error out if critical).

### [FR-03] Configuration Transformer
**Description:** Logic to convert internal AgentDefinition objects into tool-specific configuration formats.
- **Acceptance Criteria:**
  - *GIVEN* a valid AgentDefinition (e.g., "Auditor")
  - *AND* a selected target "Gemini CLI"
  - *THEN* the system must generate a valid `.toml` string matching Gemini's command structure.
  - *AND* replace placeholders like `{{SHELL_CMD}}` based on the user's OS selection.

### [FR-04] Docs Scaffolding
**Description:** Automatic creation of the documentation folder structure.
- **Acceptance Criteria:**
  - *GIVEN* the setup process completes
  - *THEN* a `docs/` folder must exist in the current working directory.
  - *AND* a `docs/logs/` folder must exist inside it.
  - *AND* a `docs/README.md` should be created explaining the folder's purpose.

### [FR-05] File Generation
**Description:** Writing the generated configuration files to the correct locations on the disk.
- **Acceptance Criteria:**
  - *GIVEN* the transformer has generated content
  - *THEN* files must be written to the paths defined in `TargetProfile`.
  - *AND* directories (like `.gemini/commands/dev/` or `.roo/`) must be created recursively if they don't exist.

## 3. Non-Functional Requirements (NFR)
- **[NFR-01] Performance:** CLI startup time must be under 1 second.
- **[NFR-02] Dependencies:** Keep runtime dependencies minimal (`dependencies` section) to ensure fast `npx` downloads.
- **[NFR-03] Compatibility:** Generated configuration files must be syntactically correct for the target tools (valid TOML for Gemini, valid JSON for Roo).
- **[NFR-04] Resilience:** File operations should handle permission errors or read-only file system states gracefully.

## 4. Data Model (Schema Draft)

### AgentDefinition Schema (Zod)
```javascript
z.object({
  name: z.string(), // e.g. "dev.coder"
  role: z.string(), // e.g. "Senior Developer"
  description: z.string(),
  instructions: z.string(), // The system prompt
  triggers: z.array(z.string()), // e.g. ["/dev.coder"]
  // Optional metadata
  version: z.string().optional()
})
```

### Profile Configuration
```javascript
{
  key: "gemini",
  name: "Gemini CLI",
  configDir: ".gemini/commands/dev",
  fileExtension: ".toml",
  transformer: "geminiTransformer" // Function reference
}
```
