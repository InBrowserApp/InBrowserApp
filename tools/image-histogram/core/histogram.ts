export const levels = 256
const rgbChannels = ["red", "green", "blue"] as const
export const channels = ["brightness", "rgb", ...rgbChannels] as const

export type Channel = (typeof channels)[number]
export type BinChannel = Exclude<Channel, "rgb">
export type Scale = "linear" | "logarithmic"

export function createHistogram() {
  return {
    pixels: 0,
    bins: {
      brightness: new Float64Array(levels),
      red: new Float64Array(levels),
      green: new Float64Array(levels),
      blue: new Float64Array(levels),
    },
  }
}

export type Histogram = ReturnType<typeof createHistogram>

export function countPixels(histogram: Histogram, rgba: Uint8ClampedArray) {
  const { brightness, red, green, blue } = histogram.bins

  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i + 3] === 0) continue

    const r = rgba[i]!
    const g = rgba[i + 1]!
    const b = rgba[i + 2]!
    // Rec. 709 luma coefficients on the browser's 8-bit RGB values.
    const luma = Math.round((2126 * r + 7152 * g + 722 * b) / 10000)

    red[r]! += 1
    green[g]! += 1
    blue[b]! += 1
    brightness[luma]! += 1
    histogram.pixels += 1
  }
}

export function visibleChannels(channel: Channel): readonly BinChannel[] {
  return channel === "rgb" ? rgbChannels : [channel]
}
