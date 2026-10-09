const decoder = new TextDecoder()
const text = (bytes: ArrayBuffer, start: number, end: number) =>
  decoder.decode(bytes.slice(start, end))

/** Validate bounded PalmDB headers before the reader touches compressed text. */
export async function checkHeader(file: File, signal: AbortSignal) {
  const header = await file.slice(0, 78).arrayBuffer()
  signal.throwIfAborted()
  if (header.byteLength < 78) throw new Error("invalid")
  if (text(header, 60, 68) !== "BOOKMOBI") throw new Error("unsupportedVariant")
  const count = new DataView(header).getUint16(76)
  const tableEnd = 78 + count * 8
  if (!count || tableEnd > file.size) throw new Error("invalid")
  const table = new DataView(await file.slice(78, tableEnd).arrayBuffer())
  const offsets = Array.from({ length: count }, (_, i) =>
    table.getUint32(i * 8)
  )
  for (const [index, offset] of offsets.entries()) {
    if (offset < (offsets[index - 1] ?? tableEnd) || offset >= file.size)
      throw new Error("invalid")
  }
  async function record(index: number) {
    signal.throwIfAborted()
    const start = offsets[index]
    if (start === undefined) throw new Error("invalid")
    const bytes = await file.slice(start, offsets[index + 1]).arrayBuffer()
    if (bytes.byteLength < 248) throw new Error("invalid")
    const view = new DataView(bytes)
    if (view.getUint16(12)) throw new Error("protected")
    if (text(bytes, 16, 20) !== "MOBI") throw new Error("unsupportedVariant")
    const length = view.getUint32(20)
    if (length < 232 || length + 16 > bytes.byteLength)
      throw new Error("invalid")
    const version = view.getUint32(36)
    if (
      ![6, 7, 8].includes(version) ||
      ![1, 2, 17480].includes(view.getUint16(0)) ||
      ![1252, 65001].includes(view.getUint32(28))
    )
      throw new Error("unsupportedVariant")
    const textRecords = view.getUint16(8)
    if (!textRecords) throw new Error("empty")
    if (index + textRecords >= offsets.length) throw new Error("invalid")
    let boundary: number | undefined
    if (view.getUint32(128) & 64) {
      let cursor = length + 16
      if (
        cursor + 12 > bytes.byteLength ||
        text(bytes, cursor, cursor + 4) !== "EXTH"
      )
        throw new Error("invalid")
      const end = cursor + view.getUint32(cursor + 4)
      const records = view.getUint32(cursor + 8)
      cursor += 12
      if (end > bytes.byteLength || end < cursor) throw new Error("invalid")
      for (let i = 0; i < records; i++) {
        if (cursor + 8 > end) throw new Error("invalid")
        const type = view.getUint32(cursor)
        const size = view.getUint32(cursor + 4)
        if (size < 8 || cursor + size > end) throw new Error("invalid")
        if (type === 122 && text(bytes, cursor + 8, cursor + size) === "true")
          throw new Error("unsupportedLayout")
        if (type === 121) {
          if (size !== 12) throw new Error("invalid")
          boundary = view.getUint32(cursor + 8)
        }
        cursor += size
      }
    }
    return version < 8 && boundary !== 0xffffffff ? boundary : undefined
  }
  const boundary = await record(0)
  // A combo book has a second PalmDOC/MOBI header; check its DRM/layout too.
  if (boundary !== undefined) await record(boundary)
  signal.throwIfAborted()
}
