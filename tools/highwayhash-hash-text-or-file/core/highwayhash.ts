import { HighwayHash } from "highwayhasher"

const HIGHWAYHASH_KEY_LENGTH_BYTES = 32
const HIGHWAYHASH_OUTPUT_SIZES = [64, 128, 256] as const

const INVALID_HIGHWAYHASH_OUTPUT_SIZE_ERROR = "HIGHWAYHASH_INVALID_OUTPUT_SIZE"
const INVALID_HIGHWAYHASH_DIGEST_LENGTH_ERROR =
  "HIGHWAYHASH_INVALID_DIGEST_LENGTH"

type HighwayHashOutputSize = (typeof HIGHWAYHASH_OUTPUT_SIZES)[number]

type HighwayHashDigest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type HighwayHashKeyState =
  | Readonly<{ status: "valid"; key: Uint8Array; normalizedHex: string }>
  | Readonly<{ status: "empty"; key: undefined }>
  | Readonly<{ status: "invalid" }>

type HighwayHashOptions = Readonly<{
  outputSize: HighwayHashOutputSize
  key?: Uint8Array
}>

async function hashHighwayHash(source: Blob, options: HighwayHashOptions) {
  validateHighwayHashOutputSize(options.outputSize)
  validateHighwayHashKey(options.key)

  const hasher = await HighwayHash.load(options.key)
  const reader = source.stream().getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      hasher.append(value)
    }
  } finally {
    reader.releaseLock()
  }

  return formatHighwayHashDigest(
    normalizeHighwayHashBytes(
      finalizeHighwayHash(hasher, options.outputSize),
      options.outputSize
    )
  )
}

function parseHighwayHashKey(input: string): HighwayHashKeyState {
  const trimmed = input.trim()

  if (!trimmed) {
    return { status: "empty", key: undefined }
  }

  const withoutPrefix = trimmed.replace(/^0x/i, "")
  const normalizedHex = withoutPrefix.replace(/[\s:_-]/g, "").toLowerCase()

  if (
    normalizedHex.length !== HIGHWAYHASH_KEY_LENGTH_BYTES * 2 ||
    !/^[\da-f]+$/.test(normalizedHex)
  ) {
    return { status: "invalid" }
  }

  return {
    status: "valid",
    key: hexToBytes(normalizedHex),
    normalizedHex,
  }
}

function parseHighwayHashOutputSize(value: string | null) {
  const parsed = Number(value)

  if (isHighwayHashOutputSize(parsed)) {
    return parsed
  }

  return undefined
}

function isHighwayHashOutputSize(
  value: number
): value is HighwayHashOutputSize {
  return (HIGHWAYHASH_OUTPUT_SIZES as readonly number[]).includes(value)
}

function formatHighwayHashDigest(bytes: Uint8Array): HighwayHashDigest {
  validateDigestLength(bytes)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToDecimal(bytes),
    binary: bytesToBinary(bytes),
  }
}

function normalizeHighwayHashBytes(
  bytes: Uint8Array,
  outputSize: HighwayHashOutputSize
) {
  validateHighwayHashOutputSize(outputSize)
  validateDigestLength(bytes)

  const output = new Uint8Array(bytes.length)
  const laneCount = outputSize / 64

  for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
    const sourceLaneOffset = laneIndex * 8
    const targetLaneOffset = (laneCount - 1 - laneIndex) * 8

    for (let byteIndex = 0; byteIndex < 8; byteIndex += 1) {
      output[targetLaneOffset + byteIndex] =
        bytes[sourceLaneOffset + 7 - byteIndex]!
    }
  }

  return output
}

function finalizeHighwayHash(
  hasher: Awaited<ReturnType<typeof HighwayHash.load>>,
  outputSize: HighwayHashOutputSize
) {
  switch (outputSize) {
    case 64:
      return hasher.finalize64()
    case 128:
      return hasher.finalize128()
    case 256:
      return hasher.finalize256()
  }
}

function validateHighwayHashOutputSize(
  outputSize: number
): asserts outputSize is HighwayHashOutputSize {
  if (!isHighwayHashOutputSize(outputSize)) {
    throw new Error(INVALID_HIGHWAYHASH_OUTPUT_SIZE_ERROR)
  }
}

function validateHighwayHashKey(key: Uint8Array | undefined) {
  if (key && key.length !== HIGHWAYHASH_KEY_LENGTH_BYTES) {
    throw new Error("HighwayHash requires a 32-byte key.")
  }
}

function validateDigestLength(bytes: Uint8Array) {
  const bitLength = bytes.length * 8

  if (!isHighwayHashOutputSize(bitLength)) {
    throw new Error(INVALID_HIGHWAYHASH_DIGEST_LENGTH_ERROR)
  }
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2)

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }

  return bytes
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
  HIGHWAYHASH_OUTPUT_SIZES,
  INVALID_HIGHWAYHASH_DIGEST_LENGTH_ERROR,
  INVALID_HIGHWAYHASH_OUTPUT_SIZE_ERROR,
  formatHighwayHashDigest,
  hashHighwayHash,
  normalizeHighwayHashBytes,
  parseHighwayHashKey,
  parseHighwayHashOutputSize,
  validateHighwayHashOutputSize,
}
export type { HighwayHashDigest, HighwayHashKeyState, HighwayHashOutputSize }
