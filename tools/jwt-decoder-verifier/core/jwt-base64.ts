const BASE64URL_PATTERN = /^[A-Za-z0-9_-]*$/
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/
const TEXT_DECODER = new TextDecoder()
const TEXT_ENCODER = new TextEncoder()

function decodeBase64Url(segment: string): Uint8Array {
  if (!BASE64URL_PATTERN.test(segment)) {
    throw new Error("Invalid base64url data")
  }

  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/")
  return decodeBase64(padBase64(base64))
}

function decodeBase64(base64: string): Uint8Array {
  const normalized = base64.replace(/\s/g, "")

  if (!BASE64_PATTERN.test(normalized)) {
    throw new Error("Invalid base64 data")
  }

  const binary = globalThis.atob(padBase64(normalized))
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function decodeBase64UrlText(segment: string): string {
  return TEXT_DECODER.decode(decodeBase64Url(segment))
}

function encodeBase64Url(bytes: Uint8Array): string {
  const binary = bytesToBinary(bytes)
  return globalThis
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function encodeBase64UrlText(value: string): string {
  return encodeBase64Url(TEXT_ENCODER.encode(value))
}

function getUtf8Bytes(value: string): Uint8Array {
  return TEXT_ENCODER.encode(value)
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}

function bytesToPem(label: string, bytes: Uint8Array): string {
  const base64 = globalThis.btoa(bytesToBinary(bytes))
  const lines = base64.match(/.{1,64}/g) ?? []
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`
}

function bytesToBinary(bytes: Uint8Array): string {
  const chunks: string[] = []
  const chunkSize = 8192

  for (let index = 0; index < bytes.length; index += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.slice(index, index + chunkSize)))
  }

  return chunks.join("")
}

function padBase64(base64: string): string {
  const remainder = base64.length % 4

  if (remainder === 0) return base64
  if (remainder === 2) return `${base64}==`
  if (remainder === 3) return `${base64}=`

  throw new Error("Invalid base64 length")
}

export {
  bytesToPem,
  decodeBase64,
  decodeBase64Url,
  decodeBase64UrlText,
  encodeBase64Url,
  encodeBase64UrlText,
  getUtf8Bytes,
  toArrayBuffer,
}
