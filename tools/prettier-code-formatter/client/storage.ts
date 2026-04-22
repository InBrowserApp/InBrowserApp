import {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  clampPrettierPrintWidth,
  clampPrettierTabWidth,
  isPrettierLanguageKey,
  isPrettierTrailingComma,
  type PrettierFormatOptions,
} from "../core/prettier-languages"

function parseStoredFormatOptions(value: string | null): PrettierFormatOptions {
  if (!value) {
    return DEFAULT_PRETTIER_FORMAT_OPTIONS
  }

  try {
    const parsed = JSON.parse(value) as Partial<PrettierFormatOptions>

    return {
      language: isPrettierLanguageKey(parsed.language)
        ? parsed.language
        : DEFAULT_PRETTIER_FORMAT_OPTIONS.language,
      printWidth: clampPrettierPrintWidth(parsed.printWidth),
      tabWidth: clampPrettierTabWidth(parsed.tabWidth),
      useTabs:
        typeof parsed.useTabs === "boolean"
          ? parsed.useTabs
          : DEFAULT_PRETTIER_FORMAT_OPTIONS.useTabs,
      semi:
        typeof parsed.semi === "boolean"
          ? parsed.semi
          : DEFAULT_PRETTIER_FORMAT_OPTIONS.semi,
      singleQuote:
        typeof parsed.singleQuote === "boolean"
          ? parsed.singleQuote
          : DEFAULT_PRETTIER_FORMAT_OPTIONS.singleQuote,
      trailingComma: isPrettierTrailingComma(parsed.trailingComma)
        ? parsed.trailingComma
        : DEFAULT_PRETTIER_FORMAT_OPTIONS.trailingComma,
    }
  } catch {
    return DEFAULT_PRETTIER_FORMAT_OPTIONS
  }
}

export { parseStoredFormatOptions }
