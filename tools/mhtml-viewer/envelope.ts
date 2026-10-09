// Only envelope diagnostics live here; mhtml-to-html owns MIME/resource decoding.
export function inspectEnvelope(bytes: Uint8Array) {
  const decoder = new TextDecoder("windows-1252")
  let offset = 0
  function line() {
    const end = bytes.indexOf(10, offset)
    const value = decoder
      .decode(bytes.subarray(offset, end < 0 ? bytes.length : end))
      .replace(/\r$/, "")
    offset = end < 0 ? bytes.length : end + 1
    return value
  }
  function headers() {
    const result: Record<string, string> = Object.create(null)
    let key = ""
    while (offset < bytes.length) {
      const value = line()
      if (!value) break
      if (/^[\t ]/.test(value) && key) result[key] += " " + value.trim()
      else {
        const colon = value.indexOf(":")
        if (colon > 0) {
          key = value.slice(0, colon).toLowerCase()
          result[key] = value.slice(colon + 1).trim()
        }
      }
    }
    return result
  }
  const top = headers()
  if (
    top.to ||
    top.cc ||
    top.bcc ||
    top.received ||
    (top.from?.includes("@") && !top["snapshot-content-location"])
  )
    throw new Error("email")
  const type = top["content-type"] || ""
  if (!/^multipart\/related\b/i.test(type)) throw new Error("structure")
  const boundary = type.match(/\bboundary\s*=\s*(?:"([^"]+)"|([^;\s]+))/i)
  if (!boundary) throw new Error("invalid")
  const delimiter = "--" + (boundary[1] || boundary[2])
  let closed = false
  let parts = 0
  let encoding = false
  while (offset < bytes.length) {
    // Skip resource data without creating strings for each base64/body line.
    if (bytes[offset] !== 45 || bytes[offset + 1] !== 45) {
      const end = bytes.indexOf(10, offset)
      offset = end < 0 ? bytes.length : end + 1
      continue
    }
    const value = line().trimEnd()
    if (value === delimiter + "--") {
      closed = true
      break
    }
    if (value !== delimiter) continue
    parts++
    const part = headers()
    const contentType = part["content-type"] || ""
    if (/^multipart\/|^message\//i.test(contentType))
      throw new Error("structure")
    const transfer = part["content-transfer-encoding"]
    if (
      transfer &&
      !/^(?:base64|quoted-printable|7bit|8bit|binary)$/i.test(transfer)
    )
      throw new Error("structure")
    const charset = contentType.match(/\bcharset\s*=\s*"?([^;\s"]+)/i)?.[1]
    if (charset) {
      try {
        new TextDecoder(charset)
      } catch {
        encoding = true
      }
    }
  }
  if (!parts) throw new Error("invalid")
  return { truncated: !closed, encoding }
}
