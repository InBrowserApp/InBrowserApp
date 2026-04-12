import { PRETTIER_LANGUAGE_CONFIGS } from "./prettier-language-configs"
import {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  PRETTIER_LANGUAGE_KEYS,
  PRETTIER_TRAILING_COMMA_VALUES,
  clampPrettierPrintWidth,
  clampPrettierTabWidth,
  isPrettierLanguageKey,
  isPrettierTrailingComma,
  type PrettierFormatOptions,
  type PrettierFormatRequest,
  type PrettierLanguageKey,
  type PrettierPluginKey,
} from "./prettier-types"

function getPrettierLanguageConfig(language: PrettierLanguageKey) {
  return PRETTIER_LANGUAGE_CONFIGS[language]
}

function sanitizePrettierFormatOptions(
  options: Partial<PrettierFormatOptions>
): PrettierFormatOptions {
  return {
    language: isPrettierLanguageKey(options.language)
      ? options.language
      : DEFAULT_PRETTIER_FORMAT_OPTIONS.language,
    printWidth: clampPrettierPrintWidth(options.printWidth),
    tabWidth: clampPrettierTabWidth(options.tabWidth),
    useTabs:
      typeof options.useTabs === "boolean"
        ? options.useTabs
        : DEFAULT_PRETTIER_FORMAT_OPTIONS.useTabs,
    semi:
      typeof options.semi === "boolean"
        ? options.semi
        : DEFAULT_PRETTIER_FORMAT_OPTIONS.semi,
    singleQuote:
      typeof options.singleQuote === "boolean"
        ? options.singleQuote
        : DEFAULT_PRETTIER_FORMAT_OPTIONS.singleQuote,
    trailingComma: isPrettierTrailingComma(options.trailingComma)
      ? options.trailingComma
      : DEFAULT_PRETTIER_FORMAT_OPTIONS.trailingComma,
  }
}

function createPrettierFormatRequest(
  code: string,
  options: Partial<PrettierFormatOptions>
): PrettierFormatRequest {
  const sanitizedOptions = sanitizePrettierFormatOptions(options)
  const config = getPrettierLanguageConfig(sanitizedOptions.language)
  const outputExtension =
    config.outputExtension ?? config.extensions[0] ?? ".txt"

  return {
    code,
    language: sanitizedOptions.language,
    parser: config.parser,
    pluginKeys: config.pluginKeys,
    highlightLanguage: config.highlightLanguage,
    outputExtension,
    printWidth: sanitizedOptions.printWidth,
    tabWidth: sanitizedOptions.tabWidth,
    useTabs: sanitizedOptions.useTabs,
    semi: config.supportsSemi ? sanitizedOptions.semi : undefined,
    singleQuote: config.supportsSingleQuote
      ? sanitizedOptions.singleQuote
      : undefined,
    trailingComma: config.supportsTrailingComma
      ? sanitizedOptions.trailingComma
      : undefined,
  }
}

function detectPrettierLanguageFromFilename(filename: string) {
  const normalizedFilename = filename.toLowerCase()
  const pathSegments = normalizedFilename.split(/[\\/]/)
  const basename = pathSegments[pathSegments.length - 1]

  const exactMatch = Object.entries(PRETTIER_LANGUAGE_CONFIGS).find(
    ([, config]) =>
      config.filenames?.some(
        (candidateFilename) => candidateFilename.toLowerCase() === basename
      )
  )

  if (exactMatch) {
    return exactMatch[0] as PrettierLanguageKey
  }

  let detectedLanguage: PrettierLanguageKey | null = null
  let detectedExtensionLength = 0

  for (const [language, config] of Object.entries(PRETTIER_LANGUAGE_CONFIGS)) {
    for (const candidateExtension of config.extensions) {
      const normalizedExtension = candidateExtension.toLowerCase()

      if (
        normalizedFilename.endsWith(normalizedExtension) &&
        normalizedExtension.length > detectedExtensionLength
      ) {
        detectedLanguage = language as PrettierLanguageKey
        detectedExtensionLength = normalizedExtension.length
      }
    }
  }

  return detectedLanguage
}

function getPrettierDownloadFilename(language: PrettierLanguageKey) {
  const config = getPrettierLanguageConfig(language)
  const extension =
    config.outputExtension ?? config.extensions[0] ?? ".formatted"

  return `formatted${extension}`
}

export {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  PRETTIER_LANGUAGE_KEYS,
  PRETTIER_TRAILING_COMMA_VALUES,
  clampPrettierPrintWidth,
  clampPrettierTabWidth,
  createPrettierFormatRequest,
  detectPrettierLanguageFromFilename,
  getPrettierDownloadFilename,
  getPrettierLanguageConfig,
  isPrettierLanguageKey,
  isPrettierTrailingComma,
  sanitizePrettierFormatOptions,
}
export type { PrettierFormatOptions, PrettierFormatRequest, PrettierPluginKey }
