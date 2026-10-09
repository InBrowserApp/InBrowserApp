const units: Record<string, number> = {
  "": 1,
  px: 1,
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  q: 96 / 101.6,
  pt: 96 / 72,
  pc: 16,
}

function absoluteLength(value: string) {
  const match = value
    .trim()
    .match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)([a-z]*)$/i)
  if (!match || !Object.hasOwn(units, match[2]!.toLowerCase())) return 0
  const result = Number(match[1]) * units[match[2]!.toLowerCase()]!
  if (!Number.isFinite(result))
    throw new RangeError("Image dimensions overflow")
  if (result <= 0) throw new Error("INVALID")
  return result
}

export function dimensions(width: string, height: string, viewBox: string) {
  const w = absoluteLength(width)
  const h = absoluteLength(height)
  const box = viewBox
    .trim()
    .split(/[\s,]+/)
    .map(Number)
  const valid =
    box.length === 4 && box.every(Number.isFinite) && box[2]! > 0 && box[3]! > 0
  if (viewBox && !valid) throw new Error("INVALID")
  const ratio = valid ? box[2]! / box[3]! : 2
  const displayWidth = w || (h ? h * ratio : valid ? box[2]! : 300)
  const displayHeight = h || (w ? w / ratio : valid ? box[3]! : 150)
  if (
    !Number.isFinite(displayWidth) ||
    !Number.isFinite(displayHeight) ||
    displayWidth <= 0 ||
    displayHeight <= 0
  )
    throw new RangeError("Image dimensions overflow")
  return {
    width: displayWidth,
    height: displayHeight,
    absolute: Boolean(w && h),
    viewBox: valid ? box.join(" ") : `0 0 ${displayWidth} ${displayHeight}`,
  }
}
