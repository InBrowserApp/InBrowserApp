<template>
  <ToolSection>
    <n-flex align="center" justify="space-between" wrap>
      <n-flex align="center" wrap>
        <n-button @click="importFromFile" text>
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>
      </n-flex>

      <n-flex align="center" wrap>
        <CopyToClipboardButton :content="formattedCode" />
        <n-button
          tag="a"
          text
          :href="downloadUrl ?? undefined"
          :download="downloadFilename"
          :disabled="!downloadUrl"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-formatted') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('language')" :show-feedback="false">
        <n-select v-model:value="language" :options="languageOptions" size="small" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('print-width')" :show-feedback="false">
        <n-input-number
          v-model:value="printWidth"
          :min="40"
          :max="200"
          size="small"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('tab-width')" :show-feedback="false">
        <n-input-number
          v-model:value="tabWidth"
          :min="1"
          :max="8"
          size="small"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('use-tabs')" :show-feedback="false">
        <n-switch v-model:value="useTabs" />
      </n-form-item-gi>
      <n-form-item-gi v-if="supportsSemi" :label="t('semi')" :show-feedback="false">
        <n-switch v-model:value="semi" />
      </n-form-item-gi>
      <n-form-item-gi v-if="supportsSingleQuote" :label="t('single-quote')" :show-feedback="false">
        <n-switch v-model:value="singleQuote" />
      </n-form-item-gi>
      <n-form-item-gi
        v-if="supportsTrailingComma"
        :label="t('trailing-comma')"
        :show-feedback="false"
      >
        <n-select v-model:value="trailingComma" :options="trailingCommaOptions" size="small" />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>

  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('input-code')" :show-feedback="false">
        <n-input
          class="code-input"
          v-model:value="sourceCode"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 24 }"
          :placeholder="t('input-placeholder')"
          :status="formatError ? 'error' : undefined"
        />
        <template v-if="formatError" #feedback>
          <n-text type="error">{{ formatError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :label="t('formatted-code')" :show-feedback="false">
        <n-card size="small">
          <n-code
            :code="formattedCode"
            :language="highlightLanguage"
            :hljs="hljs"
            word-wrap
          ></n-code>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounce, useObjectUrl } from '@vueuse/core'
import { ToolSection } from '@shared/ui/tool'
import {
  NButton,
  NIcon,
  NCard,
  NCode,
  NFormItemGi,
  NGrid,
  NInput,
  NFlex,
  NText,
  NInputNumber,
  NSelect,
  NSwitch,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import { fileOpen } from 'browser-fs-access'
import { format } from 'prettier/standalone'
import type { Plugin } from 'prettier'
import parserAngular from 'prettier/plugins/angular'
import parserBabel from 'prettier/plugins/babel'
import parserEstree from 'prettier/plugins/estree'
import parserFlow from 'prettier/plugins/flow'
import parserGlimmer from 'prettier/plugins/glimmer'
import parserGraphql from 'prettier/plugins/graphql'
import parserTypescript from 'prettier/plugins/typescript'
import parserHtml from 'prettier/plugins/html'
import parserPostcss from 'prettier/plugins/postcss'
import parserMarkdown from 'prettier/plugins/markdown'
import parserYaml from 'prettier/plugins/yaml'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import less from 'highlight.js/lib/languages/less'
import graphql from 'highlight.js/lib/languages/graphql'
import handlebars from 'highlight.js/lib/languages/handlebars'
import markdown from 'highlight.js/lib/languages/markdown'
import yaml from 'highlight.js/lib/languages/yaml'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('less', less)
hljs.registerLanguage('graphql', graphql)
hljs.registerLanguage('handlebars', handlebars)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('yaml', yaml)

const { t } = useI18n()

const languageKeys = [
  'javascript',
  'typescript',
  'flow',
  'json',
  'json5',
  'jsonc',
  'html',
  'angular',
  'vue',
  'lwc',
  'handlebars',
  'css',
  'scss',
  'less',
  'markdown',
  'mdx',
  'yaml',
  'graphql',
] as const

type LanguageKey = (typeof languageKeys)[number]

type LanguageConfig = {
  parser: string
  plugins: Plugin[]
  highlight: string
  extensions: string[]
  sample: string
  supportsSemi?: boolean
  supportsSingleQuote?: boolean
  supportsTrailingComma?: boolean
}

const languageConfigs: Record<LanguageKey, LanguageConfig> = {
  javascript: {
    parser: 'babel',
    plugins: [parserBabel, parserEstree],
    highlight: 'javascript',
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
    sample: `const greeting = (name) => {\n  return { message: 'Hello ' + name, items: [1, 2, 3] }\n}\n`,
  },
  typescript: {
    parser: 'typescript',
    plugins: [parserTypescript, parserEstree],
    highlight: 'typescript',
    extensions: ['.ts', '.tsx'],
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
    sample: `type User = { id: number; name: string }\n\nconst users: User[] = [{ id: 1, name: 'Ada' }]\n`,
  },
  flow: {
    parser: 'flow',
    plugins: [parserFlow, parserEstree],
    highlight: 'javascript',
    extensions: ['.js', '.jsx'],
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
    sample: `/* @flow */\ntype User = { id: number, name: string }\n\nconst user: User = { id: 1, name: 'Ada' }\n`,
  },
  json: {
    parser: 'json',
    plugins: [parserBabel, parserEstree],
    highlight: 'json',
    extensions: ['.json'],
    sample: `{
  "name": "Example",
  "items": [1, 2, 3],
  "active": true
}\n`,
  },
  json5: {
    parser: 'json5',
    plugins: [parserBabel, parserEstree],
    highlight: 'json',
    extensions: ['.json5'],
    sample: `{
  // JSON5 supports comments
  unquoted: 'value',
  trailing: true,
}\n`,
  },
  jsonc: {
    parser: 'jsonc',
    plugins: [parserBabel, parserEstree],
    highlight: 'json',
    extensions: ['.jsonc'],
    sample: `{
  // JSON with comments
  "name": "Example",
  "enabled": true
}\n`,
  },
  html: {
    parser: 'html',
    plugins: [parserHtml],
    highlight: 'xml',
    extensions: ['.html', '.htm'],
    supportsSingleQuote: true,
    sample: `<div class="card"><h1>Hello</h1><p>Prettier formatting</p></div>\n`,
  },
  angular: {
    parser: 'angular',
    plugins: [parserAngular],
    highlight: 'xml',
    extensions: ['.html', '.htm'],
    supportsSingleQuote: true,
    sample: `<div *ngIf="isReady">{{ title }}</div>\n`,
  },
  vue: {
    parser: 'vue',
    plugins: [parserHtml],
    highlight: 'xml',
    extensions: ['.vue'],
    supportsSingleQuote: true,
    sample: `<template>\n  <div class="card">{{ message }}</div>\n</template>\n\n<script setup lang="ts">\nconst message = 'Hello'\n<\\/script>\n`,
  },
  lwc: {
    parser: 'lwc',
    plugins: [parserHtml],
    highlight: 'xml',
    extensions: ['.html', '.htm'],
    supportsSingleQuote: true,
    sample: `<template>\n  <lightning-button label="Hello" onclick={handleClick}></lightning-button>\n</template>\n`,
  },
  handlebars: {
    parser: 'glimmer',
    plugins: [parserGlimmer],
    highlight: 'handlebars',
    extensions: ['.hbs', '.handlebars', '.mustache'],
    supportsSingleQuote: true,
    sample: `{{#if isReady}}\n  <span>{{title}}</span>\n{{/if}}\n`,
  },
  css: {
    parser: 'css',
    plugins: [parserPostcss],
    highlight: 'css',
    extensions: ['.css'],
    supportsSingleQuote: true,
    sample: `.card {\n  display: flex;\n  gap: 12px;\n}\n`,
  },
  scss: {
    parser: 'scss',
    plugins: [parserPostcss],
    highlight: 'scss',
    extensions: ['.scss'],
    supportsSingleQuote: true,
    sample: `$primary: #2b4b6f;\n\n.card {\n  color: $primary;\n  &:hover {\n    opacity: 0.9;\n  }\n}\n`,
  },
  less: {
    parser: 'less',
    plugins: [parserPostcss],
    highlight: 'less',
    extensions: ['.less'],
    supportsSingleQuote: true,
    sample: `@primary: #2b4b6f;\n\n.card {\n  color: @primary;\n  &:hover {\n    opacity: 0.9;\n  }\n}\n`,
  },
  markdown: {
    parser: 'markdown',
    plugins: [parserMarkdown],
    highlight: 'markdown',
    extensions: ['.md', '.markdown'],
    sample: `# Prettier Formatter\n\n- Paste your code\n- Adjust options\n`,
  },
  mdx: {
    parser: 'mdx',
    plugins: [parserMarkdown],
    highlight: 'markdown',
    extensions: ['.mdx'],
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
    sample: `# MDX Example\n\n<Alert>Hi</Alert>\n\nexport const answer = 42\n`,
  },
  yaml: {
    parser: 'yaml',
    plugins: [parserYaml],
    highlight: 'yaml',
    extensions: ['.yaml', '.yml'],
    sample: `name: Example\nitems:\n  - one\n  - two\n`,
  },
  graphql: {
    parser: 'graphql',
    plugins: [parserGraphql],
    highlight: 'graphql',
    extensions: ['.graphql', '.gql'],
    sample: `query User($id: ID!) {\n  user(id: $id) {\n    id\n    name\n  }\n}\n`,
  },
}

const language = ref<LanguageKey>('javascript')
const sourceCode = ref<string>(languageConfigs[language.value].sample)
const formattedCode = ref<string>('')
const formatError = ref<string>('')

const printWidth = ref<number>(80)
const tabWidth = ref<number>(2)
const useTabs = ref<boolean>(false)
const semi = ref<boolean>(true)
const singleQuote = ref<boolean>(false)
const trailingComma = ref<'none' | 'es5' | 'all'>('es5')

const debouncedSource = useDebounce(sourceCode, 300)

const activeLanguageConfig = computed(() => languageConfigs[language.value])
const highlightLanguage = computed(() => activeLanguageConfig.value.highlight)
const downloadFilename = computed(() => {
  const extension = activeLanguageConfig.value.extensions[0] ?? '.txt'
  return `formatted${extension}`
})
const downloadBlob = computed(() => {
  if (!formattedCode.value.trim()) return null
  return new Blob([formattedCode.value], { type: 'text/plain;charset=utf-8' })
})
const downloadUrl = useObjectUrl(downloadBlob)

const languageOptions = computed(() =>
  languageKeys.map((key) => ({
    // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
    label: t(`lang-${key}`),
    value: key,
  })),
)

const supportsTrailingComma = computed(
  () => activeLanguageConfig.value.supportsTrailingComma === true,
)
const supportsSemi = computed(() => activeLanguageConfig.value.supportsSemi === true)
const supportsSingleQuote = computed(() => activeLanguageConfig.value.supportsSingleQuote === true)

const trailingCommaOptions = computed(() => [
  { label: t('trailing-none'), value: 'none' },
  { label: t('trailing-es5'), value: 'es5' },
  { label: t('trailing-all'), value: 'all' },
])

const fileExtensions = Array.from(
  new Set(Object.values(languageConfigs).flatMap((config) => config.extensions)),
)

const extensionToLanguage: Record<string, LanguageKey> = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json5: 'json5',
  json: 'json',
  jsonc: 'jsonc',
  html: 'html',
  htm: 'html',
  vue: 'vue',
  css: 'css',
  scss: 'scss',
  less: 'less',
  md: 'markdown',
  markdown: 'markdown',
  mdx: 'mdx',
  yaml: 'yaml',
  yml: 'yaml',
  graphql: 'graphql',
  gql: 'graphql',
  hbs: 'handlebars',
  handlebars: 'handlebars',
  mustache: 'handlebars',
}

let formatToken = 0

watch(language, (next, previous) => {
  const previousSample = languageConfigs[previous].sample
  if (!sourceCode.value.trim() || sourceCode.value === previousSample) {
    sourceCode.value = languageConfigs[next].sample
  }
})

watch(
  () => [
    debouncedSource.value,
    language.value,
    printWidth.value,
    tabWidth.value,
    useTabs.value,
    semi.value,
    singleQuote.value,
    trailingComma.value,
  ],
  () => {
    void formatCode(debouncedSource.value)
  },
  { immediate: true },
)

async function formatCode(value: string): Promise<void> {
  const token = ++formatToken
  if (!value.trim()) {
    formattedCode.value = ''
    formatError.value = ''
    return
  }

  const config = activeLanguageConfig.value

  try {
    const result = await format(value, {
      parser: config.parser,
      plugins: config.plugins,
      printWidth: printWidth.value,
      tabWidth: tabWidth.value,
      useTabs: useTabs.value,
      semi: supportsSemi.value ? semi.value : true,
      singleQuote: supportsSingleQuote.value ? singleQuote.value : false,
      trailingComma: supportsTrailingComma.value ? trailingComma.value : 'none',
    })

    if (token !== formatToken) {
      return
    }

    formattedCode.value = result
    formatError.value = ''
  } catch (error) {
    if (token !== formatToken) {
      return
    }

    const errorMessage = error instanceof Error ? error.message : t('format-error')
    formattedCode.value = ''
    formatError.value = errorMessage
  }
}

function detectLanguage(filename: string): LanguageKey | null {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/)
  const extension = match?.[1]
  if (!extension) {
    return null
  }
  return extensionToLanguage[extension] ?? null
}

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({ extensions: fileExtensions })
    sourceCode.value = await file.text()
    const detected = detectLanguage(file.name)
    if (detected) {
      language.value = detected
    }
  } catch {
    // User cancelled file selection - this is normal
  }
}
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "import-from-file": "Import from file",
    "format-now": "Format",
    "download-formatted": "Download formatted",
    "language": "Language",
    "input-code": "Input code",
    "formatted-code": "Formatted code",
    "input-placeholder": "Paste your code here...",
    "print-width": "Print width",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "semi": "Semicolons",
    "single-quote": "Single quotes",
    "trailing-comma": "Trailing commas",
    "trailing-none": "None",
    "trailing-es5": "ES5",
    "trailing-all": "All",
    "format-error": "Formatting failed",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "zh": {
    "import-from-file": "从文件导入",
    "format-now": "格式化",
    "download-formatted": "下载格式化结果",
    "language": "语言",
    "input-code": "输入代码",
    "formatted-code": "格式化代码",
    "input-placeholder": "在此粘贴你的代码...",
    "print-width": "行宽",
    "tab-width": "Tab 宽度",
    "use-tabs": "使用 Tab",
    "semi": "分号",
    "single-quote": "单引号",
    "trailing-comma": "尾随逗号",
    "trailing-none": "无",
    "trailing-es5": "ES5",
    "trailing-all": "全部",
    "format-error": "格式化失败",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "zh-CN": {
    "import-from-file": "从文件导入",
    "format-now": "格式化",
    "download-formatted": "下载格式化结果",
    "language": "语言",
    "input-code": "输入代码",
    "formatted-code": "格式化代码",
    "input-placeholder": "在此粘贴你的代码...",
    "print-width": "行宽",
    "tab-width": "Tab 宽度",
    "use-tabs": "使用 Tab",
    "semi": "分号",
    "single-quote": "单引号",
    "trailing-comma": "尾随逗号",
    "trailing-none": "无",
    "trailing-es5": "ES5",
    "trailing-all": "全部",
    "format-error": "格式化失败",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "zh-TW": {
    "import-from-file": "從檔案匯入",
    "format-now": "格式化",
    "download-formatted": "下載格式化結果",
    "language": "語言",
    "input-code": "輸入程式碼",
    "formatted-code": "格式化程式碼",
    "input-placeholder": "在此貼上你的程式碼...",
    "print-width": "行寬",
    "tab-width": "Tab 寬度",
    "use-tabs": "使用 Tab",
    "semi": "分號",
    "single-quote": "單引號",
    "trailing-comma": "尾隨逗號",
    "trailing-none": "無",
    "trailing-es5": "ES5",
    "trailing-all": "全部",
    "format-error": "格式化失敗",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "zh-HK": {
    "import-from-file": "從檔案匯入",
    "format-now": "格式化",
    "download-formatted": "下載格式化結果",
    "language": "語言",
    "input-code": "輸入程式碼",
    "formatted-code": "格式化程式碼",
    "input-placeholder": "在此貼上你的程式碼...",
    "print-width": "行寬",
    "tab-width": "Tab 寬度",
    "use-tabs": "使用 Tab",
    "semi": "分號",
    "single-quote": "單引號",
    "trailing-comma": "尾隨逗號",
    "trailing-none": "無",
    "trailing-es5": "ES5",
    "trailing-all": "全部",
    "format-error": "格式化失敗",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "es": {
    "import-from-file": "Importar desde archivo",
    "format-now": "Formatear",
    "download-formatted": "Descargar formateado",
    "language": "Idioma",
    "input-code": "Código de entrada",
    "formatted-code": "Código formateado",
    "input-placeholder": "Pega tu código aquí...",
    "print-width": "Ancho de línea",
    "tab-width": "Ancho de tabulación",
    "use-tabs": "Usar tabulaciones",
    "semi": "Puntos y coma",
    "single-quote": "Comillas simples",
    "trailing-comma": "Comas finales",
    "trailing-none": "Ninguno",
    "trailing-es5": "ES5",
    "trailing-all": "Todo",
    "format-error": "Error al formatear",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "fr": {
    "import-from-file": "Importer depuis un fichier",
    "format-now": "Formater",
    "download-formatted": "Télécharger le formaté",
    "language": "Langue",
    "input-code": "Code d'entrée",
    "formatted-code": "Code formaté",
    "input-placeholder": "Collez votre code ici...",
    "print-width": "Largeur de ligne",
    "tab-width": "Largeur des tabulations",
    "use-tabs": "Utiliser des tabulations",
    "semi": "Points-virgules",
    "single-quote": "Guillemets simples",
    "trailing-comma": "Virgules finales",
    "trailing-none": "Aucune",
    "trailing-es5": "ES5",
    "trailing-all": "Tout",
    "format-error": "Échec du formatage",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "de": {
    "import-from-file": "Aus Datei importieren",
    "format-now": "Formatieren",
    "download-formatted": "Formatiertes herunterladen",
    "language": "Sprache",
    "input-code": "Eingabecode",
    "formatted-code": "Formatierter Code",
    "input-placeholder": "Code hier einfügen...",
    "print-width": "Zeilenbreite",
    "tab-width": "Tabulatorbreite",
    "use-tabs": "Tabs verwenden",
    "semi": "Semikolons",
    "single-quote": "Einfache Anführungszeichen",
    "trailing-comma": "Nachgestellte Kommas",
    "trailing-none": "Keine",
    "trailing-es5": "ES5",
    "trailing-all": "Alle",
    "format-error": "Formatierung fehlgeschlagen",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "it": {
    "import-from-file": "Importa da file",
    "format-now": "Formatta",
    "download-formatted": "Scarica formattato",
    "language": "Lingua",
    "input-code": "Codice di input",
    "formatted-code": "Codice formattato",
    "input-placeholder": "Incolla il tuo codice qui...",
    "print-width": "Larghezza riga",
    "tab-width": "Larghezza tab",
    "use-tabs": "Usa tab",
    "semi": "Punto e virgola",
    "single-quote": "Virgolette singole",
    "trailing-comma": "Virgole finali",
    "trailing-none": "Nessuna",
    "trailing-es5": "ES5",
    "trailing-all": "Tutte",
    "format-error": "Formattazione non riuscita",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "ja": {
    "import-from-file": "ファイルから読み込み",
    "format-now": "整形",
    "download-formatted": "整形結果をダウンロード",
    "language": "言語",
    "input-code": "入力コード",
    "formatted-code": "整形コード",
    "input-placeholder": "ここにコードを貼り付け...",
    "print-width": "行幅",
    "tab-width": "タブ幅",
    "use-tabs": "タブを使用",
    "semi": "セミコロン",
    "single-quote": "シングルクォート",
    "trailing-comma": "末尾カンマ",
    "trailing-none": "なし",
    "trailing-es5": "ES5",
    "trailing-all": "すべて",
    "format-error": "整形に失敗しました",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "ko": {
    "import-from-file": "파일에서 가져오기",
    "format-now": "형식화",
    "download-formatted": "형식화 다운로드",
    "language": "언어",
    "input-code": "입력 코드",
    "formatted-code": "형식화된 코드",
    "input-placeholder": "여기에 코드를 붙여넣기...",
    "print-width": "줄 너비",
    "tab-width": "탭 너비",
    "use-tabs": "탭 사용",
    "semi": "세미콜론",
    "single-quote": "작은따옴표",
    "trailing-comma": "후행 쉼표",
    "trailing-none": "없음",
    "trailing-es5": "ES5",
    "trailing-all": "전체",
    "format-error": "형식화 실패",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "ru": {
    "import-from-file": "Импорт из файла",
    "format-now": "Форматировать",
    "download-formatted": "Скачать форматированный",
    "language": "Язык",
    "input-code": "Входной код",
    "formatted-code": "Отформатированный код",
    "input-placeholder": "Вставьте код сюда...",
    "print-width": "Ширина строки",
    "tab-width": "Ширина табуляции",
    "use-tabs": "Использовать табы",
    "semi": "Точки с запятой",
    "single-quote": "Одинарные кавычки",
    "trailing-comma": "Замыкающие запятые",
    "trailing-none": "Нет",
    "trailing-es5": "ES5",
    "trailing-all": "Все",
    "format-error": "Ошибка форматирования",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "pt": {
    "import-from-file": "Importar de arquivo",
    "format-now": "Formatar",
    "download-formatted": "Baixar formatado",
    "language": "Idioma",
    "input-code": "Código de entrada",
    "formatted-code": "Código formatado",
    "input-placeholder": "Cole seu código aqui...",
    "print-width": "Largura da linha",
    "tab-width": "Largura da tabulação",
    "use-tabs": "Usar tabulações",
    "semi": "Ponto e vírgula",
    "single-quote": "Aspas simples",
    "trailing-comma": "Vírgulas finais",
    "trailing-none": "Nenhum",
    "trailing-es5": "ES5",
    "trailing-all": "Todos",
    "format-error": "Falha na formatação",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "ar": {
    "import-from-file": "استيراد من ملف",
    "format-now": "تنسيق",
    "download-formatted": "تنزيل المنسق",
    "language": "اللغة",
    "input-code": "إدخال الكود",
    "formatted-code": "الكود المنسق",
    "input-placeholder": "الصق الكود هنا...",
    "print-width": "عرض السطر",
    "tab-width": "عرض علامة التبويب",
    "use-tabs": "استخدام علامات التبويب",
    "semi": "الفواصل المنقوطة",
    "single-quote": "علامات اقتباس مفردة",
    "trailing-comma": "فواصل لاحقة",
    "trailing-none": "بدون",
    "trailing-es5": "ES5",
    "trailing-all": "الكل",
    "format-error": "فشل التنسيق",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "hi": {
    "import-from-file": "फ़ाइल से आयात करें",
    "format-now": "फ़ॉर्मेट करें",
    "download-formatted": "फ़ॉर्मेटेड डाउनलोड करें",
    "language": "भाषा",
    "input-code": "इनपुट कोड",
    "formatted-code": "फ़ॉर्मेटेड कोड",
    "input-placeholder": "यहां अपना कोड पेस्ट करें...",
    "print-width": "लाइन चौड़ाई",
    "tab-width": "टैब चौड़ाई",
    "use-tabs": "टैब का उपयोग करें",
    "semi": "सेमिकोलोन",
    "single-quote": "सिंगल कोट्स",
    "trailing-comma": "अंतिम कॉमा",
    "trailing-none": "कोई नहीं",
    "trailing-es5": "ES5",
    "trailing-all": "सब",
    "format-error": "फ़ॉर्मेटिंग विफल",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "tr": {
    "import-from-file": "Dosyadan içe aktar",
    "format-now": "Biçimlendir",
    "download-formatted": "Biçimlendirileni indir",
    "language": "Dil",
    "input-code": "Girdi kodu",
    "formatted-code": "Biçimlendirilmiş kod",
    "input-placeholder": "Kodunuzu buraya yapıştırın...",
    "print-width": "Satır genişliği",
    "tab-width": "Sekme genişliği",
    "use-tabs": "Sekme kullan",
    "semi": "Noktalı virgüller",
    "single-quote": "Tek tırnak",
    "trailing-comma": "Sona eklenen virgüller",
    "trailing-none": "Yok",
    "trailing-es5": "ES5",
    "trailing-all": "Tümü",
    "format-error": "Biçimlendirme başarısız",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "nl": {
    "import-from-file": "Importeren uit bestand",
    "format-now": "Formatteren",
    "download-formatted": "Geformatteerd downloaden",
    "language": "Taal",
    "input-code": "Invoercode",
    "formatted-code": "Geformatteerde code",
    "input-placeholder": "Plak je code hier...",
    "print-width": "Regelbreedte",
    "tab-width": "Tabbreedte",
    "use-tabs": "Tabs gebruiken",
    "semi": "Puntkomma's",
    "single-quote": "Enkele aanhalingstekens",
    "trailing-comma": "Afsluitende komma's",
    "trailing-none": "Geen",
    "trailing-es5": "ES5",
    "trailing-all": "Alles",
    "format-error": "Formatteren mislukt",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "sv": {
    "import-from-file": "Importera från fil",
    "format-now": "Formatera",
    "download-formatted": "Ladda ner formaterat",
    "language": "Språk",
    "input-code": "Indatakod",
    "formatted-code": "Formaterad kod",
    "input-placeholder": "Klistra in din kod här...",
    "print-width": "Radbredd",
    "tab-width": "Tabbredd",
    "use-tabs": "Använd tabbar",
    "semi": "Semikolon",
    "single-quote": "Enkla citattecken",
    "trailing-comma": "Avslutande kommatecken",
    "trailing-none": "Ingen",
    "trailing-es5": "ES5",
    "trailing-all": "Alla",
    "format-error": "Formatering misslyckades",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "pl": {
    "import-from-file": "Importuj z pliku",
    "format-now": "Formatuj",
    "download-formatted": "Pobierz sformatowany",
    "language": "Język",
    "input-code": "Kod wejściowy",
    "formatted-code": "Sformatowany kod",
    "input-placeholder": "Wklej tutaj swój kod...",
    "print-width": "Szerokość linii",
    "tab-width": "Szerokość tabulatora",
    "use-tabs": "Używaj tabów",
    "semi": "Średniki",
    "single-quote": "Cudzysłowy pojedyncze",
    "trailing-comma": "Końcowe przecinki",
    "trailing-none": "Brak",
    "trailing-es5": "ES5",
    "trailing-all": "Wszystkie",
    "format-error": "Formatowanie nie powiodło się",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "vi": {
    "import-from-file": "Nhập từ tệp",
    "format-now": "Định dạng",
    "download-formatted": "Tải xuống đã định dạng",
    "language": "Ngôn ngữ",
    "input-code": "Mã đầu vào",
    "formatted-code": "Mã đã định dạng",
    "input-placeholder": "Dán mã của bạn tại đây...",
    "print-width": "Độ rộng dòng",
    "tab-width": "Độ rộng tab",
    "use-tabs": "Dùng tab",
    "semi": "Dấu chấm phẩy",
    "single-quote": "Dấu nháy đơn",
    "trailing-comma": "Dấu phẩy cuối",
    "trailing-none": "Không",
    "trailing-es5": "ES5",
    "trailing-all": "Tất cả",
    "format-error": "Định dạng thất bại",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "th": {
    "import-from-file": "นำเข้าจากไฟล์",
    "format-now": "จัดรูปแบบ",
    "download-formatted": "ดาวน์โหลดที่จัดรูปแบบแล้ว",
    "language": "ภาษา",
    "input-code": "โค้ดนำเข้า",
    "formatted-code": "โค้ดที่จัดรูปแบบแล้ว",
    "input-placeholder": "วางโค้ดของคุณที่นี่...",
    "print-width": "ความกว้างบรรทัด",
    "tab-width": "ความกว้างแท็บ",
    "use-tabs": "ใช้แท็บ",
    "semi": "เซมิโคลอน",
    "single-quote": "เครื่องหมายอัญประกาศเดี่ยว",
    "trailing-comma": "จุลภาคท้าย",
    "trailing-none": "ไม่มี",
    "trailing-es5": "ES5",
    "trailing-all": "ทั้งหมด",
    "format-error": "จัดรูปแบบล้มเหลว",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "id": {
    "import-from-file": "Impor dari file",
    "format-now": "Format",
    "download-formatted": "Unduh yang diformat",
    "language": "Bahasa",
    "input-code": "Kode masukan",
    "formatted-code": "Kode yang diformat",
    "input-placeholder": "Tempel kode Anda di sini...",
    "print-width": "Lebar baris",
    "tab-width": "Lebar tab",
    "use-tabs": "Gunakan tab",
    "semi": "Titik koma",
    "single-quote": "Tanda kutip tunggal",
    "trailing-comma": "Koma akhir",
    "trailing-none": "Tidak ada",
    "trailing-es5": "ES5",
    "trailing-all": "Semua",
    "format-error": "Gagal memformat",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "he": {
    "import-from-file": "ייבוא מקובץ",
    "format-now": "עיצוב",
    "download-formatted": "הורד מעוצב",
    "language": "שפה",
    "input-code": "קוד קלט",
    "formatted-code": "קוד מעוצב",
    "input-placeholder": "הדבק את הקוד כאן...",
    "print-width": "רוחב שורה",
    "tab-width": "רוחב טאב",
    "use-tabs": "השתמש בטאבים",
    "semi": "נקודות פסיק",
    "single-quote": "גרשיים בודדים",
    "trailing-comma": "פסיקים סופיים",
    "trailing-none": "ללא",
    "trailing-es5": "ES5",
    "trailing-all": "הכל",
    "format-error": "העיצוב נכשל",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "ms": {
    "import-from-file": "Import dari fail",
    "format-now": "Format",
    "download-formatted": "Muat turun yang diformat",
    "language": "Bahasa",
    "input-code": "Kod input",
    "formatted-code": "Kod diformat",
    "input-placeholder": "Tampal kod anda di sini...",
    "print-width": "Lebar baris",
    "tab-width": "Lebar tab",
    "use-tabs": "Guna tab",
    "semi": "Titik koma",
    "single-quote": "Petik tunggal",
    "trailing-comma": "Koma hujung",
    "trailing-none": "Tiada",
    "trailing-es5": "ES5",
    "trailing-all": "Semua",
    "format-error": "Format gagal",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  },
  "no": {
    "import-from-file": "Importer fra fil",
    "format-now": "Formater",
    "download-formatted": "Last ned formatert",
    "language": "Språk",
    "input-code": "Inndata-kode",
    "formatted-code": "Formatert kode",
    "input-placeholder": "Lim inn koden din her...",
    "print-width": "Linjevidde",
    "tab-width": "Tabbredde",
    "use-tabs": "Bruk tabulatorer",
    "semi": "Semikolon",
    "single-quote": "Enkle anførselstegn",
    "trailing-comma": "Etterfølgende kommaer",
    "trailing-none": "Ingen",
    "trailing-es5": "ES5",
    "trailing-all": "Alle",
    "format-error": "Formatering mislyktes",
    "lang-javascript": "JavaScript",
    "lang-typescript": "TypeScript",
    "lang-json": "JSON",
    "lang-html": "HTML",
    "lang-css": "CSS",
    "lang-scss": "SCSS",
    "lang-markdown": "Markdown",
    "lang-yaml": "YAML",
    "lang-flow": "Flow",
    "lang-json5": "JSON5",
    "lang-jsonc": "JSONC",
    "lang-angular": "Angular",
    "lang-vue": "Vue",
    "lang-lwc": "LWC",
    "lang-handlebars": "Handlebars",
    "lang-less": "Less",
    "lang-mdx": "MDX",
    "lang-graphql": "GraphQL"
  }
}
</i18n>

<style scoped>
.code-input :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>
