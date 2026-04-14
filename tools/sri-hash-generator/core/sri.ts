type SriDigest = Readonly<{
  sha256: string
  sha384: string
  sha512: string
}>

async function generateSri(
  source: Blob,
  subtle: Pick<SubtleCrypto, "digest"> | undefined = globalThis.crypto?.subtle
) {
  if (!subtle) {
    throw new Error("SRI hash generation requires Web Crypto support.")
  }

  const input = await source.arrayBuffer()
  const [sha256Hash, sha384Hash, sha512Hash] = await Promise.all([
    subtle.digest("SHA-256", input),
    subtle.digest("SHA-384", input),
    subtle.digest("SHA-512", input),
  ])

  return {
    sha256: `sha256-${toBase64(sha256Hash)}`,
    sha384: `sha384-${toBase64(sha384Hash)}`,
    sha512: `sha512-${toBase64(sha512Hash)}`,
  } satisfies SriDigest
}

function toBase64(hash: ArrayBuffer) {
  const bytes = new Uint8Array(hash)
  let binary = ""

  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }

  return btoa(binary)
}

export { generateSri }
export type { SriDigest }
