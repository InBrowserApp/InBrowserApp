import { describe, expect, it, vi } from "vitest"

import {
  bytesToPem,
  encodeBase64Url,
  encodeBase64UrlText,
  getUtf8Bytes,
  toArrayBuffer,
} from "./jwt-base64"
import { parseJwt } from "./jwt-decode"
import { verifyJwtSignature } from "./jwt-verify"
import type { JwtAlgorithm } from "./jwt-types"

const RSA_PUBLIC_EXPONENT = new Uint8Array([1, 0, 1])

describe("jwt signature verification", () => {
  it("verifies and rejects HMAC signatures", async () => {
    const token = await createHmacToken("HS256", "secret", { sub: "user" })
    const decoded = parseJwt(token)

    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: "secret" })
    ).resolves.toEqual({ status: "verified", algorithm: "HS256" })
    await expect(
      verifyJwtSignature({ algorithm: "HS256", decoded, key: "wrong" })
    ).resolves.toEqual({
      status: "failed",
      code: "signature-invalid",
      algorithm: "HS256",
    })
  })

  it("reports algorithm and key errors before verification", async () => {
    const decoded = parseJwt(
      `${encodeBase64UrlText("{}")}.${encodeBase64UrlText("{}")}.`
    )
    const hsToken = await createHmacToken("HS256", "secret", {})
    const hsDecoded = parseJwt(hsToken)
    const noneDecoded = parseJwt(
      `${encodeBase64UrlText(JSON.stringify({ alg: "none" }))}.` +
        `${encodeBase64UrlText("{}")}.`
    )

    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: "secret" })
    ).resolves.toEqual({ status: "error", code: "missing-algorithm" })
    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded: noneDecoded, key: "x" })
    ).resolves.toEqual({
      status: "error",
      code: "unsupported-algorithm",
      algorithm: "none",
    })
    await expect(
      verifyJwtSignature({
        algorithm: "HS512",
        decoded: hsDecoded,
        key: "secret",
      })
    ).resolves.toEqual({
      status: "error",
      code: "algorithm-mismatch",
      algorithm: "HS512",
    })
    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded: hsDecoded, key: " " })
    ).resolves.toEqual({
      status: "error",
      code: "key-required",
      algorithm: "HS256",
    })
  })

  it("verifies RSA PKCS#1 signatures with PEM and JWKS keys", async () => {
    const { privateKey, publicKey } = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: RSA_PUBLIC_EXPONENT,
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )
    const token = await createAsymmetricToken("RS256", privateKey, {
      kid: "main",
    })
    const decoded = parseJwt(token)
    const spki = new Uint8Array(
      await crypto.subtle.exportKey("spki", publicKey)
    )
    const jwk = (await crypto.subtle.exportKey("jwk", publicKey)) as JsonWebKey
    const jwks = JSON.stringify({ keys: [{ ...jwk, kid: "main" }] })

    await expect(
      verifyJwtSignature({
        algorithm: "auto",
        decoded,
        key: bytesToPem("PUBLIC KEY", spki),
      })
    ).resolves.toEqual({ status: "verified", algorithm: "RS256" })
    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: jwks })
    ).resolves.toEqual({ status: "verified", algorithm: "RS256" })
  })

  it("verifies RSA-PSS signatures", async () => {
    const { privateKey, publicKey } = await crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: RSA_PUBLIC_EXPONENT,
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )
    const token = await createAsymmetricToken("PS256", privateKey, {})
    const decoded = parseJwt(token)
    const jwk = (await crypto.subtle.exportKey("jwk", publicKey)) as JsonWebKey

    await expect(
      verifyJwtSignature({
        algorithm: "auto",
        decoded,
        key: JSON.stringify(jwk),
      })
    ).resolves.toEqual({ status: "verified", algorithm: "PS256" })
  })

  it("verifies ECDSA signatures", async () => {
    const { privateKey, publicKey } = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    )
    const token = await createAsymmetricToken("ES256", privateKey, {})
    const decoded = parseJwt(token)
    const jwk = (await crypto.subtle.exportKey("jwk", publicKey)) as JsonWebKey

    await expect(
      verifyJwtSignature({
        algorithm: "auto",
        decoded,
        key: JSON.stringify(jwk),
      })
    ).resolves.toEqual({ status: "verified", algorithm: "ES256" })
  })

  it("reports malformed key material", async () => {
    const token = await createHmacToken("RS256", "not-used", {})
    const decoded = parseJwt(token)
    const decodedWithKid = parseJwt(
      `${encodeBase64UrlText(JSON.stringify({ alg: "RS256", kid: "main" }))}.` +
        `${encodeBase64UrlText("{}")}.AQID`
    )

    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: "{bad json" })
    ).resolves.toEqual({
      status: "error",
      code: "invalid-key-json",
      algorithm: "RS256",
    })
    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: "[]" })
    ).resolves.toEqual({
      status: "error",
      code: "invalid-jwk",
      algorithm: "RS256",
    })
    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: '{"kty":"RSA"}' })
    ).resolves.toEqual({
      status: "error",
      code: "key-import-failed",
      algorithm: "RS256",
    })
    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: '{"keys":[null]}' })
    ).resolves.toEqual({
      status: "error",
      code: "invalid-jwk",
      algorithm: "RS256",
    })
    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: '{"keys":[]}' })
    ).resolves.toEqual({
      status: "error",
      code: "empty-jwks",
      algorithm: "RS256",
    })
    await expect(
      verifyJwtSignature({
        algorithm: "auto",
        decoded: decodedWithKid,
        key: '{"keys":[{"kid":"other"}]}',
      })
    ).resolves.toEqual({
      status: "error",
      code: "jwk-kid-not-found",
      algorithm: "RS256",
    })
    await expect(
      verifyJwtSignature({ algorithm: "auto", decoded, key: "secret" })
    ).resolves.toEqual({
      status: "error",
      code: "unsupported-key-format",
      algorithm: "RS256",
    })
    await expect(
      verifyJwtSignature({
        algorithm: "auto",
        decoded,
        key: bytesToPem("PRIVATE KEY", new Uint8Array([1, 2, 3])),
      })
    ).resolves.toEqual({
      status: "error",
      code: "unsupported-pem-label",
      algorithm: "RS256",
    })
  })

  it("reports unavailable Web Crypto", async () => {
    const token = await createHmacToken("HS256", "secret", {})
    const decoded = parseJwt(token)

    vi.stubGlobal("crypto", {})
    try {
      await expect(
        verifyJwtSignature({ algorithm: "auto", decoded, key: "secret" })
      ).resolves.toEqual({
        status: "error",
        code: "webcrypto-unavailable",
        algorithm: "HS256",
      })
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

async function createHmacToken(
  algorithm: JwtAlgorithm,
  secret: string,
  payload: Record<string, unknown>
): Promise<string> {
  const signingInput = createSigningInput(algorithm, payload)
  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(getUtf8Bytes(secret)),
    { name: "HMAC", hash: getHash(algorithm) },
    false,
    ["sign"]
  )
  const signature = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      key,
      toArrayBuffer(getUtf8Bytes(signingInput))
    )
  )

  return `${signingInput}.${encodeBase64Url(signature)}`
}

async function createAsymmetricToken(
  algorithm: JwtAlgorithm,
  privateKey: CryptoKey,
  header: Record<string, unknown>
): Promise<string> {
  const signingInput = createSigningInput(algorithm, { sub: "user" }, header)
  const signature = new Uint8Array(
    await crypto.subtle.sign(
      getSignAlgorithm(algorithm),
      privateKey,
      toArrayBuffer(getUtf8Bytes(signingInput))
    )
  )

  return `${signingInput}.${encodeBase64Url(signature)}`
}

function createSigningInput(
  algorithm: JwtAlgorithm,
  payload: Record<string, unknown>,
  extraHeader: Record<string, unknown> = {}
): string {
  return [
    encodeBase64UrlText(JSON.stringify({ alg: algorithm, ...extraHeader })),
    encodeBase64UrlText(JSON.stringify(payload)),
  ].join(".")
}

function getHash(algorithm: JwtAlgorithm): string {
  return algorithm.endsWith("384")
    ? "SHA-384"
    : algorithm.endsWith("512")
      ? "SHA-512"
      : "SHA-256"
}

function getSignAlgorithm(
  algorithm: JwtAlgorithm
): AlgorithmIdentifier | EcdsaParams | RsaPssParams {
  if (algorithm.startsWith("PS")) {
    return { name: "RSA-PSS", saltLength: 32 }
  }

  if (algorithm.startsWith("ES")) {
    return { name: "ECDSA", hash: getHash(algorithm) }
  }

  return { name: "RSASSA-PKCS1-v1_5" }
}
