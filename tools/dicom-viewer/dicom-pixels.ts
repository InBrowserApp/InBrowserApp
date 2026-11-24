import type { Frame, WindowFunction, WindowLevel } from "./types"

export function pixelValues(
  bytes: Uint8Array,
  {
    count,
    allocated,
    stored,
    signed,
    littleEndian,
    slope,
    intercept,
    padding,
  }: {
    count: number
    allocated: number
    stored: number
    signed: boolean
    littleEndian: boolean
    slope: number
    intercept: number
    padding?: readonly [number, number]
  }
) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const pixels = new Float32Array(count)
  const range = 2 ** stored
  const sign = range / 2
  let min = Infinity
  let max = -Infinity

  for (let i = 0; i < count; i++) {
    const raw =
      allocated === 8 ? view.getUint8(i) : view.getUint16(i * 2, littleEndian)
    const masked = raw & (range - 1)
    const value = signed && masked >= sign ? masked - range : masked
    if (padding && value >= padding[0] && value <= padding[1]) {
      pixels[i] = NaN
      continue
    }
    const sample = value * slope + intercept
    pixels[i] = sample
    min = Math.min(min, sample)
    max = Math.max(max, sample)
  }

  return {
    pixels,
    min: min === Infinity ? 0 : min,
    max: max === -Infinity ? 0 : max,
  }
}

export function defaultWindow(min: number, max: number): WindowLevel {
  return {
    width: Math.max(1, max - min + 1),
    level: (min + max + 1) / 2,
  }
}

function windowPixel(value: number, window: WindowLevel, mode: WindowFunction) {
  const { width, level } = window
  if (mode === "SIGMOID")
    return 255 / (1 + Math.exp((-4 * (value - level)) / width))
  if (mode === "LINEAR_EXACT") return ((value - level) / width + 0.5) * 255
  // DICOM PS3.3 applies the half-sample offset to the default LINEAR function.
  if (width === 1) return value <= level - 0.5 ? 0 : 255
  return ((value - (level - 0.5)) / (width - 1) + 0.5) * 255
}

export function rgba(frame: Frame, window: WindowLevel) {
  const out = new Uint8ClampedArray(frame.pixels.length * 4)
  for (let index = 0; index < frame.pixels.length; index++) {
    const shade = windowPixel(
      frame.pixels[index]!,
      window,
      frame.windowFunction
    )
    const offset = index * 4
    out[offset] =
      out[offset + 1] =
      out[offset + 2] =
        frame.inverted ? 255 - shade : shade
    out[offset + 3] = 255
  }
  return out
}
