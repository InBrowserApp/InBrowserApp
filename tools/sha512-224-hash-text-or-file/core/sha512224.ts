import { sha512_224 } from "@noble/hashes/sha2.js"

type Sha512224Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

async function hashSha512224(source: Blob) {
  const input = await source.arrayBuffer()
  const digest = sha512_224(new Uint8Array(input))

  return formatSha512224Digest(digest.buffer.slice(0))
}

function formatSha512224Digest(digest: ArrayBuffer): Sha512224Digest {
  const bytes = new Uint8Array(digest)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToDecimal(bytes),
    binary: bytesToBinary(bytes),
  }
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

function bytesToDecimal(bytes: Uint8Array) {
  let value = 0n

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte)
  }

  return value.toString()
}
export { formatSha512224Digest, hashSha512224 }
export type { Sha512224Digest }
