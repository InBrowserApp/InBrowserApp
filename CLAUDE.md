# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Code Configuration

This project has Claude Code skills and agents configured in `.claude/`:

```
.claude/
├── commands/              # Custom slash commands (invoked with /<name>)
│   ├── new-tool.md       # /new-tool - Create a new tool package
│   └── test.md           # /test - Run all checks before committing
└── agents/               # Specialized agents for Task tool
    ├── i18n-translator.md  # Translation expert for 25 languages
    └── test-runner.md      # Run all checks (independent context)
```

### Custom Slash Commands
- `/new-tool <name>` - Interactive wizard to create a new tool with all required files
- `/test` - Run lint, format, type-check, and build verification

### Agents
- `i18n-translator` - Automatically invoked for translation tasks. Handles all 25 languages for info.ts meta and Vue i18n blocks.
- `test-runner` - Same as `/test` but runs in independent context. Use this when Claude needs to run checks automatically after completing a task.

## Build & Development Commands

```bash
pnpm install          # Install dependencies (always run first)
pnpm dev              # Start dev server (localhost:5173)
pnpm build            # Production build
pnpm type-check       # TypeScript checking (~30-60s)
pnpm lint             # Auto-fix lint issues (oxlint + eslint)
pnpm lint-check       # Check lint without fixing
pnpm format           # Auto-format with Prettier
pnpm format-check     # Check format without fixing
pnpm test:unit        # Unit tests (vitest)
pnpm test:e2e         # E2E tests (requires: pnpm exec playwright install)
```

**Test file naming:** `*.dom.test.ts` - Place test files alongside the code they test.

**Workspace commands:**
```bash
pnpm -F <package-name> <command>           # Run in specific package
pnpm -F @registry/tools add --workspace @tools/<name>  # Add tool to registry
```

## Architecture Overview

Vue 3 + TypeScript monorepo using pnpm workspaces. All tools run entirely client-side in the browser.

```
apps/web/              # Main Vue 3 + Vite application
tools/                 # Tool packages with UI (organized by domain)
  ├── code/           # JSON, YAML, XML converters
  ├── document/       # Text diff, markdown tools
  ├── hash/           # Hash generators (SHA, MD5, bcrypt, etc.)
  ├── image/          # QR code, barcode, PNG optimizer
  ├── misc/           # Miscellaneous tools (lorem ipsum, etc.)
  ├── network/        # IP, CIDR, DNS tools
  ├── pdf/            # PDF processors
  ├── random/         # Random generators
  ├── time/           # Unix timestamp, date converters
  ├── uuid/           # UUID/ULID generators (nested sub-tools)
  └── web/            # URL, JWT, Base64, cipher tools
shared/                # Shared packages
  ├── icons/          # Re-exports from @vicons/* packages
  ├── locale/         # i18n languages configuration
  ├── tools/          # ToolInfo interface definitions
  └── ui/             # Reusable Vue components
utils/                 # Pure TypeScript utilities (no UI dependencies)
registry/              # Aggregates all tools and routes
```

### Path Aliases
- `@shared/*` → `shared/*` (e.g., `@shared/tools`, `@shared/ui`, `@shared/icons/fluent`)
- `@tools/<package>` → `tools/<package>/src` (main export)
- `@tools/<package>/routes` → `tools/<package>/src/routes.ts`
- `@utils/<package>` → `utils/<package>/src`
- `@registry/tools` → `registry/tools/src`

### Routing Flow
1. `apps/web/src/router/routes.ts` imports routes from `@registry/tools/routes`
2. `registry/tools/src/routes.ts` aggregates all tool routes
3. Each tool defines routes in `tools/.../src/routes.ts`
4. Routes automatically get language prefix aliases (e.g., `/en/tools/...`, `/zh/tools/...`)

## Creating a New Tool

### Directory Structure
```
tools/<domain>/<tool-slug>/
├── src/
│   ├── info.ts              # Tool metadata (toolID, path, tags, features, i18n meta)
│   ├── routes.ts            # Vue Router routes
│   ├── <ToolName>View.vue   # Main view (uses ToolDefaultPageLayout)
│   ├── components/          # Tool-specific components
│   └── index.ts             # Exports: export * as toolInfo from './info'
└── package.json
```

### info.ts Pattern
```typescript
export { SomeIcon as icon } from '@shared/icons/fluent'  // or carbon, tabler, etc.
export const toolID = 'tool-slug'
export const path = '/tools/tool-slug'  // Must match routes.ts
export const tags = ['category1', 'category2']
export const features = ['offline']  // Add if tool works without network
export const meta = {
  en: { name: 'Tool Name', description: 'Tool description' },
  zh: { name: '工具名称', description: '工具描述' },
  // ... all 25 languages required
}
```

### routes.ts Pattern
```typescript
import type { ToolRoute } from '@shared/tools'
export const routes: ToolRoute[] = [
  {
    name: 'tool-slug',
    path: '/tools/tool-slug',
    component: () => import('./ToolNameView.vue'),
  },
] as const
```

### View Component Pattern
```vue
<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolContent />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import ToolContent from './components/ToolContent.vue'
</script>
```

### package.json Pattern
```json
{
  "name": "@tools/tool-slug",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./routes": "./src/routes.ts"
  },
  "dependencies": {
    "@shared/icons": "workspace:*",
    "@shared/tools": "workspace:*",
    "@shared/ui": "workspace:*",
    "naive-ui": "catalog:",
    "vue": "catalog:",
    "vue-i18n": "catalog:"
  }
}
```

**Common optional dependencies:**
- `"@vueuse/core": "catalog:"` - For `useStorage` (persist user input), etc.

### Registration Steps
1. Create tool package with structure above
2. Run `pnpm -F @registry/tools add --workspace @tools/<tool-slug>`
3. Add import and export in `registry/tools/src/index.ts`
4. Add import and spread routes in `registry/tools/src/routes.ts`
5. Run `pnpm install`

## Shared UI Components

Import from `@shared/ui/*`:
- `@shared/ui/tool` → `ToolDefaultPageLayout`, `ToolSection`, `ToolSectionHeader`, `ToolTitle`, `ToolDescription`, `RelatedTools`
- `@shared/ui/base` → `CopyToClipboardButton`, `RegenerateButton`, `TextOrFileInput`
- `@shared/ui/layouts` → `NavLayout`, `NavBar`
- `@shared/ui/domain/*` → Domain-specific components (IP, UUID, PDF, MAC, DNS)

## Internationalization

**25 supported languages** (defined in `shared/locale/src/languages.ts`):
`en, zh, zh-CN, zh-TW, zh-HK, es, fr, de, it, ja, ko, ru, pt, ar, hi, tr, nl, sv, pl, vi, th, id, he, ms, no`

### In Vue Components
```vue
<i18n lang="json">
{
  "en": { "key": "English text" },
  "zh": { "key": "中文文本" }
}
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <span>{{ t('key') }}</span>
</template>
```

**Requirements:**
- JSON must be strictly valid (double quotes, no trailing commas)
- All 25 languages must be provided in `info.ts` meta
- Component `<i18n>` blocks require all 25 languages, but you can start with just `en` and use the `i18n-translator` agent to complete the rest
- Handle spacing between CJK and Latin characters

## Code Style

**Prettier config** (`.prettierrc.json`):
- `semi: false` (no semicolons)
- `singleQuote: true`
- `printWidth: 100`

**TypeScript:**
- Prefer Composition API with `<script setup lang="ts">`
- Explicit types for public APIs
- Use `catalog:` for shared dependencies in package.json

**Components:**
- Use Naive UI (`naive-ui`) for UI components
- Import icons from `@shared/icons/<library>` (fluent, carbon, tabler, etc.)
- Keep components small and focused; split into `components/` directory

## Nested Tool Groups

Some tools are grouped (e.g., UUID tools). Pattern:
```
tools/uuid/
├── src/
│   ├── index.ts          # Exports: tools: ToolInfo[] array
│   ├── routes.ts         # Aggregates all sub-tool routes
│   ├── uuid-v4-generator/
│   │   ├── infos.ts      # Note: sometimes 'infos.ts' instead of 'info.ts'
│   │   ├── routes.ts
│   │   ├── index.ts
│   │   └── *.vue
│   └── uuid-tools/       # Collection landing page
└── package.json
```

## Common Pitfalls

- **Tool not appearing:** Check both `registry/tools/src/index.ts` AND `registry/tools/src/routes.ts`
- **Path mismatch:** Ensure `path` in `info.ts` matches `path` in `routes.ts`
- **Missing i18n:** All 25 languages required in `info.ts` meta
- **Invalid i18n JSON:** Must be strict JSON (double quotes, no comments)
- **Wrong icon import:** Use `@shared/icons/<library>` not `@vicons/*` directly

## Git Workflow

The `main` branch is **protected**. If you're on `main`, create a new branch before committing:

```bash
git checkout -b feat/tool-name    # For new features
git checkout -b fix/bug-name      # For bug fixes
git checkout -b chore/task-name   # For maintenance
```

If already on a branch other than `main`, commit directly to that branch.

**Before committing, always run `/test` to ensure all checks pass.**

Branch naming: `<type>/<short-description>` (e.g., `feat/morse-code-tool`, `fix/i18n-typo`)

PR titles must also follow Conventional Commits format (e.g., `feat(tools): add Morse Code tool`).

**All commit messages and PR titles must be in English.**

## Commit Convention

Use Conventional Commits in English: `feat(tools): add xxx tool`

This repo uses **husky** + **commitlint** to enforce commit message format:
- `feat(scope):` - New feature
- `fix(scope):` - Bug fix
- `chore(scope):` - Maintenance tasks
- `test(scope):` - Adding tests
- `docs(scope):` - Documentation changes

Common scopes: `tools`, `ui`, `i18n`, `ci`, `deps`

## Related Documentation

- `AGENTS.md` - Concise guidelines for AI agents (GitHub Copilot, Codex, etc.)
- `.github/copilot-instructions.md` - Detailed instructions for GitHub Copilot
- `.github/workflows/ci.yml` - CI pipeline (lint, format, type-check, build, deploy)
