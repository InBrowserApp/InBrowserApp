import { parseNumber } from "@workspace/localized-number"
import type { MeasureRange } from "@workspace/score-export/musicxml"

export function parseMeasureRange(
  first: string,
  last: string,
  count: number,
  language: string
): MeasureRange | undefined {
  const start = parseNumber(first.normalize("NFKC"), language)
  const end = parseNumber(last.normalize("NFKC"), language)
  if (start.kind !== "valid" || end.kind !== "valid") return
  if (
    !Number.isInteger(start.value) ||
    !Number.isInteger(end.value) ||
    start.value < 1 ||
    end.value < start.value ||
    end.value > count
  )
    return
  return [start.value, end.value]
}
