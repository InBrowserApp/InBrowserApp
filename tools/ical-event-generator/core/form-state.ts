import {
  isTimeZoneSupported,
  parseDateInput,
  toDateInputValue,
  toTimeInputValue,
} from "./time-zone"

import type { ReminderUnit } from "./ics"

const WEEKDAY_VALUES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const

type OutputMode = "utc" | "tzid"
type RecurrenceFrequency = "none" | "daily" | "weekly" | "monthly" | "yearly"
type RecurrenceEndMode = "never" | "count" | "until"

type Reminder = Readonly<{
  id: string
  amount: number
  unit: ReminderUnit
}>

type IcalEventFormState = Readonly<{
  title: string
  location: string
  url: string
  description: string
  uid: string
  isAllDay: boolean
  timeZone: string
  outputMode: OutputMode
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  recurrenceFrequency: RecurrenceFrequency
  recurrenceInterval: number
  recurrenceWeekdays: readonly string[]
  recurrenceMonthDay: number
  recurrenceMonth: number
  recurrenceEndMode: RecurrenceEndMode
  recurrenceCount: number
  recurrenceUntilDate: string
  recurrenceUntilTime: string
  remindersEnabled: boolean
  reminders: readonly Reminder[]
}>

type PartialRecord = Record<string, unknown>

function generateUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${crypto.randomUUID()}@inbrowser.app`
  }

  return `${Math.random().toString(36).slice(2)}-${Date.now()}@inbrowser.app`
}

function createReminder(unit: ReminderUnit = "minutes", amount = 15): Reminder {
  return {
    id: generateUid(),
    amount,
    unit,
  }
}

function isReminder(value: Reminder | null): value is Reminder {
  return value !== null
}

function roundToNextHalfHour(timestampMs: number): number {
  const date = new Date(timestampMs)
  date.setSeconds(0, 0)

  const minutes = date.getMinutes()

  if (minutes === 0 || minutes === 30) {
    return date.getTime()
  }

  const nextMinutes = minutes < 30 ? 30 : 60
  date.setMinutes(nextMinutes, 0, 0)

  return date.getTime()
}

function clampInteger(
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback
  }

  const nextValue = Math.round(value)

  if (nextValue < minimum || nextValue > maximum) {
    return fallback
  }

  return nextValue
}

function isReminderUnit(value: unknown): value is ReminderUnit {
  return (
    value === "minutes" ||
    value === "hours" ||
    value === "days" ||
    value === "weeks"
  )
}

function isOutputMode(value: unknown): value is OutputMode {
  return value === "utc" || value === "tzid"
}

function isRecurrenceFrequency(value: unknown): value is RecurrenceFrequency {
  return (
    value === "none" ||
    value === "daily" ||
    value === "weekly" ||
    value === "monthly" ||
    value === "yearly"
  )
}

function isRecurrenceEndMode(value: unknown): value is RecurrenceEndMode {
  return value === "never" || value === "count" || value === "until"
}

function sanitizeWeekdays(
  value: unknown,
  fallback: readonly string[]
): readonly string[] {
  if (!Array.isArray(value)) {
    return fallback
  }

  const nextValue = value.filter((entry) =>
    WEEKDAY_VALUES.includes(entry as never)
  )

  return nextValue.length > 0 ? nextValue : fallback
}

function createBlankFormState(
  nowMs: number,
  timeZone: string,
  uid = generateUid()
): IcalEventFormState {
  const resolvedTimeZone = isTimeZoneSupported(timeZone) ? timeZone : "UTC"
  const roundedStart = roundToNextHalfHour(nowMs)
  const roundedEnd = roundedStart + 60 * 60 * 1000
  const startDate = toDateInputValue(roundedStart, resolvedTimeZone)
  const endDate = toDateInputValue(roundedEnd, resolvedTimeZone)
  const startTime = toTimeInputValue(roundedStart, resolvedTimeZone)
  const endTime = toTimeInputValue(roundedEnd, resolvedTimeZone)
  const startDateParts = parseDateInput(startDate)!

  const startWeekday = WEEKDAY_VALUES[
    (new Date(
      Date.UTC(
        startDateParts.year,
        startDateParts.month - 1,
        startDateParts.day
      )
    ).getUTCDay() +
      6) %
      7
  ] as (typeof WEEKDAY_VALUES)[number]

  return {
    title: "",
    location: "",
    url: "",
    description: "",
    uid,
    isAllDay: false,
    timeZone: resolvedTimeZone,
    outputMode: "utc",
    startDate,
    startTime,
    endDate,
    endTime,
    recurrenceFrequency: "none",
    recurrenceInterval: 1,
    recurrenceWeekdays: [startWeekday],
    recurrenceMonthDay: startDateParts.day,
    recurrenceMonth: startDateParts.month,
    recurrenceEndMode: "never",
    recurrenceCount: 10,
    recurrenceUntilDate: startDate,
    recurrenceUntilTime: endTime,
    remindersEnabled: false,
    reminders: [createReminder()],
  }
}

function restoreFormState(
  value: unknown,
  fallback: IcalEventFormState
): IcalEventFormState {
  if (!value || typeof value !== "object") {
    return fallback
  }

  const record = value as PartialRecord
  const reminders = Array.isArray(record.reminders)
    ? record.reminders
        .map((entry) => {
          if (!entry || typeof entry !== "object") {
            return null
          }

          const reminder = entry as PartialRecord

          return {
            id:
              typeof reminder.id === "string" && reminder.id.length > 0
                ? reminder.id
                : generateUid(),
            amount: clampInteger(reminder.amount, 15, 1, 10_080),
            unit: isReminderUnit(reminder.unit) ? reminder.unit : "minutes",
          } satisfies Reminder
        })
        .filter(isReminder)
    : fallback.reminders

  return {
    title: typeof record.title === "string" ? record.title : fallback.title,
    location:
      typeof record.location === "string" ? record.location : fallback.location,
    url: typeof record.url === "string" ? record.url : fallback.url,
    description:
      typeof record.description === "string"
        ? record.description
        : fallback.description,
    uid:
      typeof record.uid === "string" && record.uid.length > 0
        ? record.uid
        : fallback.uid,
    isAllDay:
      typeof record.isAllDay === "boolean"
        ? record.isAllDay
        : fallback.isAllDay,
    timeZone:
      typeof record.timeZone === "string" &&
      isTimeZoneSupported(record.timeZone)
        ? record.timeZone
        : fallback.timeZone,
    outputMode: isOutputMode(record.outputMode)
      ? record.outputMode
      : fallback.outputMode,
    startDate:
      typeof record.startDate === "string"
        ? record.startDate
        : fallback.startDate,
    startTime:
      typeof record.startTime === "string"
        ? record.startTime
        : fallback.startTime,
    endDate:
      typeof record.endDate === "string" ? record.endDate : fallback.endDate,
    endTime:
      typeof record.endTime === "string" ? record.endTime : fallback.endTime,
    recurrenceFrequency: isRecurrenceFrequency(record.recurrenceFrequency)
      ? record.recurrenceFrequency
      : fallback.recurrenceFrequency,
    recurrenceInterval: clampInteger(
      record.recurrenceInterval,
      fallback.recurrenceInterval,
      1,
      365
    ),
    recurrenceWeekdays: sanitizeWeekdays(
      record.recurrenceWeekdays,
      fallback.recurrenceWeekdays
    ),
    recurrenceMonthDay: clampInteger(
      record.recurrenceMonthDay,
      fallback.recurrenceMonthDay,
      1,
      31
    ),
    recurrenceMonth: clampInteger(
      record.recurrenceMonth,
      fallback.recurrenceMonth,
      1,
      12
    ),
    recurrenceEndMode: isRecurrenceEndMode(record.recurrenceEndMode)
      ? record.recurrenceEndMode
      : fallback.recurrenceEndMode,
    recurrenceCount: clampInteger(
      record.recurrenceCount,
      fallback.recurrenceCount,
      1,
      365
    ),
    recurrenceUntilDate:
      typeof record.recurrenceUntilDate === "string"
        ? record.recurrenceUntilDate
        : fallback.recurrenceUntilDate,
    recurrenceUntilTime:
      typeof record.recurrenceUntilTime === "string"
        ? record.recurrenceUntilTime
        : fallback.recurrenceUntilTime,
    remindersEnabled:
      typeof record.remindersEnabled === "boolean"
        ? record.remindersEnabled
        : fallback.remindersEnabled,
    reminders: reminders.length > 0 ? reminders : fallback.reminders,
  }
}

export {
  WEEKDAY_VALUES,
  createBlankFormState,
  createReminder,
  generateUid,
  restoreFormState,
}
export type {
  IcalEventFormState,
  OutputMode,
  RecurrenceEndMode,
  RecurrenceFrequency,
  Reminder,
}
