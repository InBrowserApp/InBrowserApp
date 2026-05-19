const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
const ULID_LENGTH = 26
const ULID_TIME_LENGTH = 10
const ULID_RANDOM_LENGTH = 16
const ULID_RANDOM_BYTE_LENGTH = 10
const ULID_MIN_COUNT = 1
const ULID_MIN_BATCH_COUNT = 2
const ULID_MAX_COUNT = 100
const ULID_MAX_TIMESTAMP_MS = 0xffff_ffff_ffff
const ULID_RANDOM_BITS = 80n
const ULID_RANDOM_MAX = (1n << ULID_RANDOM_BITS) - 1n

function normalizeUlidCount(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return ULID_MIN_COUNT
  }

  return Math.min(Math.max(Math.floor(value), ULID_MIN_COUNT), ULID_MAX_COUNT)
}

function normalizeUlidBatchCount(value: number | null | undefined) {
  return Math.max(ULID_MIN_BATCH_COUNT, normalizeUlidCount(value))
}

function isValidUlidTimestampMs(timestampMs: number) {
  if (!Number.isFinite(timestampMs)) {
    return false
  }

  const normalized = Math.floor(timestampMs)

  return normalized >= 0 && normalized <= ULID_MAX_TIMESTAMP_MS
}

function assertValidTimestamp(timestampMs: number) {
  if (!isValidUlidTimestampMs(timestampMs)) {
    throw new RangeError("ULID timestamp out of range")
  }
}

function encodeTime(timestampMs: number) {
  assertValidTimestamp(timestampMs)

  let value = BigInt(Math.floor(timestampMs))
  let result = ""

  for (let index = 0; index < ULID_TIME_LENGTH; index += 1) {
    result = ULID_ALPHABET[Number(value % 32n)]! + result
    value /= 32n
  }

  return result
}

function bytesToBigInt(bytes: Uint8Array) {
  let value = 0n

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte)
  }

  return value
}

function encodeRandomValue(randomValue: bigint) {
  if (randomValue < 0n || randomValue > ULID_RANDOM_MAX) {
    throw new RangeError("ULID random value out of range")
  }

  let value = randomValue
  let result = ""

  for (let index = 0; index < ULID_RANDOM_LENGTH; index += 1) {
    result = ULID_ALPHABET[Number(value % 32n)]! + result
    value /= 32n
  }

  return result
}

function randomBytesToValue(randomBytes: Uint8Array) {
  if (randomBytes.length !== ULID_RANDOM_BYTE_LENGTH) {
    throw new Error("ULID requires 10 random bytes")
  }

  return bytesToBigInt(randomBytes)
}

function createUlidFromRandomValue(timestampMs: number, randomValue: bigint) {
  return `${encodeTime(timestampMs)}${encodeRandomValue(randomValue)}`
}

function createUlid(timestampMs: number, randomBytes?: Uint8Array) {
  const randomValue = randomBytesToValue(
    randomBytes ??
      crypto.getRandomValues(new Uint8Array(ULID_RANDOM_BYTE_LENGTH))
  )

  return createUlidFromRandomValue(timestampMs, randomValue)
}

function generateUlid(timestampMs = Date.now()) {
  return createUlid(timestampMs)
}

function generateUlidBatch(
  count: number,
  timestampMs = Date.now(),
  monotonic = true
) {
  const normalizedCount = normalizeUlidCount(count)

  if (!monotonic) {
    return Array.from({ length: normalizedCount }, () =>
      generateUlid(timestampMs)
    )
  }

  const initialRandomValue = randomBytesToValue(
    crypto.getRandomValues(new Uint8Array(ULID_RANDOM_BYTE_LENGTH))
  )
  const maxStartValue = ULID_RANDOM_MAX - BigInt(normalizedCount - 1)
  const startValue =
    initialRandomValue > maxStartValue ? maxStartValue : initialRandomValue

  return Array.from({ length: normalizedCount }, (_, index) =>
    createUlidFromRandomValue(timestampMs, startValue + BigInt(index))
  )
}

function decodeUlidTimestampMs(ulid: string) {
  if (ulid.length !== ULID_LENGTH) {
    return null
  }

  let value = 0n

  for (const character of ulid.slice(0, ULID_TIME_LENGTH).toUpperCase()) {
    const index = ULID_ALPHABET.indexOf(character)

    if (index === -1) {
      return null
    }

    value = value * 32n + BigInt(index)
  }

  const timestampMs = Number(value)

  return isValidUlidTimestampMs(timestampMs) ? timestampMs : null
}

export {
  ULID_ALPHABET,
  ULID_LENGTH,
  ULID_MAX_COUNT,
  ULID_MIN_BATCH_COUNT,
  ULID_MAX_TIMESTAMP_MS,
  createUlid,
  createUlidFromRandomValue,
  decodeUlidTimestampMs,
  encodeRandomValue,
  encodeTime,
  generateUlid,
  generateUlidBatch,
  isValidUlidTimestampMs,
  normalizeUlidBatchCount,
  normalizeUlidCount,
}
