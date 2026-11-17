import { unzlibSync } from "fflate"

// Rebuild the SFNT table directory from a WOFF 1 container (W3C WOFF section 5).
export function decodeWoff(data: Uint8Array) {
  const source = new DataView(data.buffer, data.byteOffset, data.byteLength)
  const count = source.getUint16(12)
  const size = source.getUint32(16)
  if (!count || 44 + count * 20 > data.byteLength)
    throw new Error("INVALID_FONT")
  // Derive the allocation from actual table sizes rather than trusting totalSfntSize.
  let expectedSize = 12 + count * 16
  for (let i = 0; i < count; i++) {
    const length = source.getUint32(44 + i * 20 + 12)
    expectedSize += Math.ceil(length / 4) * 4
  }
  if (size !== expectedSize) throw new Error("INVALID_FONT")
  const output = new Uint8Array(size)
  const target = new DataView(output.buffer)
  target.setUint32(0, source.getUint32(4))
  target.setUint16(4, count)
  const power = Math.floor(Math.log2(count))
  target.setUint16(6, 2 ** power * 16)
  target.setUint16(8, power)
  target.setUint16(10, count * 16 - 2 ** power * 16)
  let offset = 12 + count * 16
  let head = 0
  for (let i = 0; i < count; i++) {
    const from = 44 + i * 20
    const to = 12 + i * 16
    const tag = source.getUint32(from)
    const start = source.getUint32(from + 4)
    const compressedLength = source.getUint32(from + 8)
    const length = source.getUint32(from + 12)
    if (compressedLength > length || start + compressedLength > data.byteLength)
      throw new Error("INVALID_FONT")
    const bytes = data.subarray(start, start + compressedLength)
    const table = compressedLength < length ? unzlibSync(bytes) : bytes
    if (table.byteLength !== length) throw new Error("INVALID_FONT")
    target.setUint32(to, tag)
    target.setUint32(to + 4, source.getUint32(from + 16))
    target.setUint32(to + 8, offset)
    target.setUint32(to + 12, length)
    output.set(table, offset)
    if (tag === 0x68656164) head = offset
    offset += Math.ceil(length / 4) * 4
  }
  if (!head) throw new Error("INVALID_FONT")
  target.setUint32(head + 8, 0)
  let checksum = 0
  for (let i = 0; i < size; i += 4)
    checksum = (checksum + target.getUint32(i)) >>> 0
  target.setUint32(head + 8, (0xb1b0afba - checksum) >>> 0)
  return output
}
