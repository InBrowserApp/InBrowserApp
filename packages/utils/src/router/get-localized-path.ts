import type { SupportedLanguage } from '@inbrowserapp/tools-shared'

export function getLocalizedPath(path: string, lang: SupportedLanguage) {
  return lang === 'en' ? path : `/${lang}${path}`
}