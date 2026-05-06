import { parseDateInput, parseTimeInput } from "../core/time-zone"

function formatDateLabel(value: string, language: string) {
  const parts = parseDateInput(value)

  if (!parts) {
    return value
  }

  try {
    return new Intl.DateTimeFormat(language, {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
      year: "numeric",
    }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day)))
  } catch {
    return value
  }
}

function formatTimeLabel(value: string, language: string) {
  const parts = parseTimeInput(value)

  if (!parts) {
    return value
  }

  try {
    return new Intl.DateTimeFormat(language, {
      hour: "2-digit",
      hourCycle: "h23",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2026, 0, 1, parts.hour, parts.minute)))
  } catch {
    return value
  }
}

function formatDateParts(value: string, language: string) {
  const parts = parseDateInput(value)
  const fallback = {
    day: "--",
    month: "",
    weekday: "",
    year: value,
  }

  if (!parts) {
    return fallback
  }

  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(language, {
      timeZone: "UTC",
      ...options,
    }).format(date)

  try {
    return {
      day: format({ day: "2-digit" }),
      month: format({ month: "short" }),
      weekday: format({ weekday: "short" }),
      year: format({ year: "numeric" }),
    }
  } catch {
    return fallback
  }
}

export { formatDateLabel, formatDateParts, formatTimeLabel }
