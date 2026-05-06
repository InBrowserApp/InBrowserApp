import { CronExpressionParser } from "cron-parser"
import cronstrue from "cronstrue/i18n"

type CronValidationResult =
  | Readonly<{ state: "empty" }>
  | Readonly<{ state: "valid" }>
  | Readonly<{ state: "invalid"; error: string }>

type CronFieldId =
  | "second"
  | "minute"
  | "hour"
  | "dayOfMonth"
  | "month"
  | "dayOfWeek"

type CronField = Readonly<{
  id: CronFieldId
  value: string
  range: string
}>

type CronPresetId =
  | "everyMinute"
  | "everyFiveMinutes"
  | "everyFifteenMinutes"
  | "everyThirtyMinutes"
  | "hourly"
  | "dailyMidnight"
  | "dailyNoon"
  | "weeklySunday"
  | "weeklyMondayMorning"
  | "monthlyFirstDay"
  | "weekdaysMorning"

type CronPreset = Readonly<{
  id: CronPresetId
  value: string
}>

const CRON_PRESETS = [
  { id: "everyMinute", value: "* * * * *" },
  { id: "everyFiveMinutes", value: "*/5 * * * *" },
  { id: "everyFifteenMinutes", value: "*/15 * * * *" },
  { id: "everyThirtyMinutes", value: "*/30 * * * *" },
  { id: "hourly", value: "0 * * * *" },
  { id: "dailyMidnight", value: "0 0 * * *" },
  { id: "dailyNoon", value: "0 12 * * *" },
  { id: "weeklySunday", value: "0 0 * * 0" },
  { id: "weeklyMondayMorning", value: "0 9 * * 1" },
  { id: "monthlyFirstDay", value: "0 0 1 * *" },
  { id: "weekdaysMorning", value: "0 9 * * 1-5" },
] as const satisfies readonly CronPreset[]

const FIELD_DEFINITIONS = [
  { id: "second", range: "0-59" },
  { id: "minute", range: "0-59" },
  { id: "hour", range: "0-23" },
  { id: "dayOfMonth", range: "1-31" },
  { id: "month", range: "1-12 or JAN-DEC" },
  { id: "dayOfWeek", range: "0-7 or SUN-SAT" },
] as const satisfies readonly Readonly<{ id: CronFieldId; range: string }>[]

const CRONSTRUE_LOCALE_BY_LANGUAGE: Readonly<Record<string, string>> = {
  ar: "ar",
  de: "de",
  en: "en",
  es: "es",
  fr: "fr",
  he: "he",
  id: "id",
  it: "it",
  ja: "ja",
  ko: "ko",
  nl: "nl",
  no: "nb",
  pl: "pl",
  pt: "pt_BR",
  ru: "ru",
  sv: "sv",
  th: "th",
  tr: "tr",
  vi: "vi",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
}

function normalizeCronExpression(expression: string) {
  return expression.trim().replace(/\s+/g, " ")
}

function validateCronExpression(expression: string): CronValidationResult {
  const normalizedExpression = normalizeCronExpression(expression)

  if (normalizedExpression.length === 0) {
    return { state: "empty" }
  }

  try {
    CronExpressionParser.parse(normalizedExpression)
    return { state: "valid" }
  } catch (caughtError) {
    return {
      state: "invalid",
      error: String(caughtError).replace(/^Error:\s*/, ""),
    }
  }
}

function getCronDescription(expression: string, language: string) {
  const normalizedExpression = normalizeCronExpression(expression)

  if (normalizedExpression.length === 0) {
    return ""
  }

  try {
    return cronstrue.toString(normalizedExpression, {
      locale: mapLanguageToCronstrueLocale(language),
    })
  } catch {
    return ""
  }
}

function getNextRunTimes(
  expression: string,
  options: Readonly<{ count?: number; referenceDate?: Date }> = {}
) {
  const normalizedExpression = normalizeCronExpression(expression)
  const count = options.count ?? 10

  if (normalizedExpression.length === 0 || count <= 0) {
    return []
  }

  try {
    const interval = CronExpressionParser.parse(normalizedExpression, {
      currentDate: options.referenceDate,
    })

    return Array.from({ length: count }, () => interval.next().toDate())
  } catch {
    return []
  }
}

function parseCronFields(expression: string): readonly CronField[] {
  const fields = normalizeCronExpression(expression).split(" ")

  if (fields.length === 5) {
    return FIELD_DEFINITIONS.slice(1).map((field, index) => ({
      ...field,
      value: fields[index]!,
    }))
  }

  if (fields.length === 6) {
    return FIELD_DEFINITIONS.map((field, index) => ({
      ...field,
      value: fields[index]!,
    }))
  }

  return []
}

function mapLanguageToCronstrueLocale(language: string) {
  return CRONSTRUE_LOCALE_BY_LANGUAGE[language] ?? "en"
}

export {
  CRON_PRESETS,
  getCronDescription,
  getNextRunTimes,
  mapLanguageToCronstrueLocale,
  normalizeCronExpression,
  parseCronFields,
  validateCronExpression,
}
export type { CronField, CronFieldId, CronPresetId, CronValidationResult }
