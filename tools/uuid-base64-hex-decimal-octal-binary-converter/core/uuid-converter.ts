type UuidFormat = "uuid" | "base64" | "hex" | "decimal" | "octal" | "binary"

type UuidFormatValues = Record<UuidFormat, string>

type ParseUuidResult =
  | { state: "empty" }
  | { state: "invalid" }
  | { state: "valid"; bytes: Uint8Array }

type ConvertUuidResult =
  | { state: "empty"; values: UuidFormatValues }
  | { state: "invalid"; values: UuidFormatValues }
  | { state: "valid"; values: UuidFormatValues }

const UUID_FORMATS = [
  "uuid",
  "base64",
  "hex",
  "decimal",
  "octal",
  "binary",
] as const satisfies readonly UuidFormat[]
const SAMPLE_UUID = "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f"
const MAX_UUID_VALUE = (1n << 128n) - 1n
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu
const HEX_PATTERN = /^[0-9a-f]{32}$/iu
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/u

const EMPTY_VALUES: UuidFormatValues = {
  uuid: "",
  base64: "",
  hex: "",
  decimal: "",
  octal: "",
  binary: "",
}

function cloneEmptyValues(): UuidFormatValues {
  return { ...EMPTY_VALUES }
}

function stripWhitespace(value: string) {
  return value.replace(/\s+/gu, "")
}

function normalizeUuidText(value: string) {
  let normalized = value.trim().toLowerCase()

  if (normalized.startsWith("urn:uuid:")) {
    normalized = normalized.slice("urn:uuid:".length)
  }

  if (normalized.startsWith("{") && normalized.endsWith("}")) {
    normalized = normalized.slice(1, -1)
  }

  if (HEX_PATTERN.test(normalized)) {
    return [
      normalized.slice(0, 8),
      normalized.slice(8, 12),
      normalized.slice(12, 16),
      normalized.slice(16, 20),
      normalized.slice(20),
    ].join("-")
  }

  return normalized
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(16)

  for (let index = 0; index < 16; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }

  return bytes
}

function bytesToHex(bytes: Uint8Array) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

function bytesToUuid(bytes: Uint8Array) {
  const hex = bytesToHex(bytes)

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-")
}

function bytesToBigInt(bytes: Uint8Array) {
  let value = 0n

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte)
  }

  return value
}

function bigIntToBytes(value: bigint) {
  const bytes = new Uint8Array(16)
  let remaining = value

  for (let index = bytes.length - 1; index >= 0; index -= 1) {
    bytes[index] = Number(remaining & 0xffn)
    remaining >>= 8n
  }

  return bytes
}

function parseIntegerValue(value: string, radix: 2 | 8 | 10) {
  const normalized = stripWhitespace(value)
  const pattern =
    radix === 2 ? /^[01]+$/u : radix === 8 ? /^[0-7]+$/u : /^[0-9]+$/u

  if (!pattern.test(normalized)) {
    return null
  }

  const prefix = radix === 2 ? "0b" : radix === 8 ? "0o" : ""
  const integer = BigInt(`${prefix}${normalized}`)

  return integer <= MAX_UUID_VALUE ? integer : null
}

function encodeBase64Bytes(bytes: Uint8Array) {
  let binary = ""

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return globalThis.btoa(binary)
}

function decodeBase64Bytes(value: string) {
  const withoutWhitespace = stripWhitespace(value)
  const normalized = withoutWhitespace.replace(/-/gu, "+").replace(/_/gu, "/")

  if (normalized.length % 4 === 1) {
    return null
  }

  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")

  if (!BASE64_PATTERN.test(padded)) {
    return null
  }

  try {
    const binary = globalThis.atob(padded)

    if (binary.length !== 16) {
      return null
    }

    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }

    return bytes
  } catch {
    return null
  }
}

function parseUuidValue(format: UuidFormat, value: string): ParseUuidResult {
  if (value.trim() === "") {
    return { state: "empty" }
  }

  if (format === "uuid") {
    const normalized = normalizeUuidText(value)
    return UUID_PATTERN.test(normalized)
      ? { state: "valid", bytes: hexToBytes(normalized.replace(/-/gu, "")) }
      : { state: "invalid" }
  }

  if (format === "base64") {
    const bytes = decodeBase64Bytes(value)
    return bytes ? { state: "valid", bytes } : { state: "invalid" }
  }

  if (format === "hex") {
    const normalized = stripWhitespace(value).replace(/^0x/iu, "")
    return HEX_PATTERN.test(normalized)
      ? { state: "valid", bytes: hexToBytes(normalized) }
      : { state: "invalid" }
  }

  const radix = format === "binary" ? 2 : format === "octal" ? 8 : 10
  const integer = parseIntegerValue(value, radix)

  return integer === null
    ? { state: "invalid" }
    : { state: "valid", bytes: bigIntToBytes(integer) }
}

function formatUuidBytes(bytes: Uint8Array): UuidFormatValues {
  const integer = bytesToBigInt(bytes)
  const hex = bytesToHex(bytes)

  return {
    uuid: bytesToUuid(bytes),
    base64: encodeBase64Bytes(bytes),
    hex,
    decimal: integer.toString(10),
    octal: integer.toString(8),
    binary: integer.toString(2).padStart(128, "0"),
  }
}

function convertUuidValue(
  format: UuidFormat,
  value: string
): ConvertUuidResult {
  const parsed = parseUuidValue(format, value)

  if (parsed.state === "empty") {
    return { state: "empty", values: cloneEmptyValues() }
  }

  if (parsed.state === "invalid") {
    return {
      state: "invalid",
      values: { ...cloneEmptyValues(), [format]: value },
    }
  }

  return { state: "valid", values: formatUuidBytes(parsed.bytes) }
}

function createSampleUuidValues() {
  return convertUuidValue("uuid", SAMPLE_UUID).values
}

function createRandomUuidBytes(
  cryptoApi: Crypto | undefined = globalThis.crypto
) {
  if (!cryptoApi?.getRandomValues) {
    throw new Error("Web Crypto random values are unavailable")
  }

  if (typeof cryptoApi.randomUUID === "function") {
    const parsed = parseUuidValue("uuid", cryptoApi.randomUUID())

    if (parsed.state === "valid") {
      return parsed.bytes
    }
  }

  const bytes = new Uint8Array(16)
  cryptoApi.getRandomValues(bytes)
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80

  return bytes
}

function createRandomUuidValues(cryptoApi?: Crypto) {
  return formatUuidBytes(createRandomUuidBytes(cryptoApi))
}

export {
  EMPTY_VALUES,
  MAX_UUID_VALUE,
  SAMPLE_UUID,
  UUID_FORMATS,
  convertUuidValue,
  createRandomUuidBytes,
  createRandomUuidValues,
  createSampleUuidValues,
  formatUuidBytes,
  parseUuidValue,
}
export type { ConvertUuidResult, ParseUuidResult, UuidFormat, UuidFormatValues }
