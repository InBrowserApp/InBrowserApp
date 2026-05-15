import { CsrGeneratorError } from "./errors"
import { base64UrlToBytes, formatKeyAlgorithmLabel } from "./labels"
import { parsePrivateKeyPem } from "./pem"
import { EC_CURVE_HASH } from "./types"
import type {
  CsrCreateInput,
  GeneratedKeyResult,
  ImportedKeyAlgorithm,
  ImportedKeyResult,
  ParsedPemKey,
} from "./types"

type ImportAlgorithm = Algorithm | RsaHashedImportParams | EcKeyImportParams

function ensureCryptoProvider(cryptoProvider?: Crypto): Crypto {
  if (!cryptoProvider?.subtle) {
    throw new CsrGeneratorError("errorWebCryptoUnavailable")
  }

  return cryptoProvider
}

function ensureKeyPair(keys: CryptoKey | CryptoKeyPair): CryptoKeyPair {
  if ("privateKey" in keys && "publicKey" in keys) {
    return keys
  }

  throw new CsrGeneratorError("errorUnsupportedKeyType")
}

async function createKeyResult(
  input: CsrCreateInput,
  cryptoProvider: Crypto
): Promise<GeneratedKeyResult | ImportedKeyResult> {
  return input.keySource === "generate"
    ? generateKeyPair(input, cryptoProvider)
    : importKeyPair(input, cryptoProvider)
}

async function generateKeyPair(
  input: CsrCreateInput,
  cryptoProvider: Crypto
): Promise<GeneratedKeyResult> {
  if (input.algorithm === "rsa") {
    const signingAlgorithm = {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: input.rsaHash },
    }
    const keys = await cryptoProvider.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: input.rsaKeySize,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: input.rsaHash },
      },
      true,
      ["sign", "verify"]
    )

    return {
      keys: ensureKeyPair(keys),
      signingAlgorithm,
      keyAlgorithmLabel: formatKeyAlgorithmLabel({
        algorithm: "rsa",
        rsaKeySize: input.rsaKeySize,
        rsaHash: input.rsaHash,
      }),
    }
  }

  if (input.algorithm === "ecdsa") {
    const hash = EC_CURVE_HASH[input.ecCurve]
    const signingAlgorithm = {
      name: "ECDSA",
      hash: { name: hash },
    }
    const keys = await cryptoProvider.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: input.ecCurve,
      },
      true,
      ["sign", "verify"]
    )

    return {
      keys: ensureKeyPair(keys),
      signingAlgorithm,
      keyAlgorithmLabel: formatKeyAlgorithmLabel({
        algorithm: "ecdsa",
        ecCurve: input.ecCurve,
      }),
    }
  }

  throw new CsrGeneratorError("errorUnsupportedKeyType")
}

async function importKeyPair(
  input: CsrCreateInput,
  cryptoProvider: Crypto
): Promise<ImportedKeyResult> {
  if (!input.keyPem.trim()) {
    throw new CsrGeneratorError("errorMissingPrivateKey")
  }

  const parsed = parsePrivateKeyPem(input.keyPem)
  const privateKey = await importPrivateKey(parsed, input, cryptoProvider)
  const { publicKey, publicJwk } = await derivePublicKey(
    privateKey,
    cryptoProvider
  )

  return {
    keys: { privateKey, publicKey },
    signingAlgorithm: getSigningAlgorithm(parsed.algorithm, input),
    keyAlgorithmLabel: formatKeyLabelFromJwk(
      parsed.algorithm,
      publicJwk,
      input.rsaHash
    ),
  }
}

async function importPrivateKey(
  parsed: ParsedPemKey,
  input: CsrCreateInput,
  cryptoProvider: Crypto
): Promise<CryptoKey> {
  return cryptoProvider.subtle.importKey(
    "pkcs8",
    parsed.pkcs8,
    getImportAlgorithm(parsed.algorithm, input),
    true,
    ["sign"]
  )
}

function getImportAlgorithm(
  algorithm: ImportedKeyAlgorithm,
  input: CsrCreateInput
): ImportAlgorithm {
  if (algorithm.type === "rsa") {
    return { name: "RSASSA-PKCS1-v1_5", hash: { name: input.rsaHash } }
  }

  return { name: "ECDSA", namedCurve: algorithm.curve }
}

function getSigningAlgorithm(
  algorithm: ImportedKeyAlgorithm,
  input: CsrCreateInput
): Algorithm | EcdsaParams {
  if (algorithm.type === "rsa") {
    return { name: "RSASSA-PKCS1-v1_5", hash: { name: input.rsaHash } }
  }

  return { name: "ECDSA", hash: { name: EC_CURVE_HASH[algorithm.curve] } }
}

async function derivePublicKey(
  privateKey: CryptoKey,
  cryptoProvider: Crypto
): Promise<{ publicKey: CryptoKey; publicJwk: JsonWebKey }> {
  const jwk = await cryptoProvider.subtle.exportKey("jwk", privateKey)
  const publicJwk = toPublicJwk(jwk)
  const publicKey = await cryptoProvider.subtle.importKey(
    "jwk",
    publicJwk,
    privateKey.algorithm as Algorithm,
    true,
    ["verify"]
  )

  return { publicKey, publicJwk }
}

function toPublicJwk(jwk: JsonWebKey): JsonWebKey {
  const publicJwk: JsonWebKey = {
    ...jwk,
    d: undefined,
    p: undefined,
    q: undefined,
    dp: undefined,
    dq: undefined,
    qi: undefined,
    oth: undefined,
    key_ops: ["verify"],
    ext: true,
  }

  delete publicJwk.d
  delete publicJwk.p
  delete publicJwk.q
  delete publicJwk.dp
  delete publicJwk.dq
  delete publicJwk.qi
  delete publicJwk.oth

  return publicJwk
}

function formatKeyLabelFromJwk(
  algorithm: ImportedKeyAlgorithm,
  jwk: JsonWebKey,
  rsaHash: CsrCreateInput["rsaHash"]
): string {
  if (algorithm.type === "rsa") {
    return formatKeyAlgorithmLabel({
      algorithm: "rsa",
      rsaKeySize: jwk.n ? base64UrlToBytes(jwk.n).length * 8 : undefined,
      rsaHash,
    })
  }

  return formatKeyAlgorithmLabel({
    algorithm: "ecdsa",
    ecCurve: algorithm.curve,
  })
}

export {
  createKeyResult,
  ensureCryptoProvider,
  ensureKeyPair,
  formatKeyLabelFromJwk,
  getImportAlgorithm,
  getSigningAlgorithm,
}
