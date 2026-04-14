type Pbkdf2Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"
type SaltFormat = "utf-8" | "hex" | "base64"

type DerivedKey = Readonly<{
  hex: string
  base64: string
}>

type RangeValidation = Readonly<{
  value: number
  isValid: boolean
}>

type Pbkdf2Params = Readonly<{
  password: string
  salt: string | Blob
  saltFormat: SaltFormat
  iterations: number
  lengthBytes: number
  hash: Pbkdf2Algorithm
}>

const textEncoder = new TextEncoder()

async function derivePbkdf2(
  params: Pbkdf2Params,
  subtle:
    | Pick<SubtleCrypto, "importKey" | "deriveBits">
    | undefined = globalThis.crypto?.subtle
) {
  if (!subtle) {
    throw new Error("PBKDF2 key derivation requires Web Crypto support.")
  }

  const { password, salt, saltFormat, iterations, lengthBytes, hash } = params
  const saltBytes = await saltToBytes(salt, saltFormat)
  const keyMaterial = await subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  const derivedBits = await subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash,
    },
    keyMaterial,
    lengthBytes * 8
  )

  return formatDerivedKey(new Uint8Array(derivedBits))
}

async function saltToBytes(salt: string | Blob, format: SaltFormat) {
  if (salt instanceof Blob) {
    return new Uint8Array(await salt.arrayBuffer())
  }

  switch (format) {
    case "hex":
      return decodeHex(salt)
    case "base64":
      return decodeBase64(salt)
    default:
      return textEncoder.encode(salt)
  }
}

function formatDerivedKey(bytes: Uint8Array): DerivedKey {
  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
  }
}

function parseIntegerRangeInput(
  value: string,
  min: number,
  max: number,
  fallback: number
): RangeValidation {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return { value: fallback, isValid: true }
  }

  if (!/^\d+$/.test(trimmed)) {
    return { value: fallback, isValid: false }
  }

  const parsed = Number.parseInt(trimmed, 10)

  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    return { value: fallback, isValid: false }
  }

  return { value: parsed, isValid: true }
}

function normalizeBase64Input(value: string) {
  return value.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/")
}

function decodeBase64(value: string) {
  const normalized = normalizeBase64Input(value)

  if (!normalized) {
    return new Uint8Array()
  }

  const remainder = normalized.length % 4

  if (remainder === 1) {
    throw new Error("Invalid base64 length.")
  }

  const padded = normalized + "=".repeat((4 - remainder) % 4)
  let binary = ""

  try {
    binary = atob(padded)
  } catch {
    throw new Error("Invalid base64 input.")
  }

  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function isValidBase64(value: string) {
  try {
    decodeBase64(value)
    return true
  } catch {
    return false
  }
}

function decodeHex(value: string) {
  if (!value) {
    return new Uint8Array()
  }

  if (!/^[\da-fA-F]+$/.test(value) || value.length % 2 !== 0) {
    throw new Error("Invalid hexadecimal input.")
  }

  const bytes = new Uint8Array(value.length / 2)

  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16)
  }

  return bytes
}

function isValidHex(value: string) {
  try {
    decodeHex(value)
    return true
  } catch {
    return false
  }
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join(
    ""
  )
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""

  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }

  return btoa(binary)
}

export {
  bytesToBase64,
  bytesToHex,
  decodeBase64,
  decodeHex,
  derivePbkdf2,
  formatDerivedKey,
  isValidBase64,
  isValidHex,
  normalizeBase64Input,
  parseIntegerRangeInput,
  saltToBytes,
}
export type {
  DerivedKey,
  Pbkdf2Algorithm,
  Pbkdf2Params,
  RangeValidation,
  SaltFormat,
}
