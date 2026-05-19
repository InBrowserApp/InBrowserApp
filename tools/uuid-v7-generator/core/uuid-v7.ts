const UUID_V7_MIN_COUNT = 1
const UUID_V7_MIN_BATCH_COUNT = 2
const UUID_V7_DEFAULT_COUNT = 10
const UUID_V7_MAX_COUNT = 100
const UUID_V7_MAX_TIMESTAMP_MS = 0xffffffffffff
const UUID_V7_MAX_RAND_A = 0xfff
const UUID_V7_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu
const BYTE_HEX = Array.from({ length: 256 }, (_, value) =>
  value.toString(16).padStart(2, "0")
)

type RandomBytes = (bytes: Uint8Array) => void
type UuidV7Clock = () => number

type UuidV7GeneratorOptions = Readonly<{
  now?: UuidV7Clock
  randomBytes?: RandomBytes
}>

type UuidV7Generator = () => string

function normalizeUuidV7Count(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return UUID_V7_DEFAULT_COUNT
  }

  return Math.min(
    Math.max(Math.floor(value), UUID_V7_MIN_COUNT),
    UUID_V7_MAX_COUNT
  )
}

function normalizeUnixTimestampMs(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(Math.max(Math.floor(value), 0), UUID_V7_MAX_TIMESTAMP_MS)
}

function isValidUuidV7TimestampMs(value: number): boolean {
  if (!Number.isFinite(value)) {
    return false
  }

  const normalized = Math.floor(value)

  return normalized >= 0 && normalized <= UUID_V7_MAX_TIMESTAMP_MS
}

function fillRandomBytes(bytes: Uint8Array, randomBytes?: RandomBytes) {
  if (randomBytes) {
    randomBytes(bytes)
    return bytes
  }

  const cryptoApi = globalThis.crypto

  if (!cryptoApi?.getRandomValues) {
    throw new Error("UUID v7 generation requires crypto.getRandomValues().")
  }

  cryptoApi.getRandomValues(bytes)
  return bytes
}

function readRandA(randomBytes: Uint8Array) {
  return ((randomBytes[0]! << 8) | randomBytes[1]!) & UUID_V7_MAX_RAND_A
}

function writeTimestamp(bytes: Uint8Array, timestampMs: number) {
  let remaining = timestampMs

  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = remaining % 256
    remaining = Math.floor(remaining / 256)
  }
}

function stringifyUuidBytes(bytes: Uint8Array) {
  return [
    BYTE_HEX[bytes[0]!],
    BYTE_HEX[bytes[1]!],
    BYTE_HEX[bytes[2]!],
    BYTE_HEX[bytes[3]!],
    "-",
    BYTE_HEX[bytes[4]!],
    BYTE_HEX[bytes[5]!],
    "-",
    BYTE_HEX[bytes[6]!],
    BYTE_HEX[bytes[7]!],
    "-",
    BYTE_HEX[bytes[8]!],
    BYTE_HEX[bytes[9]!],
    "-",
    BYTE_HEX[bytes[10]!],
    BYTE_HEX[bytes[11]!],
    BYTE_HEX[bytes[12]!],
    BYTE_HEX[bytes[13]!],
    BYTE_HEX[bytes[14]!],
    BYTE_HEX[bytes[15]!],
  ].join("")
}

function createUuidV7(timestampMs: number, randA: number, random: Uint8Array) {
  const bytes = new Uint8Array(16)

  writeTimestamp(bytes, timestampMs)
  bytes[6] = 0x70 | ((randA >>> 8) & 0x0f)
  bytes[7] = randA & 0xff
  bytes[8] = (random[2]! & 0x3f) | 0x80
  bytes[9] = random[3]!
  bytes[10] = random[4]!
  bytes[11] = random[5]!
  bytes[12] = random[6]!
  bytes[13] = random[7]!
  bytes[14] = random[8]!
  bytes[15] = random[9]!

  return stringifyUuidBytes(bytes)
}

function createUuidV7Generator(
  options: UuidV7GeneratorOptions = {}
): UuidV7Generator {
  const now = options.now ?? Date.now
  let lastTimestamp = -1
  let lastRandA = -1

  return () => {
    const requestedTimestamp = normalizeUnixTimestampMs(now())
    const random = fillRandomBytes(new Uint8Array(10), options.randomBytes)
    let timestamp = Math.max(requestedTimestamp, lastTimestamp)
    let randA: number

    if (timestamp > lastTimestamp) {
      randA = readRandA(random)
    } else if (lastRandA < UUID_V7_MAX_RAND_A) {
      randA = lastRandA + 1
    } else {
      timestamp = Math.min(lastTimestamp + 1, UUID_V7_MAX_TIMESTAMP_MS)
      randA = readRandA(random)
    }

    lastTimestamp = timestamp
    lastRandA = randA

    return createUuidV7(timestamp, randA, random)
  }
}

function generateUuidV7Ids(
  count: number,
  options: UuidV7GeneratorOptions = {}
): string[] {
  const normalizedCount = normalizeUuidV7Count(count)
  const generate = createUuidV7Generator(options)

  return Array.from({ length: normalizedCount }, () => generate())
}

function isUuidV7(value: string): boolean {
  return UUID_V7_PATTERN.test(value.trim())
}

function parseUuidV7Timestamp(value: string): number | null {
  if (!isUuidV7(value)) {
    return null
  }

  return Number.parseInt(value.replaceAll("-", "").slice(0, 12), 16)
}

export {
  UUID_V7_DEFAULT_COUNT,
  UUID_V7_MAX_COUNT,
  UUID_V7_MAX_TIMESTAMP_MS,
  UUID_V7_MIN_BATCH_COUNT,
  UUID_V7_MIN_COUNT,
  createUuidV7Generator,
  generateUuidV7Ids,
  isValidUuidV7TimestampMs,
  isUuidV7,
  normalizeUnixTimestampMs,
  normalizeUuidV7Count,
  parseUuidV7Timestamp,
}
