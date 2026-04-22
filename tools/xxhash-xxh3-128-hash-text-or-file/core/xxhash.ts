import { createXXHash128 } from "hash-wasm"

type XxHashSeed = Readonly<{
  low: number
  high: number
}>

type ParsedXxHashSeed = XxHashSeed &
  Readonly<{
    isValid: boolean
  }>

type XxHashXxh3128Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

async function hashXxHashXxh3128(source: Blob, seed: XxHashSeed) {
  const hasher = await createXXHash128(seed.low, seed.high)
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

  const digestBytes = hasher.digest("binary") as Uint8Array
  const digest = new Uint8Array(digestBytes.length)
  digest.set(digestBytes)

  return formatXxHashXxh3128Digest(digest.buffer.slice(0))
}

function formatXxHashXxh3128Digest(digest: ArrayBuffer): XxHashXxh3128Digest {
  const bytes = new Uint8Array(digest)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToDecimal(bytes),
    binary: bytesToBinary(bytes),
  }
}

function parseSeedInput(input: string): ParsedXxHashSeed {
  const trimmed = input.trim()

  if (!trimmed) {
    return { low: 0, high: 0, isValid: true }
  }

  let parsed: bigint

  try {
    parsed = BigInt(trimmed)
  } catch {
    return { low: 0, high: 0, isValid: false }
  }

  const isHex = /^(0x|0X)[0-9a-fA-F]+$/.test(trimmed)
  const isDecimal = /^[0-9]+$/.test(trimmed)

  if (!isHex && !isDecimal) {
    return { low: 0, high: 0, isValid: false }
  }

  const seed = BigInt.asUintN(64, parsed)

  return {
    low: Number(seed & 0xffffffffn),
    high: Number((seed >> 32n) & 0xffffffffn),
    isValid: true,
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

export { formatXxHashXxh3128Digest, hashXxHashXxh3128, parseSeedInput }
export type { XxHashXxh3128Digest }
