export const KSUID_EPOCH_SECONDS = 1400000000
export const MAX_KSUID_TIMESTAMP = 0xffffffff
export const KSUID_LENGTH = 27

const KSUID_BYTE_LENGTH = 20
const KSUID_PAYLOAD_LENGTH = 16
const KSUID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function isValidKsuidUnixSeconds(unixSeconds: number): boolean {
  if (!Number.isFinite(unixSeconds)) return false
  const offset = Math.floor(unixSeconds) - KSUID_EPOCH_SECONDS
  return offset >= 0 && offset <= MAX_KSUID_TIMESTAMP
}

function bytesToBigInt(bytes: Uint8Array): bigint {
  let value = 0n
  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte)
  }
  return value
}

function encodeBase62(value: bigint): string {
  if (value === 0n) return KSUID_ALPHABET[0]

  let result = ''
  let current = value
  const base = 62n

  while (current > 0n) {
    const index = Number(current % base)
    const char = KSUID_ALPHABET[index]
    if (!char) {
      throw new Error('Failed to encode KSUID base62 value')
    }
    result = char + result
    current /= base
  }

  return result
}

export function encodeKsuid(bytes: Uint8Array): string {
  if (bytes.length !== KSUID_BYTE_LENGTH) {
    throw new Error('KSUID requires 20 bytes')
  }

  const encoded = encodeBase62(bytesToBigInt(bytes))
  return encoded.padStart(KSUID_LENGTH, KSUID_ALPHABET[0])
}

export function createKsuidBytes(unixSeconds: number, randomBytes?: Uint8Array): Uint8Array {
  if (!isValidKsuidUnixSeconds(unixSeconds)) {
    throw new RangeError('KSUID timestamp out of range')
  }

  if (randomBytes && randomBytes.length !== KSUID_PAYLOAD_LENGTH) {
    throw new Error('KSUID requires 16 random bytes')
  }

  const timestamp = Math.floor(unixSeconds) - KSUID_EPOCH_SECONDS
  const timestampUint = timestamp >>> 0

  const bytes = new Uint8Array(KSUID_BYTE_LENGTH)
  bytes[0] = (timestampUint >>> 24) & 0xff
  bytes[1] = (timestampUint >>> 16) & 0xff
  bytes[2] = (timestampUint >>> 8) & 0xff
  bytes[3] = timestampUint & 0xff

  const payload = randomBytes ?? crypto.getRandomValues(new Uint8Array(KSUID_PAYLOAD_LENGTH))
  bytes.set(payload, 4)

  return bytes
}

export function generateKsuid(unixSeconds: number, randomBytes?: Uint8Array): string {
  return encodeKsuid(createKsuidBytes(unixSeconds, randomBytes))
}
