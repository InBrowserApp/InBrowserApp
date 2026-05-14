import { JwtSignerError } from "./errors"

function textToBytes(value: string) {
  return new TextEncoder().encode(value)
}

function base64UrlEncodeText(value: string) {
  return bytesToBase64Url(textToBytes(value))
}

function bytesToBase64Url(bytes: Uint8Array) {
  return bytesToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function bytesToBase64(bytes: Uint8Array) {
  if (typeof btoa === "function") {
    let binary = ""
    for (const byte of bytes) {
      binary += String.fromCharCode(byte)
    }
    return btoa(binary)
  }

  /* v8 ignore next 2 */
  const buffer = getBuffer()
  return buffer.from(bytes).toString("base64")
}

function base64ToBytes(base64: string) {
  if (typeof atob === "function") {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }
    return bytes
  }

  /* v8 ignore next */
  return Uint8Array.from(getBuffer().from(base64, "base64"))
}

function getBuffer() {
  const value = (globalThis as { Buffer?: typeof Buffer }).Buffer
  /* v8 ignore next 3 */
  if (!value) {
    throw new JwtSignerError("errorSigningFailed")
  }
  return value
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}

function concatBytes(...arrays: Uint8Array[]) {
  const length = arrays.reduce((sum, array) => sum + array.length, 0)
  const output = new Uint8Array(length)
  let offset = 0

  for (const array of arrays) {
    output.set(array, offset)
    offset += array.length
  }

  return output
}

export {
  base64ToBytes,
  base64UrlEncodeText,
  bytesToBase64Url,
  concatBytes,
  textToBytes,
  toArrayBuffer,
}
