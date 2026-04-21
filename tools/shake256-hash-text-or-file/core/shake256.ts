import { shake256 } from "@noble/hashes/sha3.js"

const MIN_OUTPUT_BITS = 8
const MAX_OUTPUT_BITS = 65536
const DEFAULT_OUTPUT_BITS = 512

type ParsedOutputBits = Readonly<{
  value: number
  isValid: boolean
}>

type Shake256Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

function parseOutputBitsInput(input: string): ParsedOutputBits {
  const trimmed = input.trim()

  if (!trimmed) {
    return { value: DEFAULT_OUTPUT_BITS, isValid: true }
  }

  if (!/^\d+$/.test(trimmed)) {
    return { value: DEFAULT_OUTPUT_BITS, isValid: false }
  }

  const value = Number(trimmed)

  if (
    !Number.isSafeInteger(value) ||
    value < MIN_OUTPUT_BITS ||
    value > MAX_OUTPUT_BITS ||
    value % 8 !== 0
  ) {
    return { value: DEFAULT_OUTPUT_BITS, isValid: false }
  }

  return { value, isValid: true }
}

async function hashShake256(source: Blob, outputBits = DEFAULT_OUTPUT_BITS) {
  const input = await source.arrayBuffer()
  const digestBytes = shake256(new Uint8Array(input), {
    dkLen: outputBits / 8,
  })
  const digest = new Uint8Array(digestBytes.length)
  digest.set(digestBytes)

  return formatShake256Digest(digest.buffer.slice(0))
}

function formatShake256Digest(digest: ArrayBuffer): Shake256Digest {
  const bytes = new Uint8Array(digest)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToDecimal(bytes),
    binary: bytesToBinary(bytes),
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
  DEFAULT_OUTPUT_BITS,
  formatShake256Digest,
  hashShake256,
  parseOutputBitsInput,
}
export type { Shake256Digest }
