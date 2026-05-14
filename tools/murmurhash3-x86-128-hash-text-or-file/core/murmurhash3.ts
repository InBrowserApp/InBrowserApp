import murmurHash3 from "murmurhash3js-revisited"

type MurmurHash3Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type ParsedMurmurHash3Seed = Readonly<{
  value: number
  isValid: boolean
}>

const DEFAULT_SEED = {
  value: 0,
  isValid: true,
} as const satisfies ParsedMurmurHash3Seed

async function hashMurmurHash3(
  source: Blob,
  seed: number = DEFAULT_SEED.value
) {
  const bytes = new Uint8Array(await source.arrayBuffer())
  const hash = murmurHash3.x86.hash128(bytes, seed)

  return formatMurmurHash3Digest(hash)
}

function parseMurmurHash3Seed(input: string): ParsedMurmurHash3Seed {
  const trimmed = input.trim()

  if (!trimmed) {
    return DEFAULT_SEED
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

  return {
    value: Number(BigInt.asUintN(32, parsed)),
    isValid: true,
  }
}

function formatMurmurHash3Digest(hex: string): MurmurHash3Digest {
  const bytes = hexToBytes(hex)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToBigInt(bytes).toString(),
    binary: bytesToBinary(bytes),
  }
}

function hexToBytes(hex: string) {
  const normalized = hex.length % 2 === 0 ? hex : `0${hex}`
  const bytes = new Uint8Array(normalized.length / 2)

  for (let index = 0; index < normalized.length; index += 2) {
    bytes[index / 2] = Number.parseInt(normalized.slice(index, index + 2), 16)
  }

  return bytes
}

function bytesToBigInt(bytes: Uint8Array) {
  let value = 0n

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte)
  }

  return value
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

export { formatMurmurHash3Digest, hashMurmurHash3, parseMurmurHash3Seed }
export type { MurmurHash3Digest }
