import { useState } from "react"
import type { ClipRange } from "./types"

type Field = keyof ClipRange
type Fields = Record<Field, string>

const arabicDigits = "٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹"

function parseSeconds(text: string) {
  const normalized = text
    .trim()
    .replace(/[٠-٩۰-۹]/g, (digit) => String(arabicDigits.indexOf(digit) % 10))
    .replace(/[,٫]/g, ".")
  return /^(?:\d+\.?\d*|\.\d+)$/.test(normalized) ? Number(normalized) : NaN
}

export function useClipSelection(duration: number) {
  const limit = Math.ceil(duration * 1000) / 1000
  const [draft, setDraft] = useState<{ fields: Fields; slider: number[] }>()
  const [submitted, setSubmitted] = useState(false)
  const fields = draft?.fields ?? { start: "0", end: String(limit) }
  const slider = draft?.slider ?? [0, limit]

  function readRange(start: number, end: number): ClipRange | undefined {
    const clampedEnd = Math.min(end, duration)
    return start >= 0 && start < clampedEnd && end <= limit
      ? { start, end: clampedEnd }
      : undefined
  }

  function change(next: Fields, moved: Field) {
    const start = parseSeconds(next.start)
    const end = parseSeconds(next.end)
    setDraft({
      fields: next,
      slider: readRange(start, end) ? [start, end] : slider,
    })
    const time = moved === "start" ? start : end
    return time >= 0 && time <= limit ? Math.min(time, duration) : undefined
  }

  const range = readRange(parseSeconds(fields.start), parseSeconds(fields.end))
  return {
    fields,
    slider,
    range,
    limit,
    change,
    error: submitted && !range,
    validate: () => setSubmitted(true),
  }
}
