import { describe, expect, test } from "vitest"

import {
  INVALID_HIGHWAYHASH_DIGEST_LENGTH_ERROR,
  INVALID_HIGHWAYHASH_OUTPUT_SIZE_ERROR,
  formatHighwayHashDigest,
  hashHighwayHash,
  normalizeHighwayHashBytes,
  parseHighwayHashKey,
  parseHighwayHashOutputSize,
  validateHighwayHashOutputSize,
} from "./highwayhash"

const VECTOR_KEY =
  "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"

function makeSequentialBytes(length: number) {
  return Uint8Array.from({ length }, (_, index) => index)
}

describe("parseHighwayHashKey", () => {
  test("parses a 32-byte hex key with optional prefix and separators", () => {
    const result = parseHighwayHashKey(
      "0x0001 0203:0405-0607_08090a0b0c0d0e0f" +
        "101112131415161718191a1b1c1d1e1f"
    )

    expect(result).toEqual({
      status: "valid",
      normalizedHex:
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
      key: makeSequentialBytes(32),
    })
  })

  test("reports empty and invalid key input", () => {
    expect(parseHighwayHashKey("   ")).toEqual({
      status: "empty",
      key: undefined,
    })
    expect(parseHighwayHashKey("001122")).toEqual({ status: "invalid" })
    expect(
      parseHighwayHashKey(
        "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
      )
    ).toEqual({ status: "invalid" })
  })
})

describe("parseHighwayHashOutputSize", () => {
  test("parses supported output sizes and rejects unknown values", () => {
    expect(parseHighwayHashOutputSize("64")).toBe(64)
    expect(parseHighwayHashOutputSize("128")).toBe(128)
    expect(parseHighwayHashOutputSize("256")).toBe(256)
    expect(parseHighwayHashOutputSize("512")).toBeUndefined()
    expect(parseHighwayHashOutputSize(null)).toBeUndefined()
  })
})

describe("hashHighwayHash", () => {
  test.each([
    [0, "907a56de22c26e53"],
    [1, "7eab43aac7cddd78"],
    [2, "b8d0569ab0b53d62"],
    [7, "4d02ae1738f59482"],
  ])("matches the upstream 64-bit vector for %i bytes", async (length, hex) => {
    const keyState = parseHighwayHashKey(VECTOR_KEY)

    if (keyState.status !== "valid") {
      throw new Error("Vector key should parse.")
    }

    const digest = await hashHighwayHash(
      new Blob([makeSequentialBytes(length)]),
      {
        outputSize: 64,
        key: keyState.key,
      }
    )

    expect(digest.hex).toBe(hex)
  })

  test("hashes 128-bit and 256-bit vectors with canonical lane order", async () => {
    const keyState = parseHighwayHashKey(VECTOR_KEY)

    if (keyState.status !== "valid") {
      throw new Error("Vector key should parse.")
    }

    await expect(
      hashHighwayHash(new Blob([makeSequentialBytes(0)]), {
        outputSize: 128,
        key: keyState.key,
      })
    ).resolves.toMatchObject({
      hex: "33565e767f093e6f0fed268f9d8ffec7",
    })

    await expect(
      hashHighwayHash(new Blob([makeSequentialBytes(0)]), {
        outputSize: 256,
        key: keyState.key,
      })
    ).resolves.toMatchObject({
      hex:
        "41da233145751df4b3aebeccb98714ffd946017313c7351f" + "dd44482ac2c874f5",
    })
  })

  test("hashes with the default library key when no key is supplied", async () => {
    const digest = await hashHighwayHash(new Blob(["hello"]), {
      outputSize: 64,
    })

    expect(digest.hex).toMatch(/^[\da-f]{16}$/)
    expect(digest.base64).toHaveLength(12)
  })

  test("rejects invalid key length and output size", async () => {
    await expect(
      hashHighwayHash(new Blob(["hello"]), {
        outputSize: 64,
        key: new Uint8Array(31),
      })
    ).rejects.toThrow("HighwayHash requires a 32-byte key.")

    await expect(
      hashHighwayHash(new Blob(["hello"]), {
        outputSize: 512,
      } as unknown as Parameters<typeof hashHighwayHash>[1])
    ).rejects.toThrow(INVALID_HIGHWAYHASH_OUTPUT_SIZE_ERROR)
  })
})

describe("formatHighwayHashDigest", () => {
  test("formats a digest into every supported representation", () => {
    expect(
      formatHighwayHashDigest(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 255]))
    ).toEqual({
      hex: "00010203040506ff",
      base64: "AAECAwQFBv8=",
      decimal: "283686952306431",
      binary:
        "0000000000000001000000100000001100000100000001010000011011111111",
    })
  })

  test("rejects unsupported digest lengths", () => {
    expect(() => formatHighwayHashDigest(new Uint8Array(7))).toThrow(
      INVALID_HIGHWAYHASH_DIGEST_LENGTH_ERROR
    )
  })
})

describe("normalizeHighwayHashBytes", () => {
  test("normalizes little-endian lanes into canonical digest order", () => {
    const rawDigest = Uint8Array.from(
      {
        length: 16,
      },
      (_, index) => index
    )

    expect(normalizeHighwayHashBytes(rawDigest, 128)).toEqual(
      Uint8Array.from([15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
    )
  })
})

describe("validateHighwayHashOutputSize", () => {
  test("accepts supported sizes and rejects unsupported sizes", () => {
    expect(() => validateHighwayHashOutputSize(64)).not.toThrow()
    expect(() => validateHighwayHashOutputSize(512)).toThrow(
      INVALID_HIGHWAYHASH_OUTPUT_SIZE_ERROR
    )
  })
})
