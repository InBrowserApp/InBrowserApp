import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface CronField {
  name: string
  value: string
  description: string
}

/**
 * Validate a cron expression
 */
export function validateExpression(expression: string): ValidationResult {
  if (!expression.trim()) {
    return { valid: false, error: 'Expression is empty' }
  }

  try {
    CronExpressionParser.parse(expression.trim())
    return { valid: true }
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid cron expression',
    }
  }
}

/**
 * Get the next N run times for a cron expression
 */
export function getNextRunTimes(expression: string, count: number = 10): Date[] {
  try {
    const interval = CronExpressionParser.parse(expression.trim())
    const dates: Date[] = []

    for (let i = 0; i < count; i++) {
      dates.push(interval.next().toDate())
    }

    return dates
  } catch {
    return []
  }
}

/**
 * Get a human-readable description of a cron expression
 */
export function getHumanDescription(expression: string, locale: string = 'en'): string {
  try {
    // Map locale to cronstrue locale
    const cronstrueLocale = mapToCronstrueLocale(locale)
    return cronstrue.toString(expression.trim(), { locale: cronstrueLocale })
  } catch {
    return ''
  }
}

/**
 * Map app locale to cronstrue supported locale
 */
function mapToCronstrueLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    en: 'en',
    zh: 'zh_CN',
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW',
    'zh-HK': 'zh_TW',
    es: 'es',
    fr: 'fr',
    de: 'de',
    it: 'it',
    ja: 'ja',
    ko: 'ko',
    ru: 'ru',
    pt: 'pt_BR',
    ar: 'ar',
    hi: 'en', // Hindi not supported, fallback to English
    tr: 'tr',
    nl: 'nl',
    sv: 'sv',
    pl: 'pl',
    vi: 'vi',
    th: 'th',
    id: 'id',
    he: 'he',
    ms: 'en', // Malay not supported, fallback to English
    no: 'nb',
  }
  return localeMap[locale] || 'en'
}

/**
 * Parse cron expression into individual fields
 */
export function parseFields(expression: string): CronField[] {
  const parts = expression.trim().split(/\s+/)
  const fieldNames = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week']

  // Handle 5 or 6 field cron expressions
  const isExtended = parts.length === 6
  const fields = isExtended ? parts.slice(1) : parts

  if (fields.length !== 5) {
    return []
  }

  return fields.map((value, index) => ({
    name: fieldNames[index]!,
    value,
    description: getFieldDescription(fieldNames[index]!, value),
  }))
}

/**
 * Get description for a single cron field
 */
function getFieldDescription(fieldName: string, value: string): string {
  if (value === '*') {
    return `Every ${fieldName.toLowerCase()}`
  }

  if (value.startsWith('*/')) {
    const interval = value.slice(2)
    return `Every ${interval} ${fieldName.toLowerCase()}${parseInt(interval) > 1 ? 's' : ''}`
  }

  if (value.includes(',')) {
    return `At ${fieldName.toLowerCase()} ${value}`
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-')
    return `From ${start} to ${end}`
  }

  return `At ${value}`
}

/**
 * Common cron expression presets
 */
export const CRON_PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Every 30 minutes', value: '*/30 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at noon', value: '0 12 * * *' },
  { label: 'Every Sunday at midnight', value: '0 0 * * 0' },
  { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
  { label: 'First day of month', value: '0 0 1 * *' },
  { label: 'Every weekday at 9 AM', value: '0 9 * * 1-5' },
] as const
