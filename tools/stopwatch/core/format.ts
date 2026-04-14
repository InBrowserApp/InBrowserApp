const HOUR_MS = 3_600_000
const MINUTE_MS = 60_000
const SECOND_MS = 1_000

function pad2(value: number) {
  return String(value).padStart(2, "0")
}

function formatStopwatch(milliseconds: number) {
  const total = Math.max(0, Math.floor(milliseconds))
  const hours = Math.floor(total / HOUR_MS)
  const minutes = Math.floor((total % HOUR_MS) / MINUTE_MS)
  const seconds = Math.floor((total % MINUTE_MS) / SECOND_MS)
  const hundredths = Math.floor((total % SECOND_MS) / 10)

  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${pad2(hundredths)}`
}

export { formatStopwatch }
