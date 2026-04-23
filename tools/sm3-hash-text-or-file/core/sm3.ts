import { sm3 } from "sm-crypto"

type Sm3Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

async function hashSm3(source: Blob) {
  const input = await source.arrayBuffer()
  const digestHex = sm3(new Uint8Array(input))
  const digest = hexToBytes(digestHex)

  return formatSm3Digest(digest.buffer.slice(0))
}

function formatSm3Digest(digest: ArrayBuffer): Sm3Digest {
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

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2)

  for (let index = 0; index < bytes.length; index += 1) {
    const offset = index * 2
    bytes[index] = Number.parseInt(hex.slice(offset, offset + 2), 16)
  }

  return bytes
}

export { formatSm3Digest, hashSm3 }
export type { Sm3Digest }
