import { createXXHash3 } from "hash-wasm"

type XxHashDigest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type XxHashSeed = Readonly<{
  low: number
  high: number
}>

type ParsedXxHashSeed = XxHashSeed &
  Readonly<{
    isValid: boolean
  }>

const DEFAULT_SEED = {
  low: 0,
  high: 0,
} as const satisfies XxHashSeed

async function hashXxHash(source: Blob, seed: XxHashSeed = DEFAULT_SEED) {
  const hasher = await createXXHash3(seed.low, seed.high)
  const reader = source.stream().getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      hasher.update(value)
    }
  } finally {
    reader.releaseLock()
  }

  const digest = hasher.digest("binary") as Uint8Array
  const bytes = new Uint8Array(digest.length)
  bytes.set(digest)

  return formatXxHashDigest(bytes.buffer.slice(0))
}

function parseXxHashSeed(input: string): ParsedXxHashSeed {
  const trimmed = input.trim()

  if (!trimmed) {
    return {
      ...DEFAULT_SEED,
      isValid: true,
    }
  }

  let parsed: bigint

  try {
    parsed = BigInt(trimmed)
  } catch {
    return {
      ...DEFAULT_SEED,
      isValid: false,
    }
  }

  const isHex = /^(0x|0X)[0-9a-fA-F]+$/.test(trimmed)
  const isDecimal = /^[0-9]+$/.test(trimmed)

  if (!isHex && !isDecimal) {
    return {
      ...DEFAULT_SEED,
      isValid: false,
    }
  }

  const seed = BigInt.asUintN(64, parsed)

  return {
    low: Number(seed & 0xffffffffn),
    high: Number((seed >> 32n) & 0xffffffffn),
    isValid: true,
  }
}

function formatXxHashDigest(digest: ArrayBuffer): XxHashDigest {
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

export { formatXxHashDigest, hashXxHash, parseXxHashSeed }
export type { XxHashDigest }
