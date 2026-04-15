const KSUID_EPOCH_SECONDS = 1_400_000_000
const MAX_KSUID_TIMESTAMP = 0xffff_ffff
const KSUID_LENGTH = 27
const KSUID_MAX_COUNT = 100
const KSUID_MIN_COUNT = 1

const KSUID_BYTE_LENGTH = 20
const KSUID_PAYLOAD_LENGTH = 16
const KSUID_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

function normalizeKsuidCount(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return KSUID_MIN_COUNT
  }

  return Math.min(Math.max(Math.floor(value), KSUID_MIN_COUNT), KSUID_MAX_COUNT)
}

function isValidKsuidUnixSeconds(unixSeconds: number) {
  if (!Number.isFinite(unixSeconds)) {
    return false
  }

  const offset = Math.floor(unixSeconds) - KSUID_EPOCH_SECONDS

  return offset >= 0 && offset <= MAX_KSUID_TIMESTAMP
}

function bytesToBigInt(bytes: Uint8Array) {
  let value = 0n

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte)
  }

  return value
}

function encodeBase62(value: bigint) {
  if (value === 0n) {
    const char = KSUID_ALPHABET[0]

    if (!char) {
      throw new Error("Failed to encode KSUID base62 value")
    }

    return char
  }

  let result = ""
  let current = value
  const base = 62n

  while (current > 0n) {
    const index = Number(current % base)
    const char = KSUID_ALPHABET[index]

    if (!char) {
      throw new Error("Failed to encode KSUID base62 value")
    }

    result = char + result
    current /= base
  }

  return result
}

function encodeKsuid(bytes: Uint8Array) {
  if (bytes.length !== KSUID_BYTE_LENGTH) {
    throw new Error("KSUID requires 20 bytes")
  }

  const encoded = encodeBase62(bytesToBigInt(bytes))

  return encoded.padStart(KSUID_LENGTH, KSUID_ALPHABET[0]!)
}

function createKsuidBytes(unixSeconds: number, randomBytes?: Uint8Array) {
  if (!isValidKsuidUnixSeconds(unixSeconds)) {
    throw new RangeError("KSUID timestamp out of range")
  }

  if (randomBytes && randomBytes.length !== KSUID_PAYLOAD_LENGTH) {
    throw new Error("KSUID requires 16 random bytes")
  }

  const timestamp = Math.floor(unixSeconds) - KSUID_EPOCH_SECONDS
  const timestampUint = timestamp >>> 0

  const bytes = new Uint8Array(KSUID_BYTE_LENGTH)
  bytes[0] = (timestampUint >>> 24) & 0xff
  bytes[1] = (timestampUint >>> 16) & 0xff
  bytes[2] = (timestampUint >>> 8) & 0xff
  bytes[3] = timestampUint & 0xff

  const payload =
    randomBytes ?? crypto.getRandomValues(new Uint8Array(KSUID_PAYLOAD_LENGTH))

  bytes.set(payload, 4)

  return bytes
}

function generateKsuid(unixSeconds: number, randomBytes?: Uint8Array) {
  return encodeKsuid(createKsuidBytes(unixSeconds, randomBytes))
}

function generateKsuidIds(count: number, unixSeconds: number) {
  const normalizedCount = normalizeKsuidCount(count)

  return Array.from({ length: normalizedCount }, () =>
    generateKsuid(unixSeconds)
  )
}

export {
  KSUID_EPOCH_SECONDS,
  KSUID_LENGTH,
  KSUID_MAX_COUNT,
  MAX_KSUID_TIMESTAMP,
  createKsuidBytes,
  encodeKsuid,
  generateKsuid,
  generateKsuidIds,
  isValidKsuidUnixSeconds,
  normalizeKsuidCount,
}
