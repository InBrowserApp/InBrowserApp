type Adler32Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

const MOD_ADLER = 65521
const MAX_CHUNK_BYTES = 5552

async function hashAdler32(source: Blob) {
  const bytes = new Uint8Array(await source.arrayBuffer())
  return formatAdler32Digest(calculateAdler32(bytes))
}

function calculateAdler32(bytes: Uint8Array) {
  let a = 1
  let b = 0

  for (let start = 0; start < bytes.length; start += MAX_CHUNK_BYTES) {
    const end = Math.min(start + MAX_CHUNK_BYTES, bytes.length)

    for (let index = start; index < end; index += 1) {
      a += bytes[index]!
      b += a
    }

    a %= MOD_ADLER
    b %= MOD_ADLER
  }

  return ((b << 16) | a) >>> 0
}

function formatAdler32Digest(checksum: number): Adler32Digest {
  const bytes = checksumToBytes(checksum)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: checksum.toString(),
    binary: bytesToBinary(bytes),
  }
}

function checksumToBytes(checksum: number) {
  return new Uint8Array([
    (checksum >>> 24) & 0xff,
    (checksum >>> 16) & 0xff,
    (checksum >>> 8) & 0xff,
    checksum & 0xff,
  ])
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

function bytesToBinary(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(2).padStart(8, "0")).join(
    ""
  )
}

export { calculateAdler32, formatAdler32Digest, hashAdler32 }
export type { Adler32Digest }
