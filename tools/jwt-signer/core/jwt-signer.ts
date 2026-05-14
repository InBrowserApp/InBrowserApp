import { ALGORITHM_CONFIGS } from "./algorithms"
import { base64UrlEncodeText, bytesToBase64Url, textToBytes } from "./encoding"
import { JwtSignerError, type JwtSignerErrorCode } from "./errors"
import { normalizeEcdsaSignature } from "./ecdsa"
import { importSigningKey } from "./keys"
import { JWT_ALGORITHMS } from "./types"

import type {
  JwtAlgorithm,
  JwtKeyFormat,
  JwtSignerCrypto,
  SignJwtOptions,
  SignJwtResult,
} from "./types"

async function signJwt(options: SignJwtOptions): Promise<SignJwtResult> {
  const config = ALGORITHM_CONFIGS[options.algorithm]
  const subtle = options.subtle ?? getSubtleCrypto()
  const keyValue = options.key.trim()

  if (!keyValue) {
    throw new JwtSignerError("errorKeyRequired")
  }

  const payload = parseJsonObject(
    options.payloadText,
    "errorInvalidPayloadJson",
    "errorPayloadMustBeObject"
  )
  const extraHeader = parseJsonObject(
    options.headerText?.trim() ? options.headerText : "{}",
    "errorInvalidHeaderJson",
    "errorHeaderMustBeObject"
  )
  const header = { alg: options.algorithm, typ: "JWT", ...extraHeader }
  header.alg = options.algorithm

  const headerJson = JSON.stringify(header)
  const payloadJson = JSON.stringify(payload)
  const signingInput = [
    base64UrlEncodeText(headerJson),
    base64UrlEncodeText(payloadJson),
  ].join(".")
  const cryptoKey = await importSigningKey({
    config,
    key: keyValue,
    keyFormat: options.keyFormat,
    subtle,
  })

  let signature: Uint8Array
  try {
    const rawSignature = await subtle.sign(
      config.signAlgorithm,
      cryptoKey,
      textToBytes(signingInput)
    )
    signature = new Uint8Array(rawSignature)
  } catch {
    throw new JwtSignerError("errorSigningFailed")
  }

  if (config.family === "ecdsa") {
    signature = normalizeEcdsaSignature(signature, config.signatureLength)
  }

  const encodedSignature = bytesToBase64Url(signature)

  return {
    token: `${signingInput}.${encodedSignature}`,
    headerJson: `${JSON.stringify(header, null, 2)}\n`,
    payloadJson: `${JSON.stringify(payload, null, 2)}\n`,
    signingInput,
    signature: encodedSignature,
    algorithm: options.algorithm,
  }
}

function isHmacAlgorithm(algorithm: JwtAlgorithm) {
  return ALGORITHM_CONFIGS[algorithm].family === "hmac"
}

function isJwtAlgorithm(value: string): value is JwtAlgorithm {
  return JWT_ALGORITHMS.includes(value as JwtAlgorithm)
}

function parseJsonObject(
  input: string,
  invalidCode: JwtSignerErrorCode,
  objectCode: JwtSignerErrorCode
): Record<string, unknown> {
  let value: unknown
  try {
    value = JSON.parse(input)
  } catch {
    throw new JwtSignerError(invalidCode)
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new JwtSignerError(objectCode)
  }

  return value as Record<string, unknown>
}

function getSubtleCrypto(): JwtSignerCrypto {
  if (!globalThis.crypto?.subtle) {
    throw new JwtSignerError("errorWebCryptoUnavailable")
  }
  return globalThis.crypto.subtle
}

export {
  JWT_ALGORITHMS,
  JwtSignerError,
  bytesToBase64Url,
  isHmacAlgorithm,
  isJwtAlgorithm,
  signJwt,
}
export type {
  JwtAlgorithm,
  JwtKeyFormat,
  JwtSignerCrypto,
  JwtSignerErrorCode,
  SignJwtResult,
}
