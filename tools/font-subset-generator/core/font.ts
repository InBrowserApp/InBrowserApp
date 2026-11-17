import type { FontDetails } from "../types"

export function fontKind(data: Uint8Array) {
  const signature = new DataView(
    data.buffer,
    data.byteOffset,
    data.byteLength
  ).getUint32(0)
  switch (signature) {
    case 0x00010000:
    case 0x74727565:
      return "ttf"
    case 0x4f54544f:
      return "otf"
    case 0x774f4646:
      return "woff"
    case 0x774f4632:
      return "woff2"
    default:
      throw new Error("INVALID_FONT")
  }
}

export function readFont(data: Uint8Array) {
  const kind = fontKind(data)
  if (kind !== "ttf" && kind !== "otf") throw new Error("INVALID_FONT")
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  const tables = new Map<string, DataView>()
  const count = view.getUint16(4)
  if (!count || 12 + count * 16 > data.byteLength)
    throw new Error("INVALID_FONT")
  for (let i = 0; i < count; i++) {
    const entry = 12 + i * 16
    const tag = String.fromCharCode(...data.subarray(entry, entry + 4))
    const offset = view.getUint32(entry + 8)
    const length = view.getUint32(entry + 12)
    tables.set(tag, new DataView(data.buffer, data.byteOffset + offset, length))
  }
  const cmap = tables.get("cmap")!
  const subtables: { offset: number; format: number }[] = []
  for (let i = 0; i < cmap.getUint16(2); i++) {
    const entry = 4 + i * 8
    const platform = cmap.getUint16(entry)
    const encoding = cmap.getUint16(entry + 2)
    if (
      platform !== 0 &&
      !(platform === 3 && (encoding === 1 || encoding === 10))
    )
      continue
    const offset = cmap.getUint32(entry + 4)
    const format = cmap.getUint16(offset)
    if ([4, 12, 13].includes(format)) subtables.push({ offset, format })
  }
  if (!subtables.length) throw new Error("INVALID_FONT")

  function hasCharacter(codepoint: number) {
    return subtables.some(({ offset, format }) => {
      if (format === 4) {
        if (codepoint > 0xffff) return false
        const segments = cmap.getUint16(offset + 6) / 2
        const ends = offset + 14
        const starts = ends + segments * 2 + 2
        const deltas = starts + segments * 2
        const ranges = deltas + segments * 2
        let low = 0
        let high = segments - 1
        while (low <= high) {
          const i = (low + high) >>> 1
          if (codepoint > cmap.getUint16(ends + i * 2)) {
            low = i + 1
            continue
          }
          const start = cmap.getUint16(starts + i * 2)
          if (codepoint < start) {
            high = i - 1
            continue
          }
          const delta = cmap.getInt16(deltas + i * 2)
          const range = cmap.getUint16(ranges + i * 2)
          if (!range) return ((codepoint + delta) & 0xffff) !== 0
          const glyph = cmap.getUint16(
            ranges + i * 2 + range + 2 * (codepoint - start)
          )
          return glyph !== 0 && ((glyph + delta) & 0xffff) !== 0
        }
        return false
      }
      const groups = cmap.getUint32(offset + 12)
      let low = 0
      let high = groups - 1
      while (low <= high) {
        const mid = (low + high) >>> 1
        const group = offset + 16 + mid * 12
        const start = cmap.getUint32(group)
        const end = cmap.getUint32(group + 4)
        if (codepoint < start) high = mid - 1
        else if (codepoint > end) low = mid + 1
        else {
          const glyph = cmap.getUint32(group + 8)
          return (format === 13 ? glyph : glyph + codepoint - start) !== 0
        }
      }
      return false
    })
  }

  const os2 = tables.get("OS/2")
  const selection = os2 && os2.byteLength >= 64 ? os2.getUint16(62) : 0
  const macStyle = tables.get("head")!.getUint16(44)
  const details: FontDetails = {
    extension: kind,
    glyphCount: tables.get("maxp")!.getUint16(4),
    weight: String(os2 ? os2.getUint16(4) : 400),
    style:
      selection & 1 || macStyle & 2
        ? "italic"
        : selection & 512
          ? "oblique"
          : "normal",
  }
  const fvar = tables.get("fvar")
  if (fvar) {
    const start = fvar.getUint16(4)
    const axisCount = fvar.getUint16(8)
    const axisSize = fvar.getUint16(10)
    for (let i = 0; i < axisCount; i++) {
      const axis = start + i * axisSize
      if (fvar.getUint32(axis) === 0x77676874) {
        details.weight = `${fvar.getInt32(axis + 4) / 65536} ${fvar.getInt32(axis + 12) / 65536}`
      }
    }
  }
  return { details, hasCharacter }
}
