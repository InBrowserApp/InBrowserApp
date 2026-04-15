import RIPEMD160 from "crypto-js/ripemd160"
import WordArray from "crypto-js/lib-typedarrays"

type Ripemd160Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

async function hashRipemd160(source: Blob) {
  const input = await source.arrayBuffer()
  const wordArray = WordArray.create(input)
  const digest = RIPEMD160(wordArray)

  return formatRipemd160Digest(wordArrayToArrayBuffer(digest))
}

function formatRipemd160Digest(digest: ArrayBuffer): Ripemd160Digest {
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

function wordArrayToArrayBuffer(wordArray: {
  words: number[]
  sigBytes: number
}) {
  const bytes = new Uint8Array(wordArray.sigBytes)

  for (let index = 0; index < wordArray.sigBytes; index += 1) {
    const word = wordArray.words[index >>> 2]!
    bytes[index] = (word >>> (24 - (index % 4) * 8)) & 0xff
  }

  return bytes.buffer
}

export { formatRipemd160Digest, hashRipemd160 }
export type { Ripemd160Digest }
