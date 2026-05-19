const HASH_ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const

type HashAlgorithm = (typeof HASH_ALGORITHMS)[number]

type HashDigest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

function isHashAlgorithm(value: string): value is HashAlgorithm {
  return (HASH_ALGORITHMS as readonly string[]).includes(value)
}

async function hashSource(
  source: Blob,
  algorithm: HashAlgorithm,
  subtle: Pick<SubtleCrypto, "digest"> | undefined = globalThis.crypto?.subtle
) {
  if (!subtle) {
    throw new Error(`${algorithm} hashing requires Web Crypto support.`)
  }

  const input = await source.arrayBuffer()
  const digest = await subtle.digest(algorithm, input)

  return formatHashDigest(digest)
}

function formatHashDigest(digest: ArrayBuffer): HashDigest {
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

export { HASH_ALGORITHMS, formatHashDigest, hashSource, isHashAlgorithm }
export type { HashAlgorithm, HashDigest }
