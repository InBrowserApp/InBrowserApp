const UUID_V4_BYTE_LENGTH = 16
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u

type RandomBytesSource = (length: number) => Uint8Array

function getBrowserRandomBytes(length: number): Uint8Array {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Web Crypto random values are not available.")
  }

  const bytes = new Uint8Array(length)
  globalThis.crypto.getRandomValues(bytes)

  return bytes
}

function formatByte(value: number): string {
  return value.toString(16).padStart(2, "0")
}

function formatUuidV4Bytes(bytes: Uint8Array): string {
  if (bytes.length !== UUID_V4_BYTE_LENGTH) {
    throw new RangeError("UUID v4 requires exactly 16 random bytes.")
  }

  const normalized = Uint8Array.from(bytes)
  normalized[6] = (normalized[6]! & 0x0f) | 0x40
  normalized[8] = (normalized[8]! & 0x3f) | 0x80

  return [
    formatByte(normalized[0]!),
    formatByte(normalized[1]!),
    formatByte(normalized[2]!),
    formatByte(normalized[3]!),
    "-",
    formatByte(normalized[4]!),
    formatByte(normalized[5]!),
    "-",
    formatByte(normalized[6]!),
    formatByte(normalized[7]!),
    "-",
    formatByte(normalized[8]!),
    formatByte(normalized[9]!),
    "-",
    formatByte(normalized[10]!),
    formatByte(normalized[11]!),
    formatByte(normalized[12]!),
    formatByte(normalized[13]!),
    formatByte(normalized[14]!),
    formatByte(normalized[15]!),
  ].join("")
}

function generateUuidV4(
  randomBytesSource: RandomBytesSource = getBrowserRandomBytes
) {
  return formatUuidV4Bytes(randomBytesSource(UUID_V4_BYTE_LENGTH))
}

function isCanonicalUuidV4(value: string): boolean {
  return UUID_V4_REGEX.test(value)
}

export {
  UUID_V4_BYTE_LENGTH,
  formatUuidV4Bytes,
  generateUuidV4,
  isCanonicalUuidV4,
}
