function pad(value: number, length = 2) {
  return String(value).padStart(length, "0")
}

function formatDateTimeLocalInput(milliseconds: number) {
  const date = new Date(milliseconds)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`,
  ].join("T")
}

function parseDateTimeLocalInput(value: string) {
  if (value.trim() === "") {
    return null
  }

  const date = new Date(value)
  const milliseconds = date.getTime()

  return Number.isNaN(milliseconds) ? null : milliseconds
}

export { formatDateTimeLocalInput, parseDateTimeLocalInput }
