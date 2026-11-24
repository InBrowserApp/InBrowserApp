import { Gunzip, unzipSync } from "fflate"

function declaredEncoding(bytes: Uint8Array) {
  const end = bytes.indexOf(0x3e)
  const header = new TextDecoder().decode(bytes.subarray(0, end + 1))
  return (
    /^<\?xml\s[^?]*\bencoding\s*=\s*["']([^"']+)["']/.exec(header)?.[1] ??
    "utf-8"
  )
}

function xmlText(bytes: Uint8Array) {
  // UTF-16 XML without a BOM starts with an encoded XML declaration.
  const signature =
    bytes.length >= 4
      ? new DataView(bytes.buffer, bytes.byteOffset, 4).getUint32(0)
      : 0
  const encoding =
    (bytes[0] === 0xff && bytes[1] === 0xfe) || signature === 0x3c003f00
      ? "utf-16le"
      : (bytes[0] === 0xfe && bytes[1] === 0xff) || signature === 0x003c003f
        ? "utf-16be"
        : declaredEncoding(bytes)
  return new TextDecoder(encoding, { fatal: true }).decode(bytes)
}

function decompressGzip(bytes: Uint8Array) {
  const chunks: Uint8Array[] = []
  let size = 0
  new Gunzip((chunk) => {
    chunks.push(chunk)
    size += chunk.length
  }).push(bytes, true)

  const xml = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    xml.set(chunk, offset)
    offset += chunk.length
  }
  return xml
}

function reportXmlFromBytes(bytes: Uint8Array) {
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    return xmlText(decompressGzip(bytes))
  }
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    let reportCount = 0
    const files = Object.values(
      unzipSync(bytes, {
        filter: ({ name }) => {
          if (name.startsWith("__MACOSX/") || !/\.xml$/i.test(name))
            return false
          reportCount++
          return reportCount === 1
        },
      })
    )
    return reportCount === 1 ? xmlText(files[0]!) : null
  }
  return xmlText(bytes)
}

export { reportXmlFromBytes }
