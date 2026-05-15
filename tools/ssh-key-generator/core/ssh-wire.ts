function encodeString(value: string | Uint8Array) {
  return encodeBytes(typeof value === "string" ? textBytes(value) : value)
}

function encodeBytes(bytes: Uint8Array) {
  return concatBytes(encodeUint32(bytes.length), bytes)
}

function encodeMpint(bytes: Uint8Array) {
  let start = 0

  while (start < bytes.length - 1 && bytes[start] === 0) {
    start += 1
  }

  let normalized = bytes.slice(start)

  if ((normalized[0] ?? 0) & 0x80) {
    normalized = concatBytes(new Uint8Array([0]), normalized)
  }

  return encodeBytes(normalized)
}

function encodeUint32(value: number) {
  const bytes = new Uint8Array(4)
  new DataView(bytes.buffer).setUint32(0, value, false)
  return bytes
}

function concatBytes(...arrays: readonly Uint8Array[]) {
  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0

  for (const array of arrays) {
    result.set(array, offset)
    offset += array.length
  }

  return result
}

function addOpenSshPadding(bytes: Uint8Array) {
  const remainder = bytes.length % 8
  const paddingLength = remainder === 0 ? 0 : 8 - remainder
  const padding = new Uint8Array(paddingLength)

  for (let index = 0; index < paddingLength; index += 1) {
    padding[index] = index + 1
  }

  return concatBytes(bytes, padding)
}

function base64UrlToBytes(base64url: string) {
  const base64 = base64url.replace(/-/gu, "+").replace(/_/gu, "/")
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  )
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function wrapPem(label: string, bytes: Uint8Array) {
  const base64 = bytesToBase64(bytes)
  const lines = base64.match(/.{1,70}/gu) ?? []

  return `-----BEGIN ${label}-----\n${lines.join(
    "\n"
  )}\n-----END ${label}-----\n`
}

function textBytes(value: string) {
  return new TextEncoder().encode(value)
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}

export {
  addOpenSshPadding,
  base64UrlToBytes,
  bytesToBase64,
  concatBytes,
  encodeBytes,
  encodeMpint,
  encodeString,
  encodeUint32,
  textBytes,
  toArrayBuffer,
  wrapPem,
}
