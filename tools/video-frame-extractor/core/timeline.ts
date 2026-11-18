export const FRAME_LIMIT = 120

export type Timing = {
  mode: "timestamps" | "interval"
  timestamps: string
  interval: string
  start: string
  end: string
}

type Plan =
  | { times: number[] }
  | { error: "timestampError" | "intervalError" | "limitError" }

function secondsToMilliseconds(value: string) {
  return /^(?:\d+(?:\.\d{1,3})?|\.\d{1,3})$/.test(value)
    ? Math.round(Number(value) * 1000)
    : NaN
}

function parseTime(value: string) {
  const parts = value.split(":")
  const seconds = secondsToMilliseconds(parts.pop()!)
  if (parts.length === 0) return seconds
  if (
    parts.length > 2 ||
    seconds >= 60_000 ||
    parts.some(
      (part, index) => !/^\d+$/.test(part) || (index > 0 && Number(part) >= 60)
    )
  )
    return NaN
  return (
    parts.reduce((total, part) => total * 60 + Number(part), 0) * 60_000 +
    seconds
  )
}

export function planFrames(timing: Timing, duration: number): Plan {
  const durationMs = duration * 1000
  if (timing.mode === "timestamps") {
    const times = [
      ...new Set(
        timing.timestamps
          .trim()
          .split(/[,，、،;；؛\s]+/)
          .filter(Boolean)
          .map(parseTime)
      ),
    ]
    if (
      times.length === 0 ||
      times.some((time) => !Number.isFinite(time) || time > durationMs)
    ) {
      return { error: "timestampError" }
    }
    if (times.length > FRAME_LIMIT) return { error: "limitError" }
    return { times: times.sort((a, b) => a - b) }
  }

  const step = secondsToMilliseconds(timing.interval)
  const start = secondsToMilliseconds(timing.start)
  const videoEnd = timing.end === ""
  const end = videoEnd ? durationMs : secondsToMilliseconds(timing.end)
  if (
    !(Number.isFinite(step) && step > 0 && start < end && end <= durationMs)
  ) {
    return { error: "intervalError" }
  }
  const last = Math.min(end, Math.ceil(durationMs) - 1)
  const count = Math.floor((last - start) / step) + 1
  if (count > FRAME_LIMIT) return { error: "limitError" }
  return {
    times: Array.from({ length: count }, (_, index) => start + index * step),
  }
}

export function formatTime(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60_000)
  const wholeSeconds = Math.floor(milliseconds / 1000) % 60
  const seconds = String(wholeSeconds).padStart(2, "0")
  const fraction = String(milliseconds % 1000).padStart(3, "0")
  return `${String(minutes).padStart(2, "0")}:${seconds}.${fraction}`
}
