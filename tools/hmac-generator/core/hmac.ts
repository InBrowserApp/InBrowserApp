type HmacAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"

type HmacDigest = Readonly<{
  hex: string
  base64: string
}>

async function generateHmac(
  source: Blob,
  secretKey: string,
  algorithm: HmacAlgorithm,
  subtle: Pick<SubtleCrypto, "importKey" | "sign"> | undefined = globalThis
    .crypto?.subtle
) {
  if (!subtle) {
    throw new Error("HMAC generation requires Web Crypto support.")
  }

  const encoder = new TextEncoder()
  const key = await subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    {
      name: "HMAC",
      hash: algorithm,
    },
    false,
    ["sign"]
  )
  const input = await source.arrayBuffer()
  const signature = await subtle.sign("HMAC", key, input)
  const bytes = new Uint8Array(signature)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
  } satisfies HmacDigest
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

const HMAC_ALGORITHMS = [
  "SHA-256",
  "SHA-384",
  "SHA-512",
  "SHA-1",
] as const satisfies readonly HmacAlgorithm[]

export { HMAC_ALGORITHMS, generateHmac }
export type { HmacAlgorithm, HmacDigest }
