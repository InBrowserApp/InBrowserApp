import { base64ToBytes, textToBytes, toArrayBuffer } from "./encoding"
import { JwtSignerError } from "./errors"

import type { AlgorithmConfig } from "./algorithms"
import type { JwtKeyFormat, JwtSignerCrypto } from "./types"

async function importSigningKey(options: {
  config: AlgorithmConfig
  key: string
  keyFormat: JwtKeyFormat
  subtle: JwtSignerCrypto
}) {
  if (options.config.family === "hmac") {
    return importHmacKey(options)
  }

  return importPrivateKey(options)
}

async function importHmacKey(options: {
  config: AlgorithmConfig
  key: string
  keyFormat: JwtKeyFormat
  subtle: JwtSignerCrypto
}) {
  if (options.keyFormat === "pem") {
    throw new JwtSignerError("errorSecretKeyFormat")
  }

  try {
    if (options.keyFormat === "jwk") {
      return await options.subtle.importKey(
        "jwk",
        parsePrivateJwk(options.key),
        options.config.importAlgorithm,
        false,
        ["sign"]
      )
    }

    return await options.subtle.importKey(
      "raw",
      textToBytes(options.key),
      options.config.importAlgorithm,
      false,
      ["sign"]
    )
  } catch (error) {
    if (error instanceof JwtSignerError) throw error
    throw new JwtSignerError(
      options.keyFormat === "jwk" ? "errorInvalidJwk" : "errorSigningFailed"
    )
  }
}

async function importPrivateKey(options: {
  config: AlgorithmConfig
  key: string
  keyFormat: JwtKeyFormat
  subtle: JwtSignerCrypto
}) {
  if (options.keyFormat === "secret") {
    throw new JwtSignerError("errorPrivateKeyFormat")
  }

  try {
    if (options.keyFormat === "jwk") {
      return await options.subtle.importKey(
        "jwk",
        parsePrivateJwk(options.key),
        options.config.importAlgorithm,
        false,
        ["sign"]
      )
    }

    return await options.subtle.importKey(
      "pkcs8",
      pemToArrayBuffer(options.key),
      options.config.importAlgorithm,
      false,
      ["sign"]
    )
  } catch (error) {
    if (error instanceof JwtSignerError) throw error
    throw new JwtSignerError(
      options.keyFormat === "jwk" ? "errorInvalidJwk" : "errorInvalidPem"
    )
  }
}

function parsePrivateJwk(input: string): JsonWebKey {
  let value: unknown
  try {
    value = JSON.parse(input)
  } catch {
    throw new JwtSignerError("errorInvalidJwk")
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new JwtSignerError("errorInvalidJwk")
  }

  const jwk = { ...(value as JsonWebKey) }
  delete jwk.alg
  delete jwk.key_ops
  jwk.ext = true
  return jwk
}

function pemToArrayBuffer(input: string): ArrayBuffer {
  const match = input.match(
    /-----BEGIN PRIVATE KEY-----([\s\S]+?)-----END PRIVATE KEY-----/
  )
  const body = match?.[1]?.replace(/\s+/g, "")

  if (!body) {
    throw new JwtSignerError("errorInvalidPem")
  }

  return toArrayBuffer(base64ToBytes(body))
}

export { importSigningKey, parsePrivateJwk, pemToArrayBuffer }
