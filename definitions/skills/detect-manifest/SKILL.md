---
name: detect-manifest
description: Detects project manifests (package.json, go.mod, Cargo.toml, etc.) and extracts tech stack information. Use to automatically identify project technology.
---

# Skill: Detect Project Manifest

This skill automates project manifest detection to identify the tech stack being used.

## When to Use

- At the start of a project (Greenfield or Brownfield)
- Before generating `project.md` or `requirements.md`
- When needing to validate project structure

## Supported Manifests

| Manifest | Language/Framework | Extracted Information |
|----------|---------------------|----------------------|
| `package.json` | Node.js / JavaScript | name, version, dependencies, devDependencies, scripts |
| `go.mod` | Go | module name, go version, require |
| `Cargo.toml` | Rust | package name, version, dependencies |
| `pom.xml` | Java (Maven) | groupId, artifactId, version, dependencies |
| `build.gradle` | Java (Gradle) | plugins, dependencies |
| `requirements.txt` | Python (pip) | dependencies list |
| `pyproject.toml` | Python (Poetry/PDM) | project name, version, dependencies |
| `composer.json` | PHP | name, require, autoload |
| `*.csproj` | C# / .NET | TargetFramework, PackageReference |
| `Gemfile` | Ruby | gem dependencies |

## Execution Flow

### 1. Search for Manifests

```bash
# Check in project root
ls -la | grep -E "(package.json|go.mod|Cargo.toml|pom.xml|requirements.txt|pyproject.toml|composer.json|Gemfile)"
```

### 2. Extract Information

For each manifest found, extract:

- **Project name**
- **Current version**
- **Main dependencies**
- **Available scripts** (if applicable)

### 3. Generate Summary

```markdown
## Detected Manifest

- **Type:** [package.json / go.mod / etc.]
- **Project:** [name]
- **Version:** [X.Y.Z]
- **Language:** [JavaScript / Go / etc.]
- **Framework:** [Next.js / Express / Gin / etc.] (if detected)

### Main Dependencies
- [dep1] @ [version]
- [dep2] @ [version]
```

## Scenarios

### No Manifest Found

```markdown
⚠️ **Warning:** No project manifest found.

**Recommended Action:** Initialize the project with one of the commands:
- Node.js: `npm init -y`
- Go: `go mod init [module-name]`
- Python: `pip freeze > requirements.txt`
- Rust: `cargo init`
```

### Multiple Manifests Found

```markdown
📦 **Monorepo Project Detected:**

- `package.json` (root) — Main workspace
- `packages/api/package.json` — Backend
- `packages/web/package.json` — Frontend

**Action:** Confirm which manifest to use as main reference.
```

## Agent Integration

This skill is used by:

- **Project Architect 🏛️** — Mode 1.1 (Structure validation)
- **Requirements Engineer 📝** — Stack Definition Protocol
- **Coder 💻** — Environment verification before implementing
