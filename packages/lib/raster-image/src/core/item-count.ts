import type { SourceKind } from "../types"

/** Cross-check explicit directories so a damaged later page cannot silently disappear. */
export function declaredItems(bytes: Uint8Array, format: SourceKind["format"]) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (format === "ICO") {
    if (bytes.length < 6) throw new Error("invalid")
    return view.getUint16(4, true)
  }
  if (format !== "TIFF") return undefined
  const little = bytes[0] === 73
  const big = bytes[little ? 2 : 3] === 43
  const read = (offset: number, size: number) => {
    if (offset + size > bytes.length) throw new Error("invalid")
    return size === 8
      ? Number(view.getBigUint64(offset, little))
      : size === 4
        ? view.getUint32(offset, little)
        : view.getUint16(offset, little)
  }
  if (big && (read(4, 2) !== 8 || read(6, 2) !== 0)) throw new Error("invalid")
  const seen = new Set<number>()
  const size = big ? 8 : 4
  const countSize = big ? 8 : 2
  const entrySize = big ? 20 : 12
  let offset = read(big ? 8 : 4, size)
  while (offset) {
    if (seen.has(offset)) throw new Error("invalid")
    seen.add(offset)
    const entries = read(offset, countSize)
    if (entries > (bytes.length - offset - countSize - size) / entrySize)
      throw new Error("invalid")
    offset = read(offset + countSize + entries * entrySize, size)
  }
  return seen.size
}
