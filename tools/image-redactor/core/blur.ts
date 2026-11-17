// Separable box blur fallback for browsers without CanvasRenderingContext2D.filter.
// Premultiplied channels keep transparent pixels from producing dark fringes.
export function blurPixels(
  input: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
) {
  const horizontal = new Float32Array(input.length)
  const output = new Uint8ClampedArray(input.length)
  const r = Math.max(1, Math.round(radius))
  const size = r * 2 + 1
  for (let y = 0; y < height; y++) {
    const sum = [0, 0, 0, 0]
    const add = (x: number, sign: number) => {
      const i = (y * width + Math.max(0, Math.min(width - 1, x))) * 4
      const alpha = input[i + 3]! / 255
      for (let c = 0; c < 3; c++) sum[c]! += input[i + c]! * alpha * sign
      sum[3]! += input[i + 3]! * sign
    }
    for (let x = -r; x <= r; x++) add(x, 1)
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      for (let c = 0; c < 4; c++) horizontal[i + c] = sum[c]! / size
      add(x - r, -1)
      add(x + r + 1, 1)
    }
  }
  for (let x = 0; x < width; x++) {
    const sum = [0, 0, 0, 0]
    const add = (y: number, sign: number) => {
      const i = (Math.max(0, Math.min(height - 1, y)) * width + x) * 4
      for (let c = 0; c < 4; c++) sum[c]! += horizontal[i + c]! * sign
    }
    for (let y = -r; y <= r; y++) add(y, 1)
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4
      const alpha = sum[3]! / size
      for (let c = 0; c < 3; c++)
        output[i + c] = alpha > 0 ? ((sum[c]! / size) * 255) / alpha : 0
      output[i + 3] = alpha
      add(y - r, -1)
      add(y + r + 1, 1)
    }
  }
  return output
}
