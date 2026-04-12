type PrettierTrailingComma = "none" | "es5" | "all"
type PrettierLanguageKey =
  | "javascript"
  | "typescript"
  | "flow"
  | "json"
  | "json5"
  | "jsonc"
  | "html"
  | "angular"
  | "vue"
  | "lwc"
  | "handlebars"
  | "css"
  | "scss"
  | "less"
  | "markdown"
  | "mdx"
  | "yaml"
  | "graphql"
type PrettierPluginKey =
  | "angular"
  | "babel"
  | "estree"
  | "flow"
  | "glimmer"
  | "graphql"
  | "html"
  | "markdown"
  | "postcss"
  | "typescript"
  | "yaml"

type PrettierFormatOptions = Readonly<{
  language: PrettierLanguageKey
  printWidth: number
  tabWidth: number
  useTabs: boolean
  semi: boolean
  singleQuote: boolean
  trailingComma: PrettierTrailingComma
}>

type PrettierLanguageConfig = Readonly<{
  label: string
  parser: string
  pluginKeys: readonly PrettierPluginKey[]
  highlightLanguage: string
  extensions: readonly string[]
  sample: string
  supportsSemi: boolean
  supportsSingleQuote: boolean
  supportsTrailingComma: boolean
}>

type PrettierFormatRequest = Readonly<{
  code: string
  language: PrettierLanguageKey
  parser: string
  pluginKeys: readonly PrettierPluginKey[]
  highlightLanguage: string
  outputExtension: string
  printWidth: number
  tabWidth: number
  useTabs: boolean
  semi?: boolean
  singleQuote?: boolean
  trailingComma?: PrettierTrailingComma
}>

const PRETTIER_LANGUAGE_KEYS = [
  "javascript",
  "typescript",
  "flow",
  "json",
  "json5",
  "jsonc",
  "html",
  "angular",
  "vue",
  "lwc",
  "handlebars",
  "css",
  "scss",
  "less",
  "markdown",
  "mdx",
  "yaml",
  "graphql",
] as const satisfies readonly PrettierLanguageKey[]

const PRETTIER_TRAILING_COMMA_VALUES = [
  "none",
  "es5",
  "all",
] as const satisfies readonly PrettierTrailingComma[]

const DEFAULT_PRETTIER_LANGUAGE: PrettierLanguageKey = "javascript"

const DEFAULT_PRETTIER_FORMAT_OPTIONS: PrettierFormatOptions = {
  language: DEFAULT_PRETTIER_LANGUAGE,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
}

const MIN_PRETTIER_PRINT_WIDTH = 40
const MAX_PRETTIER_PRINT_WIDTH = 200
const MIN_PRETTIER_TAB_WIDTH = 1
const MAX_PRETTIER_TAB_WIDTH = 8

function isPrettierLanguageKey(value: unknown): value is PrettierLanguageKey {
  return PRETTIER_LANGUAGE_KEYS.includes(value as PrettierLanguageKey)
}

function isPrettierTrailingComma(
  value: unknown
): value is PrettierTrailingComma {
  return PRETTIER_TRAILING_COMMA_VALUES.includes(value as PrettierTrailingComma)
}

function clampPrettierPrintWidth(value: unknown) {
  const nextValue = Number(value)

  if (!Number.isFinite(nextValue)) {
    return DEFAULT_PRETTIER_FORMAT_OPTIONS.printWidth
  }

  return Math.min(
    MAX_PRETTIER_PRINT_WIDTH,
    Math.max(MIN_PRETTIER_PRINT_WIDTH, Math.round(nextValue))
  )
}

function clampPrettierTabWidth(value: unknown) {
  const nextValue = Number(value)

  if (!Number.isFinite(nextValue)) {
    return DEFAULT_PRETTIER_FORMAT_OPTIONS.tabWidth
  }

  return Math.min(
    MAX_PRETTIER_TAB_WIDTH,
    Math.max(MIN_PRETTIER_TAB_WIDTH, Math.round(nextValue))
  )
}

export {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  MAX_PRETTIER_PRINT_WIDTH,
  MAX_PRETTIER_TAB_WIDTH,
  MIN_PRETTIER_PRINT_WIDTH,
  MIN_PRETTIER_TAB_WIDTH,
  PRETTIER_LANGUAGE_KEYS,
  PRETTIER_TRAILING_COMMA_VALUES,
  clampPrettierPrintWidth,
  clampPrettierTabWidth,
  isPrettierLanguageKey,
  isPrettierTrailingComma,
}
export type {
  PrettierFormatOptions,
  PrettierFormatRequest,
  PrettierLanguageConfig,
  PrettierLanguageKey,
  PrettierPluginKey,
  PrettierTrailingComma,
}
