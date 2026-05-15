import { describe, expect, test, vi } from "vitest"

const hashWasmMocks = vi.hoisted(() => ({
  argon2Verify: vi.fn(),
}))

vi.mock("hash-wasm", () => ({
  argon2Verify: hashWasmMocks.argon2Verify,
}))

import {
  Argon2HashError,
  estimateBase64ByteLength,
  parseArgon2EncodedHash,
  verifyArgon2Password,
} from "./argon2"

const encodedHash =
  "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$MTIzNDU2Nzg5MGFiY2RlZg"

describe("parseArgon2EncodedHash", () => {
  test("extracts variant, version, parameters, and byte lengths", () => {
    expect(parseArgon2EncodedHash(encodedHash)).toEqual({
      variant: "argon2id",
      version: 19,
      memoryCost: 65536,
      iterations: 3,
      parallelism: 4,
      saltLength: 8,
      digestLength: 16,
    })
  })

  test("rejects malformed encoded hash strings", () => {
    const invalidHashes = [
      "",
      "argon2id$v=19$m=1,t=1,p=1$salt$digest",
      "$bcrypt$v=19$m=1,t=1,p=1$salt$digest",
      "$argon2id$19$m=1,t=1,p=1$salt$digest",
      "$argon2d$m=1,t=1,p=1$salt$digest",
      "$argon2id$v=0$m=1,t=1,p=1$salt$digest",
      "$argon2id$v=x$m=1,t=1,p=1$salt$digest",
      "$argon2id$v=19$m=1,t=1$salt$digest",
      "$argon2id$v=19$m=0,t=1,p=1$salt$digest",
      "$argon2id$v=19$m=x,t=1,p=1$salt$digest",
      "$argon2id$v=19$m=1,t=1,p=1$$digest",
      "$argon2id$v=19$m=1,t=1,p=1$salt$",
      "$argon2id$v=19$m=1,t=1,p=1$salt$digest$extra",
    ]

    for (const hash of invalidHashes) {
      expect(() => parseArgon2EncodedHash(hash)).toThrow(Argon2HashError)
    }
  })
})

describe("estimateBase64ByteLength", () => {
  test("estimates byte lengths for unpadded and padded base64", () => {
    expect(estimateBase64ByteLength("")).toBe(0)
    expect(estimateBase64ByteLength("YQ")).toBe(1)
    expect(estimateBase64ByteLength("YWI=")).toBe(2)
    expect(estimateBase64ByteLength("YWJj")).toBe(3)
    expect(estimateBase64ByteLength("YQ==")).toBe(1)
  })
})

describe("verifyArgon2Password", () => {
  test("returns the verification result and parsed hash info", async () => {
    hashWasmMocks.argon2Verify.mockResolvedValueOnce(true)

    await expect(
      verifyArgon2Password({
        password: "correct horse battery staple",
        hash: ` ${encodedHash}\n`,
        secret: "pepper",
      })
    ).resolves.toMatchObject({
      verified: true,
      info: {
        variant: "argon2id",
        memoryCost: 65536,
      },
    })

    expect(hashWasmMocks.argon2Verify).toHaveBeenCalledWith({
      password: "correct horse battery staple",
      hash: encodedHash,
      secret: "pepper",
    })
  })

  test("omits an empty secret and returns mismatches", async () => {
    hashWasmMocks.argon2Verify.mockResolvedValueOnce(false)

    await expect(
      verifyArgon2Password({
        password: "wrong password",
        hash: encodedHash,
        secret: "",
      })
    ).resolves.toMatchObject({ verified: false })

    expect(hashWasmMocks.argon2Verify).toHaveBeenCalledWith({
      password: "wrong password",
      hash: encodedHash,
      secret: undefined,
    })
  })

  test("maps verifier failures to an Argon2 hash error", async () => {
    hashWasmMocks.argon2Verify.mockRejectedValueOnce(
      new Error("hash-wasm rejected the hash")
    )

    await expect(
      verifyArgon2Password({
        password: "secret",
        hash: encodedHash,
      })
    ).rejects.toThrow(Argon2HashError)
  })
})
