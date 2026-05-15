const UUID_V1_MAX_COUNT = 100
const UUID_V1_MIN_COUNT = 1
const UUID_V1_MAX_CLOCK_SEQUENCE = 0x3fff
const UUID_V1_NODE_BYTE_LENGTH = 6
const UUID_V1_NSECS_PER_MILLISECOND = 10_000
const UUID_EPOCH_OFFSET_MS = 12_219_292_800_000n
const HEX = Array.from({ length: 256 }, (_, value) =>
  value.toString(16).padStart(2, "0")
)

type UuidV1Options = Readonly<{
  msecs: number
  node: Uint8Array
  clockSequence: number
  nsecs?: number
}>

function normalizeUuidV1Count(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return UUID_V1_MIN_COUNT
  }

  return Math.min(
    Math.max(Math.floor(value), UUID_V1_MIN_COUNT),
    UUID_V1_MAX_COUNT
  )
}

function isValidUuidV1ClockSequence(value: number) {
  return (
    Number.isInteger(value) && value >= 0 && value <= UUID_V1_MAX_CLOCK_SEQUENCE
  )
}

function normalizeUuidV1ClockSequence(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0
  }

  return Math.min(Math.max(Math.floor(value), 0), UUID_V1_MAX_CLOCK_SEQUENCE)
}

function parseMacAddress(address: string) {
  const compact = address.trim().replace(/[:.\-\s]/gu, "")

  if (!/^[\dA-Fa-f]{12}$/u.test(compact)) {
    return null
  }

  return Uint8Array.from(
    compact.match(/.{2}/gu)!.map((part) => Number.parseInt(part, 16))
  )
}

function formatMacAddress(bytes: Uint8Array) {
  if (bytes.length !== UUID_V1_NODE_BYTE_LENGTH) {
    throw new Error("UUID v1 node must contain 6 bytes")
  }

  return Array.from(bytes, (byte) => HEX[byte]!.toUpperCase()).join(":")
}

function normalizeMacAddress(address: string) {
  const bytes = parseMacAddress(address)

  return bytes ? formatMacAddress(bytes) : null
}

function randomMacAddress() {
  const bytes = crypto.getRandomValues(new Uint8Array(UUID_V1_NODE_BYTE_LENGTH))

  bytes[0] = (bytes[0]! & 0xfe) | 0x02

  return formatMacAddress(bytes)
}

function randomUuidV1ClockSequence() {
  const bytes = crypto.getRandomValues(new Uint8Array(2))

  return ((bytes[0]! << 8) | bytes[1]!) & UUID_V1_MAX_CLOCK_SEQUENCE
}

function assertUuidV1Options(options: UuidV1Options) {
  if (!Number.isFinite(options.msecs)) {
    throw new RangeError("UUID v1 timestamp must be finite")
  }

  if (options.node.length !== UUID_V1_NODE_BYTE_LENGTH) {
    throw new Error("UUID v1 node must contain 6 bytes")
  }

  if (!isValidUuidV1ClockSequence(options.clockSequence)) {
    throw new RangeError("UUID v1 clock sequence must be between 0 and 16383")
  }

  const nsecs = options.nsecs ?? 0

  if (
    !Number.isInteger(nsecs) ||
    nsecs < 0 ||
    nsecs >= UUID_V1_NSECS_PER_MILLISECOND
  ) {
    throw new RangeError("UUID v1 nsecs must be between 0 and 9999")
  }
}

function stringifyUuidBytes(bytes: Uint8Array) {
  return [
    HEX[bytes[0]!]!,
    HEX[bytes[1]!]!,
    HEX[bytes[2]!]!,
    HEX[bytes[3]!]!,
    "-",
    HEX[bytes[4]!]!,
    HEX[bytes[5]!]!,
    "-",
    HEX[bytes[6]!]!,
    HEX[bytes[7]!]!,
    "-",
    HEX[bytes[8]!]!,
    HEX[bytes[9]!]!,
    "-",
    HEX[bytes[10]!]!,
    HEX[bytes[11]!]!,
    HEX[bytes[12]!]!,
    HEX[bytes[13]!]!,
    HEX[bytes[14]!]!,
    HEX[bytes[15]!]!,
  ].join("")
}

function createUuidV1Bytes(options: UuidV1Options) {
  assertUuidV1Options(options)

  const nsecs = options.nsecs ?? 0
  const timestamp =
    (BigInt(Math.floor(options.msecs)) + UUID_EPOCH_OFFSET_MS) *
      BigInt(UUID_V1_NSECS_PER_MILLISECOND) +
    BigInt(nsecs)
  const timeLow = Number(timestamp & 0xffff_ffffn)
  const timeMid = Number((timestamp >> 32n) & 0xffffn)
  const timeHighAndVersion = Number((timestamp >> 48n) & 0x0fffn) | 0x1000
  const bytes = new Uint8Array(16)

  bytes[0] = (timeLow >>> 24) & 0xff
  bytes[1] = (timeLow >>> 16) & 0xff
  bytes[2] = (timeLow >>> 8) & 0xff
  bytes[3] = timeLow & 0xff
  bytes[4] = (timeMid >>> 8) & 0xff
  bytes[5] = timeMid & 0xff
  bytes[6] = (timeHighAndVersion >>> 8) & 0xff
  bytes[7] = timeHighAndVersion & 0xff
  bytes[8] = ((options.clockSequence >>> 8) & 0x3f) | 0x80
  bytes[9] = options.clockSequence & 0xff
  bytes.set(options.node, 10)

  return bytes
}

function generateUuidV1(options: UuidV1Options) {
  return stringifyUuidBytes(createUuidV1Bytes(options))
}

function generateUuidV1Batch(count: number, options: UuidV1Options) {
  const normalizedCount = normalizeUuidV1Count(count)
  const startNsecs = options.nsecs ?? 0

  if (startNsecs + normalizedCount > UUID_V1_NSECS_PER_MILLISECOND) {
    throw new RangeError("UUID v1 batch exceeds one millisecond")
  }

  return Array.from({ length: normalizedCount }, (_, index) =>
    generateUuidV1({ ...options, nsecs: startNsecs + index })
  )
}

export {
  UUID_V1_MAX_CLOCK_SEQUENCE,
  UUID_V1_MAX_COUNT,
  createUuidV1Bytes,
  formatMacAddress,
  generateUuidV1,
  generateUuidV1Batch,
  isValidUuidV1ClockSequence,
  normalizeMacAddress,
  normalizeUuidV1ClockSequence,
  normalizeUuidV1Count,
  parseMacAddress,
  randomMacAddress,
  randomUuidV1ClockSequence,
}
