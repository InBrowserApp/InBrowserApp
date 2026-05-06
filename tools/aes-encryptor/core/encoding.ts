function normalizeHex(hex: string) {
  return hex.replace(/[\s:]/g, "")
}

function hexToBytes(hex: string) {
  const cleanHex = normalizeHex(hex)

  if (!/^[0-9a-f]*$/i.test(cleanHex) || cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string")
  }

  const bytes = new Uint8Array(cleanHex.length / 2)

  for (let index = 0; index < cleanHex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(cleanHex.slice(index, index + 2), 16)
  }

  return bytes
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  )
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""

  for (let index = 0; index < bytes.length; index += 0x8000) {
    const chunk = bytes.subarray(index, index + 0x8000)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

function base64ToBytes(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function bytesToArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}

export {
  base64ToBytes,
  bytesToArrayBuffer,
  bytesToBase64,
  bytesToHex,
  hexToBytes,
  normalizeHex,
}
