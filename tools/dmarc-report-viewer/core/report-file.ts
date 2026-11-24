import { gunzipSync, unzipSync } from "fflate"

function xmlText(bytes: Uint8Array) {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  return new TextDecoder(encoding).decode(bytes)
}

function reportXmlFromBytes(bytes: Uint8Array) {
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    return xmlText(gunzipSync(bytes))
  }
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    const files = Object.values(
      unzipSync(bytes, {
        filter: ({ name }) =>
          !name.startsWith("__MACOSX/") && /\.xml$/i.test(name),
      })
    )
    return files.length === 1 ? xmlText(files[0]!) : null
  }
  return xmlText(bytes)
}

export { reportXmlFromBytes }
