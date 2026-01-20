# Copilot Instructions for InBrowser.app

## Repository Overview

InBrowser.app is a comprehensive Vue 3 + TypeScript monorepo containing 74+ workspace projects that provides browser-based utility tools. All tools run entirely client-side for privacy, processing data locally without server communication.

**Key Technologies:**
- Vue 3 with Composition API (`<script setup>`)
- TypeScript for type safety
- pnpm workspaces for monorepo management
- Vite for build tooling
- Naive UI component library
- Vue i18n for internationalization (25+ languages)
- PWA capabilities with Workbox

**Repository Size & Structure:**
- ~74 workspace packages across apps/, tools/, shared/, utils/, registry/
- Main application: `apps/web` (Vue 3 + Vite)
- Node.js >= 18.0.0, pnpm >= 8.0.0 required
- Uses pnpm catalog for centralized dependency management

## Build & Development Commands

**CRITICAL: Always run commands in sequence as specified. Commands must be run from repository root.**

### Bootstrap & Development
```bash
# Always start with this - installs all dependencies
pnpm install

# Start development server (runs main web app on localhost:5173)
pnpm dev
```

### Build & Validation Pipeline (run in this exact order)
```bash
# 1. Lint check (oxlint + eslint)
pnpm lint-check

# 2. Format check (Prettier)
pnpm format-check

# 3. TypeScript type checking (takes ~30-60 seconds)
pnpm type-check

# 4. Production build (takes ~30-45 seconds, will show expected warnings)
pnpm build
```

**Build Warnings (Expected & Safe to Ignore):**
- Large chunk warnings (>500kB) for svgo-node and index files
- Vue compilation warnings for QR code generator reactive assignments  
- PWA service worker generation messages

### Fix Commands (when validation fails)
```bash
# Auto-fix linting issues
pnpm lint

# Auto-format code
pnpm format
```

### Testing Setup (requires additional setup)
```bash
# Unit tests (currently no unit tests exist - vitest configured but no test files)
pnpm test:unit

# E2E tests (requires Playwright browser installation first)
pnpm exec playwright install  # Must run before e2e tests
pnpm test:e2e
```

**Important Notes:**
- Build shows expected warnings: large chunks (>500kB), Vue compilation issues, PWA generation
- Type checking takes significant time due to project size (~30-60 seconds)
- Tests require additional setup (Playwright browser installation for e2e)
- Clean generated test files if linting fails: `rm -rf apps/web/playwright-report apps/web/test-results`
- Always run `pnpm install` before any build commands

## Project Architecture

### Monorepo Structure
```
inbrowser.app/
├── apps/web/           # Main Vue 3 application (entry point)
├── tools/              # Tool implementations with UI (77+ tools)
│   ├── code/          # Code-related tools (formatters, converters)
│   ├── document/      # Document processors
│   ├── image/         # Image manipulation tools  
│   ├── network/       # Network utilities
│   └── text/          # Text processing tools
├── shared/            # Shared packages
│   ├── locale/        # i18n languages (@shared/locale)
│   ├── tools/         # Tool interfaces (@shared/tools)
│   └── ui/            # UI components (@shared/ui)
├── utils/             # Pure TypeScript utilities (no UI)
├── registry/          # Aggregates all tools and routes
└── [config files]
```

### Key Configuration Files
- `package.json` - Root package with all build scripts
- `pnpm-workspace.yaml` - Workspace configuration with catalog
- `eslint.config.ts` - ESLint configuration (Vue + TypeScript)
- `.prettierrc.json` - Prettier config (semi: false, singleQuote: true)
- `tsconfig.json` - TypeScript project references
- `apps/web/vite.config.ts` - Vite build configuration
- `apps/web/vitest.config.ts` - Vitest test configuration
- `apps/web/playwright.config.ts` - Playwright e2e test configuration

## Tool Development Patterns

First, read some tools as example.

### Creating New Tools (follow existing patterns exactly)
1. **Directory structure:** `tools/<domain>/<tool-slug>/src/`
2. **Required files:**
   - `info.ts` - Tool metadata with i18n
   - `routes.ts` - Vue Router routes
   - `<ToolName>View.vue` - Main component
   - `components/**` - To store components, you need organize the components well. Don't let a component code too long.
   - `index.ts` - Exports toolInfo
   - `package.json` - Dependencies

3. **Register in registry:**
```bash
# Add tool to registry workspace
# @tools/<tool-name> is defined in tool's package.json name
pnpm -F @registry/tools add --workspace @tools/<tool-name>
```

4. **Tool metadata pattern (info.ts):**
```typescript
export const toolInfo: ToolInfo = {
  toolID: 'unique-tool-id',
  path: '/tools/tool-slug',  // Must match routes.ts
  tags: ['category1', 'category2'],
  features: ['offline'],  // For client-side tools
  meta: {
    // All 25 supported languages required
    en: { name: 'Tool Name', description: '...' },
    zh: { name: '工具名称', description: '...' },
    // ... all other languages
  }
}
```

### Routing & Registration
- App routes composed in `apps/web/src/router/routes.ts`
- Tool routes defined in `tools/.../src/routes.ts`
- Registry aggregates all routes in `registry/tools/src/routes.ts`
- Path format: `/tools/<kebab-case-slug>` (stable for SEO)

## Internationalization

**Critical: All tools must support all 25 languages defined in `shared/locale/src/languages.ts`**

Languages: `en, zh, zh-CN, zh-TW, zh-HK, es, fr, de, it, ja, ko, ru, pt, ar, hi, tr, nl, sv, pl, vi, th, id, he, ms, no`

### Vue i18n Pattern (in .vue files)
```vue
<i18n lang="json">
{
  "en": {
    "title": "Tool Title",
    "description": "Tool description"
  },
  "zh": {
    "title": "工具标题", 
    "description": "工具描述"
  }
}
</i18n>

<template>
  <h1>{{ $t('title') }}</h1>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
```

**Requirements:**
- JSON must be strictly valid (double quotes, no comments)
- All supported languages must be included
- Handle spacing between CJK and Latin characters

## CI/CD & Validation

### GitHub Actions Workflow (`.github/workflows/ci.yml`)
Runs on PR/push to main:
1. ESLint check (`pnpm lint-check`)
2. Format check (`pnpm format-check`) 
3. TypeScript check (`pnpm type-check`)
4. Build (`pnpm build`)
5. Deploy to GitHub Pages (main branch only)

### Environment Requirements
- Node.js LTS (configured in CI)
- pnpm package manager
- Environment variable: `NODE_OPTIONS: --max-old-space-size=12288` (for CI builds)

## Common Pitfalls & Solutions

### Build Issues
- **Large chunk warnings**: Expected due to comprehensive tool set (>500kB chunks normal)
- **Vue compilation warnings**: Expected for QR code generator reactive assignment patterns  
- **TypeScript errors**: Run `pnpm type-check` to identify issues
- **Memory issues**: Set `NODE_OPTIONS=--max-old-space-size=12288`
- **Lint failures**: May be caused by generated test files - clean with `rm -rf apps/web/playwright-report apps/web/test-results`

### Tool Registration Issues
- **Tool not appearing**: Check `registry/tools/src/index.ts` inclusion
- **Route conflicts**: Ensure path matches between `info.ts` and `routes.ts`
- **Missing translations**: All 25 languages must be provided

### Development Issues
- **Import errors**: Use path aliases (@shared/*, @tools/*)
- **Dependency cycles**: Check workspace dependencies (shows WARN during install)
- **Test failures**: E2E tests require `pnpm exec playwright install`

## Package Management

### Workspace Commands
```bash
# Run command in specific package
pnpm -F <package-name> <command>

# Run across all packages  
pnpm -r <command>

# Add dependency to specific package
pnpm -F <package-name> add <dependency>
```

### Path Aliases
- `@shared/*` → `shared/*` packages
- `@tools/<package>` → `tools/<package>/src/index.ts`
- `@tools/<package>/route` → `tools/<package>/src/route.ts`
- Registry aggregates all tool routes and info

## Validation Steps

Before submitting changes:
1. `pnpm install` - Install dependencies
2. `pnpm lint-check` - Check code style
3. `pnpm format-check` - Check formatting
4. `pnpm type-check` - Verify TypeScript
5. `pnpm build` - Ensure production build works
6. Test tool functionality manually if adding/modifying tools

## Git Message

Use Conventional Commits. New tool message example:  `feat(tools): add xxx tool`

**Trust these instructions** - they are comprehensive and tested. Only search for additional information if these instructions are incomplete or incorrect for your specific use case.
