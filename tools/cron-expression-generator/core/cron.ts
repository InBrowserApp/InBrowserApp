import {
  CRON_FIELD_CONFIGS,
  CRON_FIELD_NAMES,
  DEFAULT_CRON_EXPRESSION,
  PRESET_EXPRESSIONS,
  type CronFieldMode,
  type CronFieldName,
  type CronFieldState,
  type CronFormState,
  type CronPresetId,
} from "./fields"

const NEXT_RUN_LOOKAHEAD_DAYS = 366 * 8

function clampInteger(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min
  }

  return Math.min(max, Math.max(min, Math.trunc(value)))
}

function getCronFieldConfig(fieldName: CronFieldName) {
  return CRON_FIELD_CONFIGS[fieldName]
}

function createEveryFieldState(fieldName: CronFieldName): CronFieldState {
  const config = getCronFieldConfig(fieldName)

  return {
    mode: "every",
    interval: Math.min(5, config.max - config.min + 1),
    specificValues: [],
    rangeStart: config.min,
    rangeEnd: config.max,
  }
}

function createDefaultCronFormState(): CronFormState {
  return parseCronExpression(DEFAULT_CRON_EXPRESSION)
}

function normalizeCronFieldState(
  fieldName: CronFieldName,
  state: CronFieldState
): CronFieldState {
  const config = getCronFieldConfig(fieldName)
  const maxInterval = config.max - config.min + 1
  const specificValues = [...new Set(state.specificValues)]
    .map((value) => clampInteger(value, config.min, config.max))
    .sort((a, b) => a - b)
  const rangeStart = clampInteger(state.rangeStart, config.min, config.max)
  const rangeEnd = clampInteger(state.rangeEnd, config.min, config.max)

  return {
    mode: state.mode,
    interval: clampInteger(state.interval, 1, maxInterval),
    specificValues,
    rangeStart: Math.min(rangeStart, rangeEnd),
    rangeEnd: Math.max(rangeStart, rangeEnd),
  }
}

function parseCronField(
  fieldName: CronFieldName,
  value: string
): CronFieldState {
  const trimmed = value.trim()

  if (trimmed === "*") {
    return createEveryFieldState(fieldName)
  }

  if (/^\*\/\d+$/.test(trimmed)) {
    return normalizeCronFieldState(fieldName, {
      ...createEveryFieldState(fieldName),
      mode: "interval",
      interval: Number(trimmed.slice(2)),
    })
  }

  if (/^\d+-\d+$/.test(trimmed)) {
    const [start, end] = trimmed.split("-").map(Number) as [number, number]

    return normalizeCronFieldState(fieldName, {
      ...createEveryFieldState(fieldName),
      mode: "range",
      rangeStart: start,
      rangeEnd: end,
    })
  }

  if (/^\d+(,\d+)*$/.test(trimmed)) {
    return normalizeCronFieldState(fieldName, {
      ...createEveryFieldState(fieldName),
      mode: "specific",
      specificValues: trimmed.split(",").map(Number),
    })
  }

  return createEveryFieldState(fieldName)
}

function parseCronExpression(expression: string): CronFormState {
  const parts = expression.trim().split(/\s+/)

  if (parts.length !== CRON_FIELD_NAMES.length) {
    return Object.fromEntries(
      CRON_FIELD_NAMES.map((fieldName) => [
        fieldName,
        createEveryFieldState(fieldName),
      ])
    ) as CronFormState
  }

  return Object.fromEntries(
    CRON_FIELD_NAMES.map((fieldName, index) => [
      fieldName,
      parseCronField(fieldName, parts[index]!),
    ])
  ) as CronFormState
}

function formatCronField(fieldName: CronFieldName, state: CronFieldState) {
  const normalized = normalizeCronFieldState(fieldName, state)

  if (normalized.mode === "interval") {
    return `*/${normalized.interval}`
  }

  if (normalized.mode === "specific") {
    return normalized.specificValues.length > 0
      ? normalized.specificValues.join(",")
      : "*"
  }

  if (normalized.mode === "range") {
    return `${normalized.rangeStart}-${normalized.rangeEnd}`
  }

  return "*"
}

function buildCronExpression(state: CronFormState) {
  return CRON_FIELD_NAMES.map((fieldName) =>
    formatCronField(fieldName, state[fieldName])
  ).join(" ")
}

function getCronFieldValues(fieldName: CronFieldName, state: CronFieldState) {
  const config = getCronFieldConfig(fieldName)
  const normalized = normalizeCronFieldState(fieldName, state)

  if (normalized.mode === "specific") {
    return normalized.specificValues.length > 0
      ? normalized.specificValues
      : createRange(config.min, config.max)
  }

  if (normalized.mode === "range") {
    return createRange(normalized.rangeStart, normalized.rangeEnd)
  }

  if (normalized.mode === "interval") {
    return createRange(config.min, config.max).filter(
      (value) => (value - config.min) % normalized.interval === 0
    )
  }

  return createRange(config.min, config.max)
}

function createRange(start: number, end: number) {
  const values: number[] = []

  for (let value = start; value <= end; value += 1) {
    values.push(value)
  }

  return values
}

function matchesCronDay(date: Date, state: CronFormState) {
  const dayOfMonthState = normalizeCronFieldState(
    "dayOfMonth",
    state.dayOfMonth
  )
  const dayOfWeekState = normalizeCronFieldState("dayOfWeek", state.dayOfWeek)
  const dayOfMonthWildcard =
    formatCronField("dayOfMonth", dayOfMonthState) === "*"
  const dayOfWeekWildcard = formatCronField("dayOfWeek", dayOfWeekState) === "*"
  const dayOfMonthMatches = getCronFieldValues(
    "dayOfMonth",
    dayOfMonthState
  ).includes(date.getDate())
  const dayOfWeekMatches = getCronFieldValues(
    "dayOfWeek",
    dayOfWeekState
  ).includes(date.getDay())

  if (dayOfMonthWildcard && dayOfWeekWildcard) {
    return true
  }

  if (dayOfMonthWildcard) {
    return dayOfWeekMatches
  }

  if (dayOfWeekWildcard) {
    return dayOfMonthMatches
  }

  return dayOfMonthMatches || dayOfWeekMatches
}

function generateNextRunTimes(
  state: CronFormState,
  startDate = new Date(),
  limit = 5
) {
  const normalizedLimit = clampInteger(limit, 1, 20)
  const start = new Date(startDate.getTime())
  const runs: Date[] = []
  const months = getCronFieldValues("month", state.month)
  const hours = getCronFieldValues("hour", state.hour)
  const minutes = getCronFieldValues("minute", state.minute)

  start.setSeconds(0, 0)
  start.setMinutes(start.getMinutes() + 1)

  for (
    let dayOffset = 0;
    dayOffset <= NEXT_RUN_LOOKAHEAD_DAYS;
    dayOffset += 1
  ) {
    const day = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + dayOffset
    )

    if (!months.includes(day.getMonth() + 1) || !matchesCronDay(day, state)) {
      continue
    }

    for (const hour of hours) {
      for (const minute of minutes) {
        const candidate = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          hour,
          minute,
          0,
          0
        )

        if (candidate.getTime() < start.getTime()) {
          continue
        }

        runs.push(candidate)

        if (runs.length >= normalizedLimit) {
          return runs
        }
      }
    }
  }

  return runs
}

export {
  CRON_FIELD_CONFIGS,
  CRON_FIELD_NAMES,
  DEFAULT_CRON_EXPRESSION,
  PRESET_EXPRESSIONS,
  buildCronExpression,
  createDefaultCronFormState,
  formatCronField,
  generateNextRunTimes,
  getCronFieldConfig,
  getCronFieldValues,
  normalizeCronFieldState,
  parseCronExpression,
}
export type {
  CronFieldMode,
  CronFieldName,
  CronFieldState,
  CronFormState,
  CronPresetId,
}
