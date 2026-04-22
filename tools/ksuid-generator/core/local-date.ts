const DATE_TIME_LOCAL_PATTERN =
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2})(?::(?<second>\d{2})(?:\.(?<millisecond>\d{1,3}))?)?$/u

function padNumber(value: number, length: number) {
  return String(value).padStart(length, "0")
}

function formatDateTimeLocalInput(valueMs: number) {
  const value = new Date(valueMs)

  return `${padNumber(value.getFullYear(), 4)}-${padNumber(value.getMonth() + 1, 2)}-${padNumber(value.getDate(), 2)}T${padNumber(value.getHours(), 2)}:${padNumber(value.getMinutes(), 2)}:${padNumber(value.getSeconds(), 2)}`
}

function parseDateTimeLocalInput(value: string) {
  const match = DATE_TIME_LOCAL_PATTERN.exec(value)

  if (!match?.groups) {
    return null
  }

  const year = Number.parseInt(match.groups.year!, 10)
  const month = Number.parseInt(match.groups.month!, 10)
  const day = Number.parseInt(match.groups.day!, 10)
  const hour = Number.parseInt(match.groups.hour!, 10)
  const minute = Number.parseInt(match.groups.minute!, 10)
  const second = Number.parseInt(match.groups.second ?? "0", 10)
  const millisecond = Number.parseInt(
    (match.groups.millisecond ?? "0").padEnd(3, "0"),
    10
  )
  const parsed = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    millisecond
  )

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute ||
    parsed.getSeconds() !== second ||
    parsed.getMilliseconds() !== millisecond
  ) {
    return null
  }

  return parsed.getTime()
}

export { formatDateTimeLocalInput, parseDateTimeLocalInput }
