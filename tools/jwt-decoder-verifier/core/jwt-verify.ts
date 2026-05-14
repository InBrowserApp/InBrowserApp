import { decodeBase64, getUtf8Bytes, toArrayBuffer } from "./jwt-base64"
import {
  JwtVerifyError,
  isJsonObject,
  isJwtAlgorithm,
  type AlgorithmSelection,
  type DecodedJwt,
  type JwtAlgorithm,
  type JwtVerificationResult,
} from "./jwt-types"

const HASH_BY_ALGORITHM: Record<JwtAlgorithm, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
  RS256: "SHA-256",
  RS384: "SHA-384",
  RS512: "SHA-512",
  PS256: "SHA-256",
  PS384: "SHA-384",
  PS512: "SHA-512",
  ES256: "SHA-256",
  ES384: "SHA-384",
  ES512: "SHA-512",
}

const ECDSA_CURVE_BY_ALGORITHM: Partial<Record<JwtAlgorithm, string>> = {
  ES256: "P-256",
  ES384: "P-384",
  ES512: "P-521",
}

const RSA_PSS_SALT_LENGTH: Partial<Record<JwtAlgorithm, number>> = {
  PS256: 32,
  PS384: 48,
  PS512: 64,
}

type VerificationKey =
  | Readonly<{ format: "jwk"; jwk: JsonWebKey }>
  | Readonly<{ format: "spki"; bytes: Uint8Array }>

async function verifyJwtSignature({
  algorithm,
  decoded,
  key,
}: Readonly<{
  algorithm: AlgorithmSelection
  decoded: DecodedJwt
  key: string
}>): Promise<JwtVerificationResult> {
  const selectedAlgorithm = resolveAlgorithm(algorithm, decoded.algorithm)

  if (!selectedAlgorithm) {
    return { status: "error", code: "missing-algorithm" }
  }

  if (!isJwtAlgorithm(selectedAlgorithm)) {
    return {
      status: "error",
      code: "unsupported-algorithm",
      algorithm: selectedAlgorithm,
    }
  }

  if (decoded.algorithm !== selectedAlgorithm) {
    return {
      status: "error",
      code: "algorithm-mismatch",
      algorithm: selectedAlgorithm,
    }
  }

  if (key.trim() === "") {
    return {
      status: "error",
      code: "key-required",
      algorithm: selectedAlgorithm,
    }
  }

  try {
    const verified = await verifyWithWebCrypto(decoded, selectedAlgorithm, key)

    if (!verified) {
      return {
        status: "failed",
        code: "signature-invalid",
        algorithm: selectedAlgorithm,
      }
    }

    return { status: "verified", algorithm: selectedAlgorithm }
  } catch (error) {
    if (error instanceof JwtVerifyError) {
      return {
        status: "error",
        code: error.code,
        algorithm: selectedAlgorithm,
      }
    }

    return {
      status: "error",
      code: "key-import-failed",
      algorithm: selectedAlgorithm,
    }
  }
}

function resolveAlgorithm(
  selected: AlgorithmSelection,
  headerAlgorithm: string | null
): string | null {
  return selected === "auto" ? headerAlgorithm : selected
}

async function verifyWithWebCrypto(
  decoded: DecodedJwt,
  algorithm: JwtAlgorithm,
  keyInput: string
): Promise<boolean> {
  const subtle = getSubtleCrypto()
  const signingInput = getUtf8Bytes(decoded.signingInput)
  const signingInputBuffer = toArrayBuffer(signingInput)
  const signature = toArrayBuffer(decoded.signature)

  if (algorithm.startsWith("HS")) {
    const cryptoKey = await importHmacKey(subtle, algorithm, keyInput)
    return subtle.verify("HMAC", cryptoKey, signature, signingInputBuffer)
  }

  const key = parseVerificationKey(keyInput, decoded.keyId)
  const cryptoKey = await importAsymmetricKey(subtle, algorithm, key)
  return subtle.verify(
    getVerifyAlgorithm(algorithm),
    cryptoKey,
    signature,
    signingInputBuffer
  )
}

async function importHmacKey(
  subtle: SubtleCrypto,
  algorithm: JwtAlgorithm,
  keyInput: string
): Promise<CryptoKey> {
  return subtle.importKey(
    "raw",
    toArrayBuffer(getUtf8Bytes(keyInput)),
    { name: "HMAC", hash: HASH_BY_ALGORITHM[algorithm] },
    false,
    ["verify"]
  )
}

async function importAsymmetricKey(
  subtle: SubtleCrypto,
  algorithm: JwtAlgorithm,
  key: VerificationKey
): Promise<CryptoKey> {
  const importAlgorithm = getImportAlgorithm(algorithm)
  const usages: KeyUsage[] = ["verify"]

  if (key.format === "jwk") {
    return subtle.importKey("jwk", key.jwk, importAlgorithm, false, usages)
  }

  return subtle.importKey(
    "spki",
    toArrayBuffer(key.bytes),
    importAlgorithm,
    false,
    usages
  )
}

function parseVerificationKey(
  input: string,
  keyId: string | null
): VerificationKey {
  const trimmed = input.trim()

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return { format: "jwk", jwk: parseJwkInput(trimmed, keyId) }
  }

  return { format: "spki", bytes: parsePublicKeyPem(trimmed) }
}

function parseJwkInput(input: string, keyId: string | null): JsonWebKey {
  let parsed: unknown

  try {
    parsed = JSON.parse(input) as unknown
  } catch {
    throw new JwtVerifyError("invalid-key-json")
  }

  if (!isJsonObject(parsed)) {
    throw new JwtVerifyError("invalid-jwk")
  }

  if (Array.isArray(parsed.keys)) {
    if (parsed.keys.length === 0) {
      throw new JwtVerifyError("empty-jwks")
    }

    const selected = selectJwksKey(parsed.keys, keyId)
    if (!isJsonObject(selected)) {
      throw new JwtVerifyError("invalid-jwk")
    }

    return selected
  }

  return parsed
}

function selectJwksKey(keys: unknown[], keyId: string | null): unknown {
  if (keyId) {
    const matchingKey = keys.find(
      (key) => isJsonObject(key) && key.kid === keyId
    )

    if (!matchingKey) {
      throw new JwtVerifyError("jwk-kid-not-found")
    }

    return matchingKey
  }

  return keys[0]
}

function parsePublicKeyPem(input: string): Uint8Array {
  const match = input.match(
    /^-----BEGIN ([A-Z0-9 ]+)-----\s*([\s\S]+?)\s*-----END \1-----$/m
  )

  if (!match) {
    throw new JwtVerifyError("unsupported-key-format")
  }

  const label = match[1] as string
  const body = match[2] as string

  if (label !== "PUBLIC KEY") {
    throw new JwtVerifyError("unsupported-pem-label")
  }

  return decodeBase64(body)
}

function getImportAlgorithm(
  algorithm: JwtAlgorithm
): EcKeyImportParams | RsaHashedImportParams {
  if (algorithm.startsWith("RS")) {
    return { name: "RSASSA-PKCS1-v1_5", hash: HASH_BY_ALGORITHM[algorithm] }
  }

  if (algorithm.startsWith("PS")) {
    return { name: "RSA-PSS", hash: HASH_BY_ALGORITHM[algorithm] }
  }

  return {
    name: "ECDSA",
    namedCurve: ECDSA_CURVE_BY_ALGORITHM[algorithm] as string,
  }
}

function getVerifyAlgorithm(
  algorithm: JwtAlgorithm
): AlgorithmIdentifier | EcdsaParams | RsaPssParams {
  if (algorithm.startsWith("PS")) {
    return { name: "RSA-PSS", saltLength: RSA_PSS_SALT_LENGTH[algorithm] }
  }

  if (algorithm.startsWith("ES")) {
    return { name: "ECDSA", hash: HASH_BY_ALGORITHM[algorithm] }
  }

  return { name: "RSASSA-PKCS1-v1_5" }
}

function getSubtleCrypto(): SubtleCrypto {
  if (!globalThis.crypto?.subtle) {
    throw new JwtVerifyError("webcrypto-unavailable")
  }

  return globalThis.crypto.subtle
}

export { verifyJwtSignature }
