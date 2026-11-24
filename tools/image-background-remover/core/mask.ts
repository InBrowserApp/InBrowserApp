const mean = [0.485, 0.456, 0.406] as const
const deviation = [0.229, 0.224, 0.225] as const
const channels = [0, 1, 2] as const

export function prepareInput(rgba: Uint8ClampedArray) {
  const pixels = rgba.length / 4
  const input = new Float32Array(pixels * 3)
  let peak = 1

  for (let i = 0; i < pixels; i++) {
    const offset = i * 4
    peak = Math.max(peak, rgba[offset]!, rgba[offset + 1]!, rgba[offset + 2]!)
  }
  for (const channel of channels) {
    for (let i = 0; i < pixels; i++) {
      input[channel * pixels + i] =
        (rgba[i * 4 + channel]! / peak - mean[channel]) / deviation[channel]
    }
  }

  return input
}

export function writeMask(prediction: Float32Array, rgba: Uint8ClampedArray) {
  let low = Infinity
  let high = -Infinity
  for (const value of prediction) {
    low = Math.min(low, value)
    high = Math.max(high, value)
  }

  for (const [i, value] of prediction.entries()) {
    const normalized = high > low ? (value - low) / (high - low) : value
    // Snap near-transparent and near-opaque pixels while keeping soft edges.
    rgba[i * 4 + 3] = ((normalized - 0.04) / 0.92) * 255
  }
}
