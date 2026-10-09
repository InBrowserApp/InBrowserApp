import { find, read } from "cfb"

const signature = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]

/** Read only container and FIB metadata; document content stays in the worker. */
export function inspectDocument(buffer: ArrayBuffer, name: string) {
  const bytes = new Uint8Array(buffer)
  if (!signature.every((value, index) => bytes[index] === value))
    throw new Error("unsupported")
  if (bytes.length < 512) throw new Error("invalid")
  const header = new DataView(buffer)
  const version = header.getUint16(26, true)
  const shift = header.getUint16(30, true)
  if (
    !((version === 3 && shift === 9) || (version === 4 && shift === 12)) ||
    header.getUint16(28, true) !== 0xfffe ||
    header.getUint16(32, true) !== 6
  )
    throw new Error("invalid")
  if (version === 4) throw new Error("unsupported")
  const container = read(bytes, { type: "array" })
  if (find(container, "/EncryptedPackage")) throw new Error("protected")
  const stream = find(container, "/WordDocument")?.content
  if (!stream) throw new Error("unsupported")
  const word = new Uint8Array(stream)
  const preview = new TextDecoder().decode(word.subarray(0, 1024)).trimStart()
  if (/^(?:<!doctype\s+html\b|<html\b|<body\b)/i.test(preview))
    return { template: /\.wpt$/i.test(name), limited: true }
  if (word.length < 34) throw new Error("invalid")
  const fib = new DataView(word.buffer, word.byteOffset, word.byteLength)
  const flags = fib.getUint16(10, true)
  if (flags & 0x0100) throw new Error("protected")
  if (fib.getUint16(0, true) !== 0xa5ec || fib.getUint16(2, true) < 0xbf)
    throw new Error("unsupported")
  const words = fib.getUint16(32, true)
  const longsOffset = 34 + words * 2
  if (longsOffset + 2 > word.length) throw new Error("invalid")
  const longs = fib.getUint16(longsOffset, true)
  if (longsOffset + 2 + longs * 4 > word.length) throw new Error("invalid")
  // Main text is followed by footnote/header/macro/comment/endnote stories.
  const omitted = [4, 5, 6, 7, 8].some(
    (index) =>
      index < longs && fib.getUint32(longsOffset + 2 + index * 4, true) > 0
  )
  return {
    template: Boolean(flags & 1) || /\.wpt$/i.test(name),
    limited: omitted,
  }
}
