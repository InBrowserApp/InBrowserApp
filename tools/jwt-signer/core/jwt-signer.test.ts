import { webcrypto } from "node:crypto"

import { afterEach, describe, expect, test, vi } from "vitest"

import {
  JwtSignerError,
  bytesToBase64Url,
  isJwtAlgorithm,
  signJwt,
  type JwtSignerCrypto,
  type JwtSignerErrorCode,
} from "./jwt-signer"

const subtle = webcrypto.subtle as typeof webcrypto.subtle & JwtSignerCrypto
const encoder = new TextEncoder()

function expectJwtError(error: unknown, code: JwtSignerErrorCode) {
  expect(error).toBeInstanceOf(JwtSignerError)
  expect((error as JwtSignerError).code).toBe(code)
}

function bytesToBase64(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64")
}

function base64UrlToBytes(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const padding =
    base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4))
  return new Uint8Array(Buffer.from(`${base64}${padding}`, "base64"))
}

function textToBytes(input: string) {
  return encoder.encode(input)
}

function derToPem(label: string, der: ArrayBuffer) {
  const base64 = bytesToBase64(new Uint8Array(der))
  const lines = base64.match(/.{1,64}/g)?.join("\n") ?? base64
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`
}

function splitJwt(token: string) {
  const parts = token.split(".")
  expect(parts).toHaveLength(3)
  return parts as [string, string, string]
}

describe("signJwt", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test("signs a deterministic HS256 token", async () => {
    const result = await signJwt({
      payloadText: '{"sub":"1234567890","name":"John Doe","iat":1516239022}',
      headerText: "{}",
      algorithm: "HS256",
      key: "your-256-bit-secret",
      keyFormat: "secret",
      subtle,
    })

    expect(result.token).toBe(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ." +
        "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    )
    expect(result.headerJson).toBe('{\n  "alg": "HS256",\n  "typ": "JWT"\n}\n')
    expect(result.payloadJson).toContain('"name": "John Doe"')
    expect(result.signature).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
  })

  test("keeps custom header fields while forcing the selected alg", async () => {
    const result = await signJwt({
      payloadText: '{"sub":"user"}',
      headerText: '{"kid":"local-key","alg":"HS512"}',
      algorithm: "HS384",
      key: "secret",
      keyFormat: "secret",
      subtle,
    })

    expect(result.headerJson).toContain('"kid": "local-key"')
    expect(result.headerJson).toContain('"alg": "HS384"')
    expect(result.headerJson).not.toContain('"alg": "HS512"')
  })

  test("supports symmetric JWK input for HMAC signing", async () => {
    const result = await signJwt({
      payloadText: '{"sub":"user"}',
      algorithm: "HS256",
      key: JSON.stringify({
        kty: "oct",
        k: bytesToBase64Url(textToBytes("secret")),
        alg: "HS512",
        key_ops: ["verify"],
      }),
      keyFormat: "jwk",
      subtle,
    })

    expect(result.token).toMatch(/^eyJ/)
  })

  test("exposes algorithm helpers", () => {
    expect(isJwtAlgorithm("HS256")).toBe(true)
    expect(isJwtAlgorithm("none")).toBe(false)
  })

  test("signs RS256 tokens from a PKCS8 PEM private key", async () => {
    const keyPair = await subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )
    const pkcs8 = await subtle.exportKey("pkcs8", keyPair.privateKey)
    const result = await signJwt({
      payloadText: '{"sub":"user"}',
      algorithm: "RS256",
      key: derToPem("PRIVATE KEY", pkcs8),
      keyFormat: "pem",
      subtle,
    })
    const [header, payload, signature] = splitJwt(result.token)

    await expect(
      subtle.verify(
        { name: "RSASSA-PKCS1-v1_5" },
        keyPair.publicKey,
        base64UrlToBytes(signature),
        textToBytes(`${header}.${payload}`)
      )
    ).resolves.toBe(true)
  })

  test("signs PS256 tokens from a private JWK", async () => {
    const keyPair = await subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )
    const jwk = await subtle.exportKey("jwk", keyPair.privateKey)
    const result = await signJwt({
      payloadText: '{"sub":"user"}',
      algorithm: "PS256",
      key: JSON.stringify(jwk),
      keyFormat: "jwk",
      subtle,
    })
    const [header, payload, signature] = splitJwt(result.token)

    await expect(
      subtle.verify(
        { name: "RSA-PSS", saltLength: 32 },
        keyPair.publicKey,
        base64UrlToBytes(signature),
        textToBytes(`${header}.${payload}`)
      )
    ).resolves.toBe(true)
  })

  test("normalizes DER encoded ECDSA signatures to JOSE format", async () => {
    const raw = new Uint8Array(64)
    raw[31] = 1
    raw[63] = 2
    const der = new Uint8Array([
      0x30, 0x08, 0x02, 0x02, 0x00, 0x01, 0x02, 0x02, 0x00, 0x02,
    ])
    const fakeSubtle = {
      importKey: vi.fn(async () => ({}) as CryptoKey),
      sign: vi.fn(async () => der.buffer),
    }

    const result = await signJwt({
      payloadText: '{"sub":"user"}',
      algorithm: "ES256",
      key: '{"kty":"EC","crv":"P-256","d":"x"}',
      keyFormat: "jwk",
      subtle: fakeSubtle,
    })

    expect(result.signature).toBe(bytesToBase64Url(raw))
  })

  test.each([
    ["{", "errorInvalidPayloadJson"],
    ["[]", "errorPayloadMustBeObject"],
  ] satisfies Array<[string, JwtSignerErrorCode]>)(
    "rejects invalid payload %s",
    async (payloadText, code) => {
      await expect(
        signJwt({
          payloadText,
          algorithm: "HS256",
          key: "secret",
          keyFormat: "secret",
          subtle,
        })
      ).rejects.toSatisfy((error: unknown) => {
        expectJwtError(error, code)
        return true
      })
    }
  )

  test.each([
    ["{", "errorInvalidHeaderJson"],
    ["[]", "errorHeaderMustBeObject"],
  ] satisfies Array<[string, JwtSignerErrorCode]>)(
    "rejects invalid header %s",
    async (headerText, code) => {
      await expect(
        signJwt({
          payloadText: '{"sub":"user"}',
          headerText,
          algorithm: "HS256",
          key: "secret",
          keyFormat: "secret",
          subtle,
        })
      ).rejects.toSatisfy((error: unknown) => {
        expectJwtError(error, code)
        return true
      })
    }
  )

  test.each([
    ["", "secret", "HS256", "errorKeyRequired"],
    ["secret", "pem", "HS256", "errorSecretKeyFormat"],
    ["secret", "secret", "RS256", "errorPrivateKeyFormat"],
    ["not-json", "jwk", "HS256", "errorInvalidJwk"],
    ["not-pem", "pem", "RS256", "errorInvalidPem"],
  ] satisfies Array<
    [string, "secret" | "pem" | "jwk", "HS256" | "RS256", JwtSignerErrorCode]
  >)("rejects invalid key input", async (key, keyFormat, algorithm, code) => {
    await expect(
      signJwt({
        payloadText: '{"sub":"user"}',
        algorithm,
        key,
        keyFormat,
        subtle,
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, code)
      return true
    })
  })

  test("wraps signing failures", async () => {
    const fakeSubtle = {
      importKey: vi.fn(async () => ({}) as CryptoKey),
      sign: vi.fn(async () => {
        throw new Error("boom")
      }),
    }

    await expect(
      signJwt({
        payloadText: '{"sub":"user"}',
        algorithm: "HS256",
        key: "secret",
        keyFormat: "secret",
        subtle: fakeSubtle,
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, "errorSigningFailed")
      return true
    })
  })

  test("reports unavailable Web Crypto", async () => {
    vi.stubGlobal("crypto", {})

    await expect(
      signJwt({
        payloadText: '{"sub":"user"}',
        algorithm: "HS256",
        key: "secret",
        keyFormat: "secret",
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, "errorWebCryptoUnavailable")
      return true
    })
  })

  test("uses global Web Crypto when no subtle implementation is supplied", async () => {
    vi.stubGlobal("crypto", {
      subtle: {
        importKey: vi.fn(async () => ({}) as CryptoKey),
        sign: vi.fn(async () => new Uint8Array([1, 2, 3]).buffer),
      },
    })

    const result = await signJwt({
      payloadText: '{"sub":"user"}',
      algorithm: "HS256",
      key: "secret",
      keyFormat: "secret",
    })

    expect(result.signature).toBe("AQID")
  })
})
