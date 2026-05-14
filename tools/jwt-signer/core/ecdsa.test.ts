import { describe, expect, test } from "vitest"

import { derToJoseSignature, normalizeEcdsaSignature } from "./ecdsa"
import { JwtSignerError } from "./errors"

function expectSigningFailed(callback: () => unknown) {
  expect(callback).toThrow(JwtSignerError)
  try {
    callback()
  } catch (error) {
    expect((error as JwtSignerError).code).toBe("errorSigningFailed")
  }
}

describe("ECDSA signature normalization", () => {
  test("returns JOSE signatures that are already the expected length", () => {
    const signature = new Uint8Array(64).fill(1)

    expect(normalizeEcdsaSignature(signature, 64)).toBe(signature)
  })

  test("converts DER signatures with short-form lengths", () => {
    const signature = derToJoseSignature(
      new Uint8Array([
        0x30, 0x08, 0x02, 0x02, 0x00, 0x01, 0x02, 0x02, 0x00, 0x02,
      ]),
      64
    )

    expect(signature).toHaveLength(64)
    expect(signature[31]).toBe(1)
    expect(signature[63]).toBe(2)
  })

  test("converts DER signatures with long-form lengths", () => {
    const signature = derToJoseSignature(
      new Uint8Array([0x30, 0x81, 0x06, 0x02, 0x01, 0x01, 0x02, 0x01, 0x02]),
      64
    )

    expect(signature[31]).toBe(1)
    expect(signature[63]).toBe(2)
  })

  test("rejects malformed DER signatures", () => {
    const invalidSignatures = [
      new Uint8Array([0x31, 0x00]),
      new Uint8Array([0x30]),
      new Uint8Array([0x30, 0x02, 0x02, 0x00, 0x00]),
      new Uint8Array([0x30, 0x01, 0x00]),
      new Uint8Array([0x30, 0x02, 0x03, 0x00]),
      new Uint8Array([0x30, 0x05, 0x02, 0x03, 0x01, 0x02, 0x03]),
      new Uint8Array([0x30, 0x07, 0x02, 0x01, 0x01, 0x02, 0x01, 0x02, 0x00]),
      new Uint8Array([0x30, 0x80]),
      new Uint8Array([0x30, 0x85, 0x00, 0x00, 0x00, 0x00, 0x00]),
      new Uint8Array([0x30, 0x82, 0x00]),
    ]

    for (const signature of invalidSignatures) {
      expectSigningFailed(() => derToJoseSignature(signature, 4))
    }
  })
})
