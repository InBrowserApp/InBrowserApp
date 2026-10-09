// Only embedded static raster formats are retained. SVG data URLs could nest
// their own active/resource-bearing document and are deliberately omitted.
export function staticRaster(value: string) {
  const match = value.match(
    /^data:image\/(png|jpeg|webp);base64,([a-z0-9+/=\s]+)$/i
  )
  if (!match) return false
  let data: string
  try {
    data = atob(match[2]!)
  } catch (reason) {
    if (
      reason instanceof DOMException &&
      reason.name === "InvalidCharacterError"
    )
      return false
    throw reason
  }
  const format = match[1]!.toLowerCase()
  if (format === "jpeg")
    return data.startsWith("\xff\xd8\xff") && data.endsWith("\xff\xd9")
  if (format === "webp") return staticWebP(data)
  if (!data.startsWith("\x89PNG\r\n\x1a\n")) return false
  let position = 8
  while (position + 12 <= data.length) {
    const length =
      data.charCodeAt(position) * 16777216 +
      data.charCodeAt(position + 1) * 65536 +
      data.charCodeAt(position + 2) * 256 +
      data.charCodeAt(position + 3)
    const name = data.slice(position + 4, position + 8)
    if (name === "acTL" || position + length + 12 > data.length) return false
    if (name === "IEND") return true
    position += length + 12
  }
  return false
}

function staticWebP(data: string) {
  const lengthAt = (position: number) =>
    data.charCodeAt(position) +
    data.charCodeAt(position + 1) * 256 +
    data.charCodeAt(position + 2) * 65536 +
    data.charCodeAt(position + 3) * 16777216
  if (
    !data.startsWith("RIFF") ||
    data.slice(8, 12) !== "WEBP" ||
    lengthAt(4) + 8 !== data.length
  )
    return false
  let position = 12
  let image = false
  while (position + 8 <= data.length) {
    const name = data.slice(position, position + 4)
    const length = lengthAt(position + 4)
    if (position + length + 8 > data.length) return false
    if (name === "ANIM" || name === "ANMF") return false
    if (
      name === "VP8X" &&
      (length !== 10 || (data.charCodeAt(position + 8) & 2) !== 0)
    )
      return false
    if (name === "VP8 " || name === "VP8L") image = true
    position += 8 + length + (length % 2)
  }
  return image && position === data.length
}
