import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import {
  DEFAULT_OUTPUT_BITS,
  formatShake128Digest,
  hashShake128,
  parseOutputBitsInput,
} from "./shake128"

function shake128Hex(input: string, outputBits = DEFAULT_OUTPUT_BITS) {
  return createHash("shake128", {
    outputLength: outputBits / 8,
  })
    .update(input)
    .digest("hex")
}

describe("hashShake128", () => {
  test("hashes a blob with SHAKE128 using the default output length", async () => {
    const input = "hello"
    const digest = await hashShake128(new Blob([input]))

    expect(digest.hex).toBe(shake128Hex(input))
    expect(digest.base64).toBe(
      createHash("shake128", {
        outputLength: DEFAULT_OUTPUT_BITS / 8,
      })
        .update(input)
        .digest("base64")
    )
  })

  test("hashes a blob with a custom output length", async () => {
    const input = "hello"
    const digest = await hashShake128(new Blob([input]), 512)

    expect(digest.hex).toBe(shake128Hex(input, 512))
  })
})

describe("parseOutputBitsInput", () => {
  test("accepts the default empty value", () => {
    expect(parseOutputBitsInput("")).toEqual({
      value: DEFAULT_OUTPUT_BITS,
      isValid: true,
    })
  })

  test("accepts valid multiples of eight in range", () => {
    expect(parseOutputBitsInput("512")).toEqual({
      value: 512,
      isValid: true,
    })
  })

  test("rejects invalid values", () => {
    expect(parseOutputBitsInput("7").isValid).toBe(false)
    expect(parseOutputBitsInput("65544").isValid).toBe(false)
    expect(parseOutputBitsInput("abc").isValid).toBe(false)
  })
})

describe("formatShake128Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatShake128Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
