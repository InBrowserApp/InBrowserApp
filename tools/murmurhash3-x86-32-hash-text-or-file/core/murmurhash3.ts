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
  const checksum = (murmurHash3.x86.hash32(bytes, seed) as number) >>> 0

  return formatMurmurHash3Digest(checksum)
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

function formatMurmurHash3Digest(checksum: number): MurmurHash3Digest {
  const normalizedChecksum = checksum >>> 0
  const bytes = checksumToBytes(normalizedChecksum)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: normalizedChecksum.toString(),
    binary: bytesToBinary(bytes),
  }
}

function checksumToBytes(checksum: number) {
  const buffer = new ArrayBuffer(4)
  const view = new DataView(buffer)

  // Match the legacy Vue implementation and keep the displayed bytes big-endian.
  view.setUint32(0, checksum, false)

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

export { formatMurmurHash3Digest, hashMurmurHash3, parseMurmurHash3Seed }
export type { MurmurHash3Digest, ParsedMurmurHash3Seed }
