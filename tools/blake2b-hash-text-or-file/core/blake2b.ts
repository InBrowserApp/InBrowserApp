import { blake2b } from "blakejs"

const BLAKE2B_MIN_OUTPUT_LENGTH = 8
const BLAKE2B_MAX_OUTPUT_LENGTH = 512
const BLAKE2B_OUTPUT_LENGTH_STEP = 8

const INVALID_BLAKE2B_KEY_BASE64_ERROR = "BLAKE2B_INVALID_KEY_BASE64"
const INVALID_BLAKE2B_OUTPUT_LENGTH_ERROR =
  "BLAKE2B_INVALID_OUTPUT_LENGTH_ERROR"
const INVALID_BLAKE2B_OUTPUT_LENGTH_STEP_ERROR =
  "BLAKE2B_INVALID_OUTPUT_LENGTH_STEP_ERROR"

type Blake2bDigest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type Blake2bHashOptions = Readonly<{
  outputLength: number
  keyBase64?: string
}>

async function hashBlake2b(source: Blob, options: Blake2bHashOptions) {
  validateOutputLength(options.outputLength)

  const input = new Uint8Array(await source.arrayBuffer())
  const key = decodeBase64Key(options.keyBase64)
  const digest = blake2b(input, key, options.outputLength / 8)

  return formatBlake2bDigest(digest)
}

function formatBlake2bDigest(digest: ArrayBuffer | Uint8Array): Blake2bDigest {
  const bytes = digest instanceof Uint8Array ? digest : new Uint8Array(digest)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToDecimal(bytes),
    binary: bytesToBinary(bytes),
  }
}

function validateOutputLength(outputLength: number) {
  if (
    !Number.isInteger(outputLength) ||
    outputLength < BLAKE2B_MIN_OUTPUT_LENGTH ||
    outputLength > BLAKE2B_MAX_OUTPUT_LENGTH
  ) {
    throw new Error(INVALID_BLAKE2B_OUTPUT_LENGTH_ERROR)
  }

  if (outputLength % BLAKE2B_OUTPUT_LENGTH_STEP !== 0) {
    throw new Error(INVALID_BLAKE2B_OUTPUT_LENGTH_STEP_ERROR)
  }
}

function decodeBase64Key(keyBase64?: string) {
  const normalizedKey = keyBase64?.replace(/\s+/g, "") ?? ""

  if (normalizedKey === "") {
    return undefined
  }

  try {
    const decoded = atob(normalizedKey)

    return Uint8Array.from(decoded, (character) => character.charCodeAt(0))
  } catch {
    throw new Error(INVALID_BLAKE2B_KEY_BASE64_ERROR)
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

function bytesToBinary(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(2).padStart(8, "0")).join(
    ""
  )
}

function bytesToDecimal(bytes: Uint8Array) {
  let value = 0n

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte)
  }

  return value.toString()
}

export {
  BLAKE2B_MAX_OUTPUT_LENGTH,
  BLAKE2B_MIN_OUTPUT_LENGTH,
  BLAKE2B_OUTPUT_LENGTH_STEP,
  INVALID_BLAKE2B_KEY_BASE64_ERROR,
  INVALID_BLAKE2B_OUTPUT_LENGTH_ERROR,
  INVALID_BLAKE2B_OUTPUT_LENGTH_STEP_ERROR,
  formatBlake2bDigest,
  hashBlake2b,
}
export type { Blake2bDigest }
