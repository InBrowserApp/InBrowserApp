# Create New Tool

Create a new tool package for InBrowserApp following the established patterns.

## Input Required

Tool name: $ARGUMENTS

If no tool name provided, ask the user for:
1. Tool slug (kebab-case, e.g., "json-formatter")
2. Domain directory (code, hash, image, network, pdf, uuid, web, document, time, misc, random)
3. Brief description of what the tool does

## Planning Phase

Before creating files, discuss with the user:
1. What inputs/outputs the tool needs
2. UI layout preferences (single column, grid, etc.)
3. Any special dependencies needed
4. Whether it needs persistence (useStorage from @vueuse/core)

## Directory Structure

```
tools/<domain>/<tool-slug>/
├── src/
│   ├── info.ts              # Tool metadata with 25-language i18n
│   ├── routes.ts            # Vue Router route definition
│   ├── <ToolName>View.vue   # Main view wrapper
│   ├── components/
│   │   └── <ToolName>.vue   # Main component
│   ├── utils.ts             # (Optional) Pure logic, no Vue dependencies
│   └── index.ts             # Exports toolInfo
└── package.json
```

## Required Files Content

### package.json
```json
{
  "name": "@tools/<tool-slug>",
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

Common optional dependencies to add when needed:
- `"@vueuse/core": "catalog:"` - For useStorage (persist user input), etc.
- Other npm packages as needed

### info.ts Template
```typescript
export { IconName as icon } from '@shared/icons/fluent'  // or carbon, tabler

export const toolID = '<tool-slug>'
export const path = '/tools/<tool-slug>'
export const tags = ['tag1', 'tag2']
export const features = ['offline']  // Add 'offline' if tool works without network

// Start with 'en' only, then use i18n-translator agent to complete all 25 languages
export const meta = {
  en: { name: 'Tool Name', description: 'Tool description' },
}
```

### routes.ts
```typescript
import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: '<tool-slug>',
    path: '/tools/<tool-slug>',
    component: () => import('./<ToolName>View.vue'),
  },
] as const
```

### index.ts
```typescript
export * as toolInfo from './info'
```

### <ToolName>View.vue
```vue
<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolName />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import ToolName from './components/<ToolName>.vue'
</script>
```

### components/<ToolName>.vue
Create main component with:
- Naive UI components (NInput, NButton, NGrid, NGi, NFlex, etc.)
- i18n block: start with `en` only, then use `i18n-translator` agent to complete all 25 languages
- Use ToolSection from @shared/ui/tool for layout sections
- Use CopyToClipboardButton from @shared/ui/base for copy functionality
- Use useStorage from @vueuse/core for persisting user input

Common component patterns:
```vue
<template>
  <n-grid cols="1 s:2" :x-gap="24" :y-gap="24" responsive="screen">
    <n-gi>
      <ToolSection>
        <!-- Input section -->
      </ToolSection>
    </n-gi>
    <n-gi>
      <ToolSection>
        <!-- Output section -->
      </ToolSection>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NGrid, NGi, NInput, NFlex } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

const { t } = useI18n()

// Use useStorage for persistence
const input = useStorage('tools:<tool-slug>:input', '')
</script>

<i18n lang="json">
{
  "en": { "label": "Label" }
}
</i18n>
<!-- Use i18n-translator agent to complete all 25 languages -->
```

## Registration Steps

After creating files:
1. Run: `pnpm -F @registry/tools add --workspace @tools/<tool-slug>`
2. Add to `registry/tools/src/index.ts`:
   ```typescript
   import * as <toolSlugCamelCase> from '@tools/<tool-slug>'
   // Add to tools array in alphabetical order
   ```
3. Add to `registry/tools/src/routes.ts`:
   ```typescript
   import { routes as <toolSlugCamelCase>Routes } from '@tools/<tool-slug>/routes'
   // Spread into routes array
   ```
4. Run: `pnpm install`

## Verification Steps (Required)

Run `/test` to execute all checks, or run manually:
1. `pnpm lint` - Fix lint errors
2. `pnpm format` - Format code
3. `pnpm type-check` - Verify TypeScript
4. `pnpm build` - Verify production build

All checks must pass before the tool is complete.

## Git Workflow

The `main` branch is **protected**. If on `main`, create a new branch:
```bash
git checkout -b feat/<tool-slug>
```

If already on a branch other than `main`, commit directly to that branch.

**Before committing, always run `/test` to ensure all checks pass.**

Commit message format (English only): `feat(tools): add <tool-name> tool`

## Code Style
- No semicolons (semi: false)
- Single quotes
- 100 char print width
- Vue Composition API with `<script setup lang="ts">`
- Monospace font for code/data inputs: add class and style `:deep(input) { font-family: monospace }`

## Reference Examples
Look at these existing tools for patterns:
- `tools/web/number-base-converter/` - Multiple bidirectional inputs, BigInt, custom base
- `tools/web/base64-encoder-decoder/` - Encoder/decoder pattern
- `tools/web/url-component-encoder-decoder/` - Text transformation tool
- `tools/web/case-converter/` - Multiple output formats from single input
- `tools/web/color-converter/` - Complex multi-format converter
- `tools/uuid/uuid-v4-generator/` - Simple generator tool
- `tools/time/unix-timestamp-converter/` - Time/date handling
- `tools/document/text-diff/` - Monaco Editor integration

## Icon Selection
Browse icons at:
- Fluent UI Icons (preferred): `@shared/icons/fluent`
- Carbon Icons: `@shared/icons/carbon`
- Tabler Icons: `@shared/icons/tabler`

Common icons:
- `TextNumberFormat20Regular` - Number/text tools
- `Code20Regular` - Code tools
- `Key20Regular` - Encryption/auth tools
- `Document20Regular` - Document tools
- `Timer20Regular` - Time tools
