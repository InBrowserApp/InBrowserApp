const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const HEX_32_PATTERN = /^[0-9a-f]{32}$/
const GREGORIAN_UUID_EPOCH_OFFSET = 122192928000000000n
const BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

type UuidVariantKind = "ncs" | "rfc4122" | "microsoft" | "future"
type UuidVersionKind =
  | "nil"
  | "time"
  | "dce"
  | "md5"
  | "random"
  | "sha1"
  | "timeReordered"
  | "unixTime"
  | "custom"
  | "max"
  | "reserved"

type DecodeUuidError = "invalid-format"

type UuidTimestamp = Readonly<{
  unixMilliseconds: number
  utcIso: string
}>

type UuidNode = Readonly<{
  value: string
  isMulticast: boolean
}>

type UuidDecodeSuccess = Readonly<{
  ok: true
  input: string
  uuid: string
  hex: string
  version: number
  versionKind: UuidVersionKind
  variant: number
  variantKind: UuidVariantKind
  base64: string
  decimal: string
  octal: string
  binary: string
  algorithm: "md5" | "sha1" | null
  timestamp: UuidTimestamp | null
  clockSequence: number | null
  node: UuidNode | null
}>

type UuidDecodeFailure = Readonly<{
  ok: false
  input: string
  normalized: string
  error: DecodeUuidError
}>

type UuidDecodeResult = UuidDecodeSuccess | UuidDecodeFailure

const VERSION_KIND_BY_NUMBER: Readonly<Record<number, UuidVersionKind>> = {
  1: "time",
  2: "dce",
  3: "md5",
  4: "random",
  5: "sha1",
  6: "timeReordered",
  7: "unixTime",
  8: "custom",
}

function hyphenateHexUuid(hex: string): string {
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-")
}

function toPaddedHex(value: bigint | number, length: number): string {
  return value.toString(16).padStart(length, "0")
}

function createTimeUuid(date: Date, randomBytes: Uint8Array): string {
  if (randomBytes.length < 8) {
    throw new Error("createTimeUuid requires at least 8 random bytes")
  }

  const timestamp =
    BigInt(date.getTime()) * 10000n + GREGORIAN_UUID_EPOCH_OFFSET
  const timeLow = timestamp & 0xffffffffn
  const timeMid = (timestamp >> 32n) & 0xffffn
  const timeHigh = (timestamp >> 48n) & 0x0fffn
  const timeHighAndVersion = timeHigh | 0x1000n
  const clockSequence = ((randomBytes[0]! << 8) | randomBytes[1]!) & 0x3fff
  const clockSequenceHigh = ((clockSequence >> 8) & 0x3f) | 0x80
  const clockSequenceLow = clockSequence & 0xff
  const node = randomBytes.slice(2, 8)

  node[0] = node[0]! | 0x01

  return [
    toPaddedHex(timeLow, 8),
    toPaddedHex(timeMid, 4),
    toPaddedHex(timeHighAndVersion, 4),
    `${toPaddedHex(clockSequenceHigh, 2)}${toPaddedHex(clockSequenceLow, 2)}`,
    [...node].map((byte) => toPaddedHex(byte, 2)).join(""),
  ].join("-")
}

function normalizeUuidInput(input: string): string {
  let value = input.trim()

  if (value.toLowerCase().startsWith("urn:uuid:")) {
    value = value.slice("urn:uuid:".length)
  }

  if (value.startsWith("{") && value.endsWith("}")) {
    value = value.slice(1, -1)
  }

  value = value.toLowerCase()

  if (HEX_32_PATTERN.test(value)) {
    return hyphenateHexUuid(value)
  }

  return value
}

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(normalizeUuidInput(value))
}

function getHex(uuid: string): string {
  return uuid.replaceAll("-", "")
}

function getUuidBytes(hex: string): Uint8Array {
  return Uint8Array.from({ length: 16 }, (_, index) =>
    Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  )
}

function bytesToBase64(bytes: Uint8Array): string {
  let encoded = ""

  for (let index = 0; index < bytes.length; index += 3) {
    const byte1 = bytes[index]!
    const byte2 = bytes[index + 1]
    const byte3 = bytes[index + 2]
    const chunk = (byte1 << 16) | ((byte2 ?? 0) << 8) | (byte3 ?? 0)

    encoded += BASE64_ALPHABET[(chunk >> 18) & 0x3f]
    encoded += BASE64_ALPHABET[(chunk >> 12) & 0x3f]
    encoded += byte2 === undefined ? "=" : BASE64_ALPHABET[(chunk >> 6) & 0x3f]
    encoded += byte3 === undefined ? "=" : BASE64_ALPHABET[chunk & 0x3f]
  }

  return encoded
}

function getVariantKind(variantNibble: number): UuidVariantKind {
  if (variantNibble < 8) return "ncs"
  if (variantNibble < 12) return "rfc4122"
  if (variantNibble < 14) return "microsoft"
  return "future"
}

function getVariantNumber(variantKind: UuidVariantKind): number {
  return {
    ncs: 0,
    rfc4122: 1,
    microsoft: 2,
    future: 3,
  }[variantKind]
}

function getVersionKind(version: number, hex: string): UuidVersionKind {
  if (/^0+$/.test(hex)) return "nil"
  if (/^f+$/.test(hex)) return "max"
  return VERSION_KIND_BY_NUMBER[version] ?? "reserved"
}

function uuidTimestampToUnixMilliseconds(timestamp: bigint): number {
  return Number((timestamp - GREGORIAN_UUID_EPOCH_OFFSET) / 10000n)
}

function getTimestamp(version: number, hex: string): UuidTimestamp | null {
  let unixMilliseconds: number | null = null

  if (version === 1) {
    const timestampHex = hex.slice(13, 16) + hex.slice(8, 12) + hex.slice(0, 8)
    unixMilliseconds = uuidTimestampToUnixMilliseconds(
      BigInt(`0x${timestampHex}`)
    )
  }

  if (version === 6) {
    const timestampHex = hex.slice(0, 12) + hex.slice(13, 16)
    unixMilliseconds = uuidTimestampToUnixMilliseconds(
      BigInt(`0x${timestampHex}`)
    )
  }

  if (version === 7) {
    unixMilliseconds = Number(BigInt(`0x${hex.slice(0, 12)}`))
  }

  return unixMilliseconds === null
    ? null
    : {
        unixMilliseconds,
        utcIso: new Date(unixMilliseconds).toISOString(),
      }
}

function getClockSequence(version: number, hex: string): number | null {
  if (![1, 2, 6].includes(version)) {
    return null
  }

  const clockSequenceHigh = Number.parseInt(hex.slice(16, 18), 16) & 0x3f
  const clockSequenceLow = Number.parseInt(hex.slice(18, 20), 16)
  return (clockSequenceHigh << 8) | clockSequenceLow
}

function getNode(version: number, hex: string): UuidNode | null {
  if (![1, 6].includes(version)) {
    return null
  }

  const octets = hex.slice(20).match(/.{2}/g)!
  const firstOctet = Number.parseInt(octets[0]!, 16)

  return {
    value: octets.join(":").toUpperCase(),
    isMulticast: (firstOctet & 1) === 1,
  }
}

function getAlgorithm(version: number): "md5" | "sha1" | null {
  if (version === 3) return "md5"
  if (version === 5) return "sha1"
  return null
}

function decodeUuid(input: string): UuidDecodeResult {
  const uuid = normalizeUuidInput(input)

  if (!UUID_PATTERN.test(uuid)) {
    return {
      ok: false,
      input,
      normalized: uuid,
      error: "invalid-format",
    }
  }

  const hex = getHex(uuid)
  const bytes = getUuidBytes(hex)
  const integer = BigInt(`0x${hex}`)
  const version = Number.parseInt(hex[12]!, 16)
  const variantNibble = Number.parseInt(hex[16]!, 16)
  const variantKind = getVariantKind(variantNibble)

  return {
    ok: true,
    input,
    uuid,
    hex,
    version,
    versionKind: getVersionKind(version, hex),
    variant: getVariantNumber(variantKind),
    variantKind,
    base64: bytesToBase64(bytes),
    decimal: integer.toString(10),
    octal: integer.toString(8),
    binary: integer.toString(2).padStart(128, "0"),
    algorithm: getAlgorithm(version),
    timestamp: getTimestamp(version, hex),
    clockSequence: getClockSequence(version, hex),
    node: getNode(version, hex),
  }
}

export {
  createTimeUuid,
  decodeUuid,
  isUuid,
  normalizeUuidInput,
  type UuidDecodeResult,
}
