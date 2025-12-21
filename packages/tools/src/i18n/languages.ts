export const supportedLanguages = [
  'en', // English
  'zh', // Simplified Chinese
  'zh-CN', // Simplified Chinese (China)
  'zh-TW', // Traditional Chinese (Taiwan)
  'zh-HK', // Traditional Chinese (Hong Kong)
  'es', // Spanish
  'fr', // French
  'de', // German
  'it', // Italian
  'ja', // Japanese
  'ko', // Korean
  'ru', // Russian
  'pt', // Portuguese
  'ar', // Arabic
  'hi', // Hindi
  'tr', // Turkish
  'nl', // Dutch
  'sv', // Swedish
  'pl', // Polish
  'vi', // Vietnamese
  'th', // Thai
  'id', // Indonesian
  'he', // Hebrew
  'ms', // Malay
  'no', // Norwegian
] as const

export const rtlLanguages = [
  'ar', // Arabic
  'he', // Hebrew
  'fa', // Persian
  'ur', // Urdu
  'ps', // Pashto
] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]
