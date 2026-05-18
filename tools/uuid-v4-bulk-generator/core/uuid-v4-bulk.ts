const UUID_V4_BULK_DEFAULT_COUNT = 100
const UUID_V4_BULK_MIN_COUNT = 1
const UUID_V4_BULK_MAX_COUNT = 1000

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u

type UuidGenerator = () => string

function normalizeUuidV4BulkCount(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return UUID_V4_BULK_DEFAULT_COUNT
  }

  return Math.min(
    Math.max(Math.floor(value), UUID_V4_BULK_MIN_COUNT),
    UUID_V4_BULK_MAX_COUNT
  )
}

function isUuidV4(value: string): boolean {
  return UUID_V4_PATTERN.test(value)
}

function getSecureCrypto(): Crypto {
  if (
    typeof globalThis.crypto === "undefined" ||
    (typeof globalThis.crypto.randomUUID !== "function" &&
      typeof globalThis.crypto.getRandomValues !== "function")
  ) {
    throw new Error("Secure random values are unavailable in this browser.")
  }

  return globalThis.crypto
}

function formatUuidV4Bytes(bytes: Uint8Array): string {
  if (bytes.length !== 16) {
    throw new Error("UUID v4 generation requires exactly 16 random bytes.")
  }

  const normalized = Uint8Array.from(bytes)

  normalized[6] = (normalized[6]! & 0x0f) | 0x40
  normalized[8] = (normalized[8]! & 0x3f) | 0x80

  const hex = Array.from(normalized, (byte) =>
    byte.toString(16).padStart(2, "0")
  )

  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-")
}

function generateUuidV4(): string {
  const secureCrypto = getSecureCrypto()

  if (typeof secureCrypto.randomUUID === "function") {
    return secureCrypto.randomUUID()
  }

  const bytes = new Uint8Array(16)
  secureCrypto.getRandomValues(bytes)

  return formatUuidV4Bytes(bytes)
}

function generateUuidV4Batch(
  count: number,
  generator: UuidGenerator = generateUuidV4
): string[] {
  const normalizedCount = normalizeUuidV4BulkCount(count)

  return Array.from({ length: normalizedCount }, () => generator())
}

export {
  UUID_V4_BULK_DEFAULT_COUNT,
  UUID_V4_BULK_MAX_COUNT,
  UUID_V4_BULK_MIN_COUNT,
  formatUuidV4Bytes,
  generateUuidV4,
  generateUuidV4Batch,
  isUuidV4,
  normalizeUuidV4BulkCount,
}
