import "../blake3-wasm-url"

import loadBlake3 from "blake3-wasm/browser-async"
import blake3WasmUrl from "blake3-wasm/dist/wasm/web/blake3_js_bg.wasm?url"

const BLAKE3_MIN_OUTPUT_LENGTH = 8
const BLAKE3_MAX_OUTPUT_LENGTH = 256
const BLAKE3_OUTPUT_LENGTH_STEP = 8

const INVALID_BLAKE3_KEY_BASE64_ERROR = "BLAKE3_INVALID_KEY_BASE64"
const INVALID_BLAKE3_OUTPUT_LENGTH_ERROR = "BLAKE3_INVALID_OUTPUT_LENGTH_ERROR"
const INVALID_BLAKE3_OUTPUT_LENGTH_STEP_ERROR =
  "BLAKE3_INVALID_OUTPUT_LENGTH_STEP_ERROR"

type Blake3Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type Blake3HashOptions = Readonly<{
  outputLength: number
  keyBase64?: string
}>

let blake3ModulePromise: ReturnType<typeof loadBlake3> | undefined

function getBlake3Module() {
  if (!blake3ModulePromise) {
    blake3ModulePromise = loadBlake3(blake3WasmUrl)
  }

  return blake3ModulePromise
}

async function hashBlake3(source: Blob, options: Blake3HashOptions) {
  validateOutputLength(options.outputLength)

  const input = new Uint8Array(await source.arrayBuffer())
  const key = decodeBase64Key(options.keyBase64)
  const { createHash, createKeyed } = await getBlake3Module()
  const hasher = key && key.length === 32 ? createKeyed(key) : createHash()

  hasher.update(input)

  const digest = hasher.digest({ length: options.outputLength / 8 })

  return formatBlake3Digest(digest)
}

function formatBlake3Digest(digest: ArrayBuffer | Uint8Array): Blake3Digest {
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
    outputLength < BLAKE3_MIN_OUTPUT_LENGTH ||
    outputLength > BLAKE3_MAX_OUTPUT_LENGTH
  ) {
    throw new Error(INVALID_BLAKE3_OUTPUT_LENGTH_ERROR)
  }

  if (outputLength % BLAKE3_OUTPUT_LENGTH_STEP !== 0) {
    throw new Error(INVALID_BLAKE3_OUTPUT_LENGTH_STEP_ERROR)
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
    throw new Error(INVALID_BLAKE3_KEY_BASE64_ERROR)
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
  BLAKE3_MAX_OUTPUT_LENGTH,
  BLAKE3_MIN_OUTPUT_LENGTH,
  BLAKE3_OUTPUT_LENGTH_STEP,
  INVALID_BLAKE3_KEY_BASE64_ERROR,
  INVALID_BLAKE3_OUTPUT_LENGTH_ERROR,
  INVALID_BLAKE3_OUTPUT_LENGTH_STEP_ERROR,
  formatBlake3Digest,
  hashBlake3,
}
export type { Blake3Digest }
