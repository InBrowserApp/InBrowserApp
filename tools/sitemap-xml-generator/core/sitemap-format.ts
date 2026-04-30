function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function parseAbsoluteUrl(value: string) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function isHttpUrl(url: URL) {
  return url.protocol === "http:" || url.protocol === "https:"
}

function normalizeBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.trim()

  if (trimmed.length === 0) {
    return null
  }

  try {
    const url = new URL(trimmed)
    return isHttpUrl(url) ? url : null
  } catch {
    return null
  }
}

function normalizeLocation(
  location: string,
  baseUrl: string,
  autoJoin: boolean
) {
  const trimmed = location.trim()

  if (trimmed.length === 0) {
    return { state: "empty" } as const
  }

  const absoluteUrl = parseAbsoluteUrl(trimmed)

  if (absoluteUrl) {
    if (!isHttpUrl(absoluteUrl)) {
      return { state: "error", errorCode: "invalid-location" } as const
    }

    return { state: "success", location: absoluteUrl.toString() } as const
  }

  if (!autoJoin) {
    return { state: "error", errorCode: "invalid-location" } as const
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)

  if (!normalizedBaseUrl) {
    return { state: "error", errorCode: "invalid-base-url" } as const
  }

  try {
    const url = new URL(trimmed, normalizedBaseUrl)

    return {
      state: "success",
      location: url.toString(),
    } as const
  } catch {
    return { state: "error", errorCode: "invalid-location" } as const
  }
}

function formatPriority(priority: string) {
  const trimmed = priority.trim()

  if (trimmed.length === 0) {
    return { state: "empty" } as const
  }

  const numericPriority = Number(trimmed)

  if (!Number.isFinite(numericPriority)) {
    return { state: "error" } as const
  }

  if (numericPriority < 0 || numericPriority > 1) {
    return { state: "error" } as const
  }

  return {
    state: "success",
    priority: numericPriority.toFixed(1),
  } as const
}

function isValidDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

function isValidDateTime(value: string) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/.exec(
      value
    )

  if (!match) {
    return false
  }

  const [
    ,
    year = "",
    month = "",
    day = "",
    hour = "",
    minute = "",
    second = "",
    timezoneOffset = "",
  ] = match

  if (!isValidDateOnly(`${year}-${month}-${day}`)) {
    return false
  }

  if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) {
    return false
  }

  if (timezoneOffset !== "Z") {
    const timezoneHour = Number(timezoneOffset.slice(1, 3))
    const timezoneMinute = Number(timezoneOffset.slice(4, 6))

    if (timezoneHour > 14 || timezoneMinute > 59) {
      return false
    }

    if (timezoneHour === 14 && timezoneMinute !== 0) {
      return false
    }
  }

  return Number.isFinite(Date.parse(value))
}

function formatLastmod(lastmod: string) {
  const trimmed = lastmod.trim()

  if (trimmed.length === 0) {
    return { state: "empty" } as const
  }

  if (isValidDateOnly(trimmed) || isValidDateTime(trimmed)) {
    return { state: "success", lastmod: trimmed } as const
  }

  return { state: "error" } as const
}

export { escapeXml, formatLastmod, formatPriority, normalizeLocation }
