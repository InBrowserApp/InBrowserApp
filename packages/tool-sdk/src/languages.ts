const DEFAULT_REQUIRED_TOOL_LANGUAGES = ["en"] as const

type DefaultRequiredToolLanguage =
  (typeof DEFAULT_REQUIRED_TOOL_LANGUAGES)[number]
type ToolLanguage = DefaultRequiredToolLanguage | (string & {})

function uniqueLanguages(languages: readonly string[]) {
  return [
    ...new Set(languages.map((language) => language.trim()).filter(Boolean)),
  ]
}

export { DEFAULT_REQUIRED_TOOL_LANGUAGES, uniqueLanguages }
export type { DefaultRequiredToolLanguage, ToolLanguage }
