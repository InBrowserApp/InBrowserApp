import {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  getPrettierLanguageConfig,
} from "../core/prettier-languages"

const DEFAULT_SOURCE_CODE = getPrettierLanguageConfig(
  DEFAULT_PRETTIER_FORMAT_OPTIONS.language
).sample
const LARGE_PRETTIER_INPUT_THRESHOLD = 20_000
const STORAGE_KEYS = {
  sourceCode: "tools:prettier-code-formatter:source-code",
  formatOptions: "tools:prettier-code-formatter:format-options",
} as const

export {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  DEFAULT_SOURCE_CODE,
  LARGE_PRETTIER_INPUT_THRESHOLD,
  STORAGE_KEYS,
}
