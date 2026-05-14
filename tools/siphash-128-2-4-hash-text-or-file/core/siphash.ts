const MASK_64 = 0xffffffffffffffffn
const KEY_LENGTH_BYTES = 16
const WORD_LENGTH_BYTES = 8
const DIGEST_LENGTH_BYTES = 16

type SipHashDigest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

type SipHashKeyState =
  | Readonly<{ status: "valid"; key: Uint8Array; normalizedHex: string }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "invalid" }>

type SipHashState = [bigint, bigint, bigint, bigint]

async function hashSipHash128(source: Blob, key: Uint8Array) {
  const data = new Uint8Array(await source.arrayBuffer())

  return formatSipHashDigest(sipHash128Bytes(data, key))
}

function parseSipHashKey(input: string): SipHashKeyState {
  const trimmed = input.trim()

  if (!trimmed) {
    return { status: "empty" }
  }

  const withoutPrefix = trimmed.replace(/^0x/i, "")
  const normalizedHex = withoutPrefix.replace(/[\s:_-]/g, "").toLowerCase()

  if (
    normalizedHex.length !== KEY_LENGTH_BYTES * 2 ||
    !/^[\da-f]+$/.test(normalizedHex)
  ) {
    return { status: "invalid" }
  }

  return {
    status: "valid",
    key: hexToBytes(normalizedHex),
    normalizedHex,
  }
}

function sipHash128Bytes(data: Uint8Array, key: Uint8Array) {
  if (key.length !== KEY_LENGTH_BYTES) {
    throw new Error("SipHash-128-2-4 requires a 16-byte key.")
  }

  const k0 = readUint64LE(key, 0)
  const k1 = readUint64LE(key, 8)

  let v0 = 0x736f6d6570736575n ^ k0
  let v1 = 0x646f72616e646f6dn ^ k1
  let v2 = 0x6c7967656e657261n ^ k0
  let v3 = 0x7465646279746573n ^ k1

  const lastFullBlock = data.length - (data.length % 8)

  for (let offset = 0; offset < lastFullBlock; offset += 8) {
    const message = readUint64LE(data, offset)
    v3 ^= message

    const compressed = sipRounds([v0, v1, v2, v3], 2)
    v0 = compressed[0]
    v1 = compressed[1]
    v2 = compressed[2]
    v3 = compressed[3]

    v0 ^= message
  }

  const finalBlock = packFinalBlock(data, lastFullBlock)
  v3 ^= finalBlock

  const compressedFinal = sipRounds([v0, v1, v2, v3], 2)
  v0 = compressedFinal[0]
  v1 = compressedFinal[1]
  v2 = compressedFinal[2]
  v3 = compressedFinal[3]

  v0 ^= finalBlock
  v2 ^= 0xeen

  const firstFinalized = sipRounds([v0, v1, v2, v3], 4)
  v0 = firstFinalized[0]
  v1 = firstFinalized[1]
  v2 = firstFinalized[2]
  v3 = firstFinalized[3]

  const firstWord = (v0 ^ v1 ^ v2 ^ v3) & MASK_64

  v1 ^= 0xddn

  const secondFinalized = sipRounds([v0, v1, v2, v3], 4)
  const secondWord =
    (secondFinalized[0] ^
      secondFinalized[1] ^
      secondFinalized[2] ^
      secondFinalized[3]) &
    MASK_64

  const output = new Uint8Array(DIGEST_LENGTH_BYTES)
  output.set(writeUint64BE(firstWord), 0)
  output.set(writeUint64BE(secondWord), WORD_LENGTH_BYTES)

  return output
}

function formatSipHashDigest(bytes: Uint8Array): SipHashDigest {
  if (bytes.length !== DIGEST_LENGTH_BYTES) {
    throw new Error("SipHash-128-2-4 output must be 16 bytes.")
  }

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToBigInt(bytes).toString(),
    binary: bytesToBinary(bytes),
  }
}

function sipRound(state: SipHashState): SipHashState {
  let [v0, v1, v2, v3] = state

  v0 = add64(v0, v1)
  v1 = rotl64(v1, 13)
  v1 ^= v0
  v0 = rotl64(v0, 32)

  v2 = add64(v2, v3)
  v3 = rotl64(v3, 16)
  v3 ^= v2

  v0 = add64(v0, v3)
  v3 = rotl64(v3, 21)
  v3 ^= v0

  v2 = add64(v2, v1)
  v1 = rotl64(v1, 17)
  v1 ^= v2
  v2 = rotl64(v2, 32)

  return [v0, v1, v2, v3]
}

function sipRounds(state: SipHashState, rounds: number) {
  let result = state

  for (let index = 0; index < rounds; index += 1) {
    result = sipRound(result)
  }

  return result
}

function packFinalBlock(data: Uint8Array, start: number) {
  let block = BigInt(data.length & 0xff) << 56n

  for (let index = start; index < data.length; index += 1) {
    block |= BigInt(data[index]!) << (8n * BigInt(index - start))
  }

  return block
}

function add64(left: bigint, right: bigint) {
  return (left + right) & MASK_64
}

function rotl64(value: bigint, shift: number) {
  const width = 64n
  const offset = BigInt(shift)

  return ((value << offset) | (value >> (width - offset))) & MASK_64
}

function readUint64LE(data: Uint8Array, offset: number) {
  let value = 0n

  for (let index = 0; index < 8; index += 1) {
    value |= BigInt(data[offset + index]!) << (8n * BigInt(index))
  }

  return value
}

function writeUint64BE(value: bigint) {
  const output = new Uint8Array(WORD_LENGTH_BYTES)

  for (let index = 0; index < WORD_LENGTH_BYTES; index += 1) {
    output[WORD_LENGTH_BYTES - 1 - index] = Number(
      (value >> (8n * BigInt(index))) & 0xffn
    )
  }

  return output
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2)

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }

  return bytes
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

function bytesToBigInt(bytes: Uint8Array) {
  let value = 0n

  for (const byte of bytes) {
    value = (value << 8n) | BigInt(byte)
  }

  return value
}

function bytesToBinary(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(2).padStart(8, "0")).join(
    ""
  )
}

export { formatSipHashDigest, hashSipHash128, parseSipHashKey, sipHash128Bytes }
export type { SipHashDigest, SipHashKeyState }
