import type { JwtAlgorithm } from "./types"

type NamedCurve = "P-256" | "P-384" | "P-521"

type AlgorithmConfig =
  | Readonly<{
      family: "hmac"
      hash: AlgorithmIdentifier
      importAlgorithm: HmacImportParams
      signAlgorithm: AlgorithmIdentifier
    }>
  | Readonly<{
      family: "rsa" | "rsa-pss"
      hash: AlgorithmIdentifier
      importAlgorithm: RsaHashedImportParams
      signAlgorithm: AlgorithmIdentifier | RsaPssParams
    }>
  | Readonly<{
      family: "ecdsa"
      curve: NamedCurve
      importAlgorithm: EcKeyImportParams
      signAlgorithm: EcdsaParams
      signatureLength: number
    }>

const ALGORITHM_CONFIGS: Record<JwtAlgorithm, AlgorithmConfig> = {
  HS256: createHmacConfig("SHA-256"),
  HS384: createHmacConfig("SHA-384"),
  HS512: createHmacConfig("SHA-512"),
  RS256: createRsaConfig("RSASSA-PKCS1-v1_5", "SHA-256"),
  RS384: createRsaConfig("RSASSA-PKCS1-v1_5", "SHA-384"),
  RS512: createRsaConfig("RSASSA-PKCS1-v1_5", "SHA-512"),
  PS256: createRsaPssConfig("SHA-256", 32),
  PS384: createRsaPssConfig("SHA-384", 48),
  PS512: createRsaPssConfig("SHA-512", 64),
  ES256: createEcdsaConfig("P-256", "SHA-256", 64),
  ES384: createEcdsaConfig("P-384", "SHA-384", 96),
  ES512: createEcdsaConfig("P-521", "SHA-512", 132),
}

function createHmacConfig(hash: AlgorithmIdentifier): AlgorithmConfig {
  return {
    family: "hmac",
    hash,
    importAlgorithm: { name: "HMAC", hash },
    signAlgorithm: { name: "HMAC" },
  }
}

function createRsaConfig(
  name: "RSASSA-PKCS1-v1_5",
  hash: AlgorithmIdentifier
): AlgorithmConfig {
  return {
    family: "rsa",
    hash,
    importAlgorithm: { name, hash },
    signAlgorithm: { name },
  }
}

function createRsaPssConfig(
  hash: AlgorithmIdentifier,
  saltLength: number
): AlgorithmConfig {
  return {
    family: "rsa-pss",
    hash,
    importAlgorithm: { name: "RSA-PSS", hash },
    signAlgorithm: { name: "RSA-PSS", saltLength },
  }
}

function createEcdsaConfig(
  curve: NamedCurve,
  hash: AlgorithmIdentifier,
  signatureLength: number
): AlgorithmConfig {
  return {
    family: "ecdsa",
    curve,
    importAlgorithm: { name: "ECDSA", namedCurve: curve },
    signAlgorithm: { name: "ECDSA", hash },
    signatureLength,
  }
}

export { ALGORITHM_CONFIGS }
export type { AlgorithmConfig }
