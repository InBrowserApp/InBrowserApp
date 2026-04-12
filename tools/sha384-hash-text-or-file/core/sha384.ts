type Sha384Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

async function hashSha384(
  source: Blob,
  subtle: Pick<SubtleCrypto, "digest"> | undefined = globalThis.crypto?.subtle
) {
  if (!subtle) {
    throw new Error("SHA-384 hashing requires Web Crypto support.")
  }

  const input = await source.arrayBuffer()
  const digest = await subtle.digest("SHA-384", input)

  return formatSha384Digest(digest)
}

function formatSha384Digest(digest: ArrayBuffer): Sha384Digest {
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

export { formatSha384Digest, hashSha384 }
export type { Sha384Digest }
