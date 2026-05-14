import { cityHash64 } from "@anglinb/city-hash"

type CityHash64Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type ParsedCityHash64Seed = Readonly<{
  value: bigint | null
  isValid: boolean
}>

const DEFAULT_SEED = {
  value: null,
  isValid: true,
} as const satisfies ParsedCityHash64Seed

async function hashCityHash64(
  source: Blob,
  seed: bigint | null = DEFAULT_SEED.value
) {
  const bytes = new Uint8Array(await source.arrayBuffer())
  const checksum =
    seed === null
      ? toUint64(cityHash64(bytes))
      : cityHash64WithSeed(bytes, seed)

  return formatCityHash64Digest(checksum)
}

function cityHash64WithSeed(input: Uint8Array | string, seed: bigint) {
  const baseHash = toUint64(cityHash64(input))
  const seedValue = toUint64(seed)

  return hashLen16(toUint64(baseHash - K2), seedValue)
}

function parseCityHash64Seed(input: string): ParsedCityHash64Seed {
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
    value: toUint64(parsed),
    isValid: true,
  }
}

function formatCityHash64Digest(checksum: bigint): CityHash64Digest {
  const normalizedChecksum = toUint64(checksum)
  const bytes = checksumToBytes(normalizedChecksum)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: normalizedChecksum.toString(),
    binary: bytesToBinary(bytes),
  }
}

function checksumToBytes(checksum: bigint) {
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)

  // Match the legacy Vue implementation and keep the displayed bytes big-endian.
  view.setBigUint64(0, checksum, false)

  return new Uint8Array(buffer)
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

const K2 = 0x9ae16a3b2f90404fn
const KMUL = 0x9ddfea08eb382d69n

function hashLen16(low: bigint, high: bigint) {
  return hash128To64(low, high)
}

function hash128To64(low: bigint, high: bigint) {
  let a = toUint64((low ^ high) * KMUL)
  a = toUint64(a ^ (a >> 47n))

  let b = toUint64((high ^ a) * KMUL)
  b = toUint64(b ^ (b >> 47n))
  b = toUint64(b * KMUL)

  return b
}

function toUint64(value: bigint) {
  return BigInt.asUintN(64, value)
}

export { formatCityHash64Digest, hashCityHash64, parseCityHash64Seed }
export type { CityHash64Digest }
