import SHA3 from "crypto-js/sha3"
import WordArray from "crypto-js/lib-typedarrays"

const KECCAK_OUTPUT_LENGTHS = [224, 256, 384, 512] as const
const INVALID_KECCAK_OUTPUT_LENGTH_ERROR =
  "Keccak output length must be 224, 256, 384, or 512 bits."

type KeccakOutputLength = (typeof KECCAK_OUTPUT_LENGTHS)[number]

type KeccakDigest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type HashKeccakOptions = Readonly<{
  outputLength?: KeccakOutputLength
}>

async function hashKeccak(source: Blob, options: HashKeccakOptions = {}) {
  const input = await source.arrayBuffer()
  const outputLength = options.outputLength ?? 256

  assertValidOutputLength(outputLength)

  const wordArray = WordArray.create(input)
  const digest = SHA3(wordArray, { outputLength })

  return formatKeccakDigest(wordArrayToArrayBuffer(digest))
}

function formatKeccakDigest(digest: ArrayBuffer): KeccakDigest {
  const bytes = new Uint8Array(digest)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToDecimal(bytes),
    binary: bytesToBinary(bytes),
  }
}

function assertValidOutputLength(
  outputLength: number
): asserts outputLength is KeccakOutputLength {
  if (!KECCAK_OUTPUT_LENGTHS.includes(outputLength as KeccakOutputLength)) {
    throw new Error(INVALID_KECCAK_OUTPUT_LENGTH_ERROR)
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

function wordArrayToArrayBuffer(wordArray: {
  words: number[]
  sigBytes: number
}) {
  const bytes = new Uint8Array(wordArray.sigBytes)

  for (let index = 0; index < wordArray.sigBytes; index += 1) {
    const word = wordArray.words[index >>> 2]!
    bytes[index] = (word >>> (24 - (index % 4) * 8)) & 0xff
  }

  return bytes.buffer
}

export {
  INVALID_KECCAK_OUTPUT_LENGTH_ERROR,
  KECCAK_OUTPUT_LENGTHS,
  formatKeccakDigest,
  hashKeccak,
}
export type { KeccakDigest, KeccakOutputLength }
