import {
  buildIcsCalendar,
  buildRrule,
  formatIcsDate,
  formatIcsDateTime,
  formatTrigger,
  formatUtcDateTime,
} from "./ics"
import {
  addDays,
  combineDateAndTime,
  parseDateInput,
  toUtcTimestamp,
} from "./time-zone"

import type { IcsDateValue } from "./ics"
import type { IcalEventFormState } from "./form-state"

type ValidationErrorKey =
  | "invalid-start-date"
  | "invalid-end-date"
  | "invalid-start-time"
  | "invalid-end-time"
  | "end-before-start"
  | "invalid-until-date"
  | "invalid-until-time"

type BuildIcalEventResult =
  | Readonly<{
      state: "error"
      errorKey: ValidationErrorKey
      icsContent: ""
      fileName: string
    }>
  | Readonly<{
      state: "ready"
      errorKey: null
      icsContent: string
      fileName: string
    }>

function sanitizeFilenameSegment(value: string): string {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")

  return sanitized || "ical-event"
}

function buildRecurrenceRule(
  formState: IcalEventFormState
): string | null | ValidationErrorKey {
  if (formState.recurrenceFrequency === "none") {
    return null
  }

  const interval = Math.max(1, Math.round(formState.recurrenceInterval || 1))
  const startDate = parseDateInput(formState.startDate)

  if (!startDate) {
    return "invalid-start-date"
  }

  const rule: {
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
    interval?: number
    byDay?: readonly string[]
    byMonthDay?: number
    byMonth?: number
    count?: number
    until?: string
  } = {
    frequency: formState.recurrenceFrequency.toUpperCase() as
      | "DAILY"
      | "WEEKLY"
      | "MONTHLY"
      | "YEARLY",
    interval,
  }

  if (formState.recurrenceFrequency === "weekly") {
    rule.byDay = formState.recurrenceWeekdays
  }

  if (formState.recurrenceFrequency === "monthly") {
    rule.byMonthDay = formState.recurrenceMonthDay
  }

  if (formState.recurrenceFrequency === "yearly") {
    rule.byMonth = formState.recurrenceMonth
    rule.byMonthDay = formState.recurrenceMonthDay
  }

  if (formState.recurrenceEndMode === "count") {
    rule.count = Math.max(1, Math.round(formState.recurrenceCount || 1))
  }

  if (formState.recurrenceEndMode === "until") {
    const untilDate = parseDateInput(formState.recurrenceUntilDate)

    if (!untilDate) {
      return "invalid-until-date"
    }

    if (formState.isAllDay) {
      rule.until = formatIcsDate(untilDate)
    } else {
      const untilParts = combineDateAndTime(
        formState.recurrenceUntilDate,
        formState.recurrenceUntilTime
      )

      if (!untilParts) {
        return "invalid-until-time"
      }

      rule.until = formatUtcDateTime(
        toUtcTimestamp(untilParts, formState.timeZone)
      )
    }
  }

  return buildRrule(rule)
}

function buildAlarmEntries(formState: IcalEventFormState) {
  if (!formState.remindersEnabled) {
    return []
  }

  return formState.reminders
    .map((reminder) => {
      const trigger = formatTrigger(reminder.amount, reminder.unit)

      if (!trigger) {
        return null
      }

      return {
        trigger,
        description: formState.title.trim() || "Reminder",
      }
    })
    .filter(
      (entry): entry is Readonly<{ trigger: string; description: string }> =>
        entry !== null
    )
}

function buildIcalEventOutput(
  formState: IcalEventFormState,
  nowMs: number
): BuildIcalEventResult {
  const fileName = `${sanitizeFilenameSegment(formState.title || "ical-event")}.ics`
  const recurrenceRule = buildRecurrenceRule(formState)

  if (
    recurrenceRule === "invalid-start-date" ||
    recurrenceRule === "invalid-until-date" ||
    recurrenceRule === "invalid-until-time"
  ) {
    return {
      state: "error",
      errorKey: recurrenceRule,
      icsContent: "",
      fileName,
    }
  }

  let dtstart: IcsDateValue
  let dtend: IcsDateValue

  if (formState.isAllDay) {
    const startDate = parseDateInput(formState.startDate)
    const endDate = parseDateInput(formState.endDate)

    if (!startDate) {
      return {
        state: "error",
        errorKey: "invalid-start-date",
        icsContent: "",
        fileName,
      }
    }

    if (!endDate) {
      return {
        state: "error",
        errorKey: "invalid-end-date",
        icsContent: "",
        fileName,
      }
    }

    const normalizedStart = Date.UTC(
      startDate.year,
      startDate.month - 1,
      startDate.day
    )
    const normalizedEnd = Date.UTC(endDate.year, endDate.month - 1, endDate.day)

    if (normalizedEnd < normalizedStart) {
      return {
        state: "error",
        errorKey: "end-before-start",
        icsContent: "",
        fileName,
      }
    }

    dtstart = {
      type: "date",
      value: formatIcsDate(startDate),
    }
    dtend = {
      type: "date",
      value: formatIcsDate(addDays(endDate, 1)),
    }
  } else {
    const startParts = combineDateAndTime(
      formState.startDate,
      formState.startTime
    )
    const endParts = combineDateAndTime(formState.endDate, formState.endTime)

    if (!startParts) {
      return {
        state: "error",
        errorKey: parseDateInput(formState.startDate)
          ? "invalid-start-time"
          : "invalid-start-date",
        icsContent: "",
        fileName,
      }
    }

    if (!endParts) {
      return {
        state: "error",
        errorKey: parseDateInput(formState.endDate)
          ? "invalid-end-time"
          : "invalid-end-date",
        icsContent: "",
        fileName,
      }
    }

    const startTimestamp = toUtcTimestamp(startParts, formState.timeZone)
    const endTimestamp = toUtcTimestamp(endParts, formState.timeZone)

    if (endTimestamp <= startTimestamp) {
      return {
        state: "error",
        errorKey: "end-before-start",
        icsContent: "",
        fileName,
      }
    }

    if (formState.outputMode === "tzid") {
      dtstart = {
        type: "date-time",
        value: formatIcsDateTime(startParts),
        tzid: formState.timeZone,
      }
      dtend = {
        type: "date-time",
        value: formatIcsDateTime(endParts),
        tzid: formState.timeZone,
      }
    } else {
      dtstart = {
        type: "date-time",
        value: formatUtcDateTime(startTimestamp),
      }
      dtend = {
        type: "date-time",
        value: formatUtcDateTime(endTimestamp),
      }
    }
  }

  const icsContent = buildIcsCalendar(
    {
      uid: formState.uid,
      dtstamp: formatUtcDateTime(nowMs),
      summary: formState.title.trim() || undefined,
      description: formState.description.trim() || undefined,
      location: formState.location.trim() || undefined,
      url: formState.url.trim() || undefined,
      dtstart,
      dtend,
      rrule: recurrenceRule ?? undefined,
      alarms: buildAlarmEntries(formState),
    },
    {
      timeZone:
        !formState.isAllDay && formState.outputMode === "tzid"
          ? formState.timeZone
          : undefined,
    }
  )

  return {
    state: "ready",
    errorKey: null,
    icsContent,
    fileName,
  }
}

export { buildIcalEventOutput }
export type { BuildIcalEventResult, ValidationErrorKey }
