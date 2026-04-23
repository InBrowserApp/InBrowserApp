import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import {
  DEFAULT_OUTPUT_BITS,
  formatShake256Digest,
  hashShake256,
  parseOutputBitsInput,
} from "./shake256"

function shake256Hex(input: string, outputBits = DEFAULT_OUTPUT_BITS) {
  return createHash("shake256", {
    outputLength: outputBits / 8,
  })
    .update(input)
    .digest("hex")
}

describe("hashShake256", () => {
  test("hashes a blob with SHAKE256 using the default output length", async () => {
    const input = "hello"
    const digest = await hashShake256(new Blob([input]))

    expect(digest.hex).toBe(shake256Hex(input))
    expect(digest.base64).toBe(
      createHash("shake256", {
        outputLength: DEFAULT_OUTPUT_BITS / 8,
      })
        .update(input)
        .digest("base64")
    )
  })

  test("hashes a blob with a custom output length", async () => {
    const input = "hello"
    const digest = await hashShake256(new Blob([input]), 1024)

    expect(digest.hex).toBe(shake256Hex(input, 1024))
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
    expect(parseOutputBitsInput("1024")).toEqual({
      value: 1024,
      isValid: true,
    })
  })

  test("rejects invalid values", () => {
    expect(parseOutputBitsInput("7").isValid).toBe(false)
    expect(parseOutputBitsInput("65544").isValid).toBe(false)
    expect(parseOutputBitsInput("abc").isValid).toBe(false)
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
