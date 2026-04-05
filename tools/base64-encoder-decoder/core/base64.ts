function toBinaryString(bytes: Uint8Array) {
  let result = ""

  for (const byte of bytes) {
    result += String.fromCharCode(byte)
  }

  return result
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value)
  return btoa(toBinaryString(bytes))
}

function normalizeBase64Input(value: string) {
  return value.replace(/\s+/g, "")
}

function decodeBase64(value: string) {
  const normalized = normalizeBase64Input(value)
  const binary = atob(normalized)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function isValidBase64(value: string) {
  if (value.trim() === "") {
    return true
  }

  try {
    decodeBase64(value)
    return true
  } catch {
    return false
  }
}

export { decodeBase64, encodeBase64, isValidBase64, normalizeBase64Input }
