import { shake256 } from "@noble/hashes/sha3.js"

const SHAKE256_MIN_OUTPUT_LENGTH = 8
const SHAKE256_MAX_OUTPUT_LENGTH = 65536
const SHAKE256_OUTPUT_LENGTH_STEP = 8

const INVALID_SHAKE256_OUTPUT_LENGTH_ERROR =
  "SHAKE256_INVALID_OUTPUT_LENGTH_ERROR"
const INVALID_SHAKE256_OUTPUT_LENGTH_STEP_ERROR =
  "SHAKE256_INVALID_OUTPUT_LENGTH_STEP_ERROR"

type Shake256Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type Shake256HashOptions = Readonly<{
  outputLength: number
}>

async function hashShake256(source: Blob, options: Shake256HashOptions) {
  validateOutputLength(options.outputLength)

  const input = new Uint8Array(await source.arrayBuffer())
  const digest = shake256(input, {
    dkLen: options.outputLength / 8,
  })

  return formatShake256Digest(digest)
}

function formatShake256Digest(
  digest: ArrayBuffer | Uint8Array
): Shake256Digest {
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
    outputLength < SHAKE256_MIN_OUTPUT_LENGTH ||
    outputLength > SHAKE256_MAX_OUTPUT_LENGTH
  ) {
    throw new Error(INVALID_SHAKE256_OUTPUT_LENGTH_ERROR)
  }

  if (outputLength % SHAKE256_OUTPUT_LENGTH_STEP !== 0) {
    throw new Error(INVALID_SHAKE256_OUTPUT_LENGTH_STEP_ERROR)
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
  INVALID_SHAKE256_OUTPUT_LENGTH_ERROR,
  INVALID_SHAKE256_OUTPUT_LENGTH_STEP_ERROR,
  SHAKE256_MAX_OUTPUT_LENGTH,
  SHAKE256_MIN_OUTPUT_LENGTH,
  SHAKE256_OUTPUT_LENGTH_STEP,
  formatShake256Digest,
  hashShake256,
}
export type { Shake256Digest }
