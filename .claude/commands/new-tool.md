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
- `"@vueuse/core": "catalog:"` - For useStorage, useClipboard, etc.
- Other npm packages as needed

### info.ts Template
```typescript
export { IconName } from '@shared/icons/fluent'  // or carbon, tabler

export const toolID = '<tool-slug>'
export const path = '/tools/<tool-slug>'
export const tags = ['tag1', 'tag2']
export const features = ['offline']  // Add 'offline' if tool works without network

export const meta = {
  en: { name: 'Tool Name', description: 'Tool description' },
  zh: { name: '工具名称', description: '工具描述' },
  'zh-CN': { name: '工具名称', description: '工具描述' },
  'zh-TW': { name: '工具名稱', description: '工具描述' },
  'zh-HK': { name: '工具名稱', description: '工具描述' },
  es: { name: '', description: '' },
  fr: { name: '', description: '' },
  de: { name: '', description: '' },
  it: { name: '', description: '' },
  ja: { name: '', description: '' },
  ko: { name: '', description: '' },
  ru: { name: '', description: '' },
  pt: { name: '', description: '' },
  ar: { name: '', description: '' },
  hi: { name: '', description: '' },
  tr: { name: '', description: '' },
  nl: { name: '', description: '' },
  sv: { name: '', description: '' },
  pl: { name: '', description: '' },
  vi: { name: '', description: '' },
  th: { name: '', description: '' },
  id: { name: '', description: '' },
  he: { name: '', description: '' },
  ms: { name: '', description: '' },
  no: { name: '', description: '' },
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
- i18n block with ALL 25 languages (same list as info.ts)
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
  "en": { "label": "Label" },
  "zh": { "label": "标签" },
  ... // ALL 25 languages
}
</i18n>
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

Run all checks and fix any issues:
1. `pnpm lint` - Fix lint errors
2. `pnpm format` - Format code
3. `pnpm type-check` - Verify TypeScript
4. `pnpm build` - Verify production build

All checks must pass before the tool is complete.

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
