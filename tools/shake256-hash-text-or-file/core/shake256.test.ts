import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import {
  INVALID_SHAKE256_OUTPUT_LENGTH_ERROR,
  INVALID_SHAKE256_OUTPUT_LENGTH_STEP_ERROR,
  formatShake256Digest,
  hashShake256,
} from "./shake256"

describe("hashShake256", () => {
  test("hashes a blob with the default 512-bit SHAKE256 digest", async () => {
    const input = "hello"
    const digest = await hashShake256(new Blob([input]), {
      outputLength: 512,
    })

    expect(digest.hex).toBe(
      createHash("shake256", { outputLength: 64 }).update(input).digest("hex")
    )
    expect(digest.base64).toBe(
      createHash("shake256", { outputLength: 64 })
        .update(input)
        .digest("base64")
    )
  })

  test("hashes a blob with a 256-bit output", async () => {
    const input = "hello"
    const digest = await hashShake256(new Blob([input]), {
      outputLength: 256,
    })

    expect(digest.hex).toBe(
      createHash("shake256", { outputLength: 32 }).update(input).digest("hex")
    )
  })

  test("throws when the output length is out of range", async () => {
    await expect(
      hashShake256(new Blob(["hello"]), {
        outputLength: 65544,
      })
    ).rejects.toThrow(INVALID_SHAKE256_OUTPUT_LENGTH_ERROR)
  })

  test("throws when the output length is not a multiple of 8 bits", async () => {
    await expect(
      hashShake256(new Blob(["hello"]), {
        outputLength: 510,
      })
    ).rejects.toThrow(INVALID_SHAKE256_OUTPUT_LENGTH_STEP_ERROR)
  })
})

describe("formatShake256Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatShake256Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
