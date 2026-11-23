// PDF renders JPEG samples in page space. Browser image decoders can instead
// apply camera orientation from APP1 metadata, even with imageOrientation:none.
export function jpegForPdf(
  bytes: Uint8Array<ArrayBuffer>,
  width: number,
  height: number,
  channels: number
): Blob | undefined {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return
  if (bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) return

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const parts: BlobPart[] = []
  let partStart = 0
  let cursor = 2
  let foundFrame = false

  while (cursor + 4 <= bytes.length && bytes[cursor] === 0xff) {
    const start = cursor
    while (bytes[cursor] === 0xff) cursor++
    const marker = bytes[cursor++]
    if (cursor + 2 > bytes.length) return
    const length = view.getUint16(cursor)
    if (length < 2 || cursor + length > bytes.length) return

    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      if (length < 8 || bytes[cursor + 2] !== 8) return
      if (
        view.getUint16(cursor + 3) !== height ||
        view.getUint16(cursor + 5) !== width ||
        bytes[cursor + 7] !== channels
      )
        return
      foundFrame = true
    }
    if (marker === 0xda) {
      if (!foundFrame) return
      parts.push(bytes.subarray(partStart))
      return new Blob(parts, { type: "image/jpeg" })
    }
    cursor += length
    if (marker === 0xe1) {
      parts.push(bytes.subarray(partStart, start))
      partStart = cursor
    }
  }
  return undefined
}
