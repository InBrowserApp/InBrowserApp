import type { SupportedLanguage, ToolMetadata, ToolI18n } from '@inbrowserapp/tools-shared'

export { supportedLanguages } from './languages'
export type { SupportedLanguage } from './languages'

export function translateMeta(tool: ToolMetadata, lang: SupportedLanguage): ToolI18n {
  return tool.i18n[lang] || tool.i18n.en
}
