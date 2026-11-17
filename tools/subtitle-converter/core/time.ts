import { SubtitleError } from "./formats"

export function parseTime(value: string, fps = 25, tickRate = 1): number {
  const text = value.trim().replace(",", ".")
  const offset = /^(\d+(?:\.\d+)?)(ms|h|m|s|f|t)$/.exec(text)
  if (offset) {
    const scales: Record<string, number> = {
      ms: 1000,
      h: 1 / 3600,
      m: 1 / 60,
      s: 1,
      f: fps,
      t: tickRate,
    }
    return (Number(offset[1]!) * 1000) / scales[offset[2]!]!
  }
  const clock = /^(?:(\d+):)?(\d+):(\d{2})(?:\.(\d{1,3})|:(\d{2}))?$/.exec(text)
  if (
    !clock ||
    (clock[1] !== undefined && Number(clock[2]) > 59) ||
    Number(clock[3]) > 59 ||
    (clock[5] !== undefined && Number(clock[5]) >= fps)
  )
    throw new SubtitleError("timing")
  return (
    Number(clock[1] ?? 0) * 3600000 +
    Number(clock[2]) * 60000 +
    Number(clock[3]) * 1000 +
    (clock[5] === undefined
      ? Number((clock[4] ?? "").padEnd(3, "0"))
      : (Number(clock[5]) * 1000) / fps)
  )
}

export function clock(ms: number, separator = ".", precision = 3) {
  const factor = 10 ** precision
  const units = Math.round((ms * factor) / 1000)
  const seconds = Math.floor(units / factor)
  return `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}${separator}${String(units % factor).padStart(precision, "0")}`
}

export function frameClock(ms: number, fps: number) {
  let seconds = Math.floor(ms / 1000)
  let frames = Math.round((ms / 1000 - seconds) * fps)
  if (frames >= fps) {
    seconds++
    frames = 0
  }
  return `${clock(seconds * 1000).slice(0, 8)}:${String(frames).padStart(2, "0")}`
}
