import { describe, expect, test, vi } from "vitest"

import { ALGORITHM_CONFIGS } from "./algorithms"
import { JwtSignerError } from "./errors"
import { importSigningKey, parsePrivateJwk, pemToArrayBuffer } from "./keys"

function expectJwtError(error: unknown, code: string) {
  expect(error).toBeInstanceOf(JwtSignerError)
  expect((error as JwtSignerError).code).toBe(code)
}

function privateKeyPem(base64 = "AQID") {
  return `-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----`
}

describe("JWT signing key import helpers", () => {
  test("sanitizes private JWK import metadata", () => {
    const jwk = parsePrivateJwk(
      JSON.stringify({
        kty: "oct",
        k: "AQID",
        alg: "HS512",
        key_ops: ["verify"],
      })
    )

    expect(jwk).toEqual({ kty: "oct", k: "AQID", ext: true })
  })

  test("rejects non-object JWK input", () => {
    for (const input of ["not-json", "[]"]) {
      expect(() => parsePrivateJwk(input)).toThrow(JwtSignerError)
    }
  })

  test("extracts DER bytes from PKCS8 PEM input", () => {
    expect([...new Uint8Array(pemToArrayBuffer(privateKeyPem()))]).toEqual([
      1, 2, 3,
    ])
  })

  test("rejects missing PEM blocks", () => {
    expect(() => pemToArrayBuffer("not pem")).toThrow(JwtSignerError)
  })

  test("wraps HMAC raw key import failures", async () => {
    const subtle = {
      importKey: vi.fn(async () => {
        throw new Error("bad key")
      }),
      sign: vi.fn(),
    }

    await expect(
      importSigningKey({
        config: ALGORITHM_CONFIGS.HS256,
        key: "secret",
        keyFormat: "secret",
        subtle,
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, "errorSigningFailed")
      return true
    })
  })

  test("wraps HMAC JWK import failures", async () => {
    const subtle = {
      importKey: vi.fn(async () => {
        throw new Error("bad key")
      }),
      sign: vi.fn(),
    }

    await expect(
      importSigningKey({
        config: ALGORITHM_CONFIGS.HS256,
        key: '{"kty":"oct","k":"AQID"}',
        keyFormat: "jwk",
        subtle,
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, "errorInvalidJwk")
      return true
    })
  })

  test("rejects PEM for HMAC and shared secrets for asymmetric algorithms", async () => {
    const subtle = { importKey: vi.fn(), sign: vi.fn() }

    await expect(
      importSigningKey({
        config: ALGORITHM_CONFIGS.HS256,
        key: "secret",
        keyFormat: "pem",
        subtle,
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, "errorSecretKeyFormat")
      return true
    })
    await expect(
      importSigningKey({
        config: ALGORITHM_CONFIGS.RS256,
        key: "secret",
        keyFormat: "secret",
        subtle,
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, "errorPrivateKeyFormat")
      return true
    })
  })

  test("wraps private key import failures by input format", async () => {
    const subtle = {
      importKey: vi.fn(async () => {
        throw new Error("bad key")
      }),
      sign: vi.fn(),
    }

    await expect(
      importSigningKey({
        config: ALGORITHM_CONFIGS.RS256,
        key: privateKeyPem(),
        keyFormat: "pem",
        subtle,
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, "errorInvalidPem")
      return true
    })
    await expect(
      importSigningKey({
        config: ALGORITHM_CONFIGS.RS256,
        key: '{"kty":"RSA"}',
        keyFormat: "jwk",
        subtle,
      })
    ).rejects.toSatisfy((error: unknown) => {
      expectJwtError(error, "errorInvalidJwk")
      return true
    })
  })
})
