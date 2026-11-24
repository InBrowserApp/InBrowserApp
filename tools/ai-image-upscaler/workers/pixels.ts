export function toRgbPlanes({ width, height, data }: ImageData) {
  const count = width * height
  const planes = new Float32Array(count * 3)
  for (let index = 0; index < count; index++) {
    planes[index] = data[index * 4]! / 255
    planes[count + index] = data[index * 4 + 1]! / 255
    planes[count * 2 + index] = data[index * 4 + 2]! / 255
  }
  return planes
}

export function writeTile(
  rgba: Uint8ClampedArray,
  planes: Float32Array,
  outputWidth: number,
  outputHeight: number,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const count = outputWidth * outputHeight
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const from = (y + row) * outputWidth + x + column
      const to = (row * width + column) * 4
      rgba[to] = planes[from]! * 255
      rgba[to + 1] = planes[count + from]! * 255
      rgba[to + 2] = planes[count * 2 + from]! * 255
      rgba[to + 3] = 255
    }
  }
}
