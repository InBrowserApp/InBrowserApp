interface BufferConstructorLike {
  from(data: string, encoding: "base64"): Uint8Array
  from(data: Uint8Array): { toString(encoding: "base64"): string }
}

type GlobalWithBuffer = typeof globalThis & {
  Buffer?: BufferConstructorLike
}

function decodeBase64(data: string) {
  const cleaned = data.replace(/\s+/g, "")

  if (typeof atob === "function") {
    const binary = atob(cleaned)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }

    return bytes
  }

  const BufferConstructor = (globalThis as GlobalWithBuffer).Buffer

  if (BufferConstructor) {
    return Uint8Array.from(BufferConstructor.from(cleaned, "base64"))
  }

  throw new Error("Base64 decoding is not available.")
}

function bytesToBase64(bytes: Uint8Array) {
  if (typeof btoa === "function") {
    let binary = ""

    for (const byte of bytes) {
      binary += String.fromCharCode(byte)
    }

    return btoa(binary)
  }

  const BufferConstructor = (globalThis as GlobalWithBuffer).Buffer

  if (BufferConstructor) {
    return BufferConstructor.from(bytes).toString("base64")
  }

  throw new Error("Base64 encoding is not available.")
}

export { bytesToBase64, decodeBase64 }
