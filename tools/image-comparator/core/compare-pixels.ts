// Compare premultiplied colors and alpha so invisible RGB values do not count.
export function comparePixels(
  before: Uint8ClampedArray,
  after: Uint8ClampedArray,
  output: Uint8ClampedArray,
  tolerance: number
) {
  const threshold = (tolerance / 100) * 255
  let changed = 0

  for (let i = 0; i < before.length; i += 4) {
    const a = before[i + 3]! / 255
    const b = after[i + 3]! / 255
    const red = before[i]!
    const green = before[i + 1]!
    const blue = before[i + 2]!
    const difference = Math.max(
      Math.abs(red * a - after[i]! * b),
      Math.abs(green * a - after[i + 1]! * b),
      Math.abs(blue * a - after[i + 2]! * b),
      Math.abs(before[i + 3]! - after[i + 3]!)
    )

    if (difference > threshold) {
      changed++
      output[i] = 224
      output[i + 1] = 0
      output[i + 2] = 111
    } else {
      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722
      const gray = 242 + (luminance - 255) * a * 0.29
      output[i] = gray
      output[i + 1] = gray
      output[i + 2] = gray
    }
    output[i + 3] = 255
  }

  return changed
}
