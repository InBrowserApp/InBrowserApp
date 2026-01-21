import type { SupportedLanguage } from './languages'
import type { ToolMetadata, ToolI18n } from './types'

export function translateMeta(tool: ToolMetadata, lang: SupportedLanguage): ToolI18n {
  return tool.i18n[lang] || tool.i18n.en
}
