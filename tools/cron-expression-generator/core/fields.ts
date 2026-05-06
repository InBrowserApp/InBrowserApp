const CRON_FIELD_NAMES = [
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
] as const

type CronFieldName = (typeof CRON_FIELD_NAMES)[number]
type CronFieldMode = "every" | "interval" | "specific" | "range"

type CronFieldConfig = Readonly<{
  min: number
  max: number
  gridColumns: string
  unit: "minute" | "hour" | "day" | "month" | "weekday"
}>

type CronFieldState = Readonly<{
  mode: CronFieldMode
  interval: number
  specificValues: readonly number[]
  rangeStart: number
  rangeEnd: number
}>

type CronFormState = Readonly<Record<CronFieldName, CronFieldState>>

const CRON_FIELD_CONFIGS: Record<CronFieldName, CronFieldConfig> = {
  minute: {
    min: 0,
    max: 59,
    gridColumns: "grid-cols-6 sm:grid-cols-10",
    unit: "minute",
  },
  hour: {
    min: 0,
    max: 23,
    gridColumns: "grid-cols-6 sm:grid-cols-8",
    unit: "hour",
  },
  dayOfMonth: {
    min: 1,
    max: 31,
    gridColumns: "grid-cols-6 sm:grid-cols-8",
    unit: "day",
  },
  month: {
    min: 1,
    max: 12,
    gridColumns: "grid-cols-4 sm:grid-cols-6",
    unit: "month",
  },
  dayOfWeek: {
    min: 0,
    max: 6,
    gridColumns: "grid-cols-4 sm:grid-cols-7",
    unit: "weekday",
  },
}

const PRESET_EXPRESSIONS = {
  everyMinute: "* * * * *",
  everyFiveMinutes: "*/5 * * * *",
  everyFifteenMinutes: "*/15 * * * *",
  hourly: "0 * * * *",
  dailyMidnight: "0 0 * * *",
  dailyNoon: "0 12 * * *",
  weekdayMorning: "0 9 * * 1-5",
  weeklySunday: "0 0 * * 0",
  monthlyFirstDay: "0 0 1 * *",
} as const

type CronPresetId = keyof typeof PRESET_EXPRESSIONS

const DEFAULT_CRON_EXPRESSION = PRESET_EXPRESSIONS.everyMinute

export {
  CRON_FIELD_CONFIGS,
  CRON_FIELD_NAMES,
  DEFAULT_CRON_EXPRESSION,
  PRESET_EXPRESSIONS,
}
export type {
  CronFieldMode,
  CronFieldName,
  CronFieldState,
  CronFormState,
  CronPresetId,
}
