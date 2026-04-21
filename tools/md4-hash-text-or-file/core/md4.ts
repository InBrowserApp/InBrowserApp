import { md4 } from "hash-wasm"

type Md4Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

async function hashMd4(source: Blob) {
  const input = new Uint8Array(await source.arrayBuffer())
  const digestHex = await md4(input)

  return formatMd4Digest(hexToBytes(digestHex))
}

function formatMd4Digest(digest: ArrayBuffer | Uint8Array): Md4Digest {
  const bytes = digest instanceof Uint8Array ? digest : new Uint8Array(digest)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToDecimal(bytes),
    binary: bytesToBinary(bytes),
  }
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

export { formatMd4Digest, hashMd4 }
export type { Md4Digest }
