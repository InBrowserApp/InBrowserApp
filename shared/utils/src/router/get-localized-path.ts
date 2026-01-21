import type { SupportedLanguage } from '@shared/tools'

export function getLocalizedPath(path: string, lang: SupportedLanguage) {
  return lang === 'en' ? path : `/${lang}${path}`
}