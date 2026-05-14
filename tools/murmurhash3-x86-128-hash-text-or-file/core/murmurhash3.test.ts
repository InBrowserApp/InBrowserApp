import { describe, expect, test } from "vitest"

import {
  formatMurmurHash3Digest,
  hashMurmurHash3,
  parseMurmurHash3Seed,
} from "./murmurhash3"

describe("hashMurmurHash3", () => {
  test("hashes a blob with the default seed", async () => {
    const digest = await hashMurmurHash3(
      new Blob(["I will not buy this record, it is scratched."])
    )

    expect(digest).toEqual({
      hex: "a0a9683b25ac5e40d9af2895890dddf5",
      base64: "oKloOyWsXkDZryiViQ3d9Q==",
      decimal: "213556091551398619352241086932517248501",
      binary:
        "10100000101010010110100000111011001001011010110001011110010000001101100110101111001010001001010110001001000011011101110111110101",
    })
  })

  test("hashes a blob with a custom seed", async () => {
    const seed = parseMurmurHash3Seed("25")

    expect(seed.isValid).toBe(true)

    const digest = await hashMurmurHash3(
      new Blob(["My hovercraft is full of eels."]),
      seed.value
    )

    expect(digest).toEqual({
      hex: "33e54463e1a104d6dbb7d15030df01fb",
      base64: "M+VEY+GhBNbbt9FQMN8B+w==",
      decimal: "68981050882905109390448006077647618555",
      binary:
        "00110011111001010100010001100011111000011010000100000100110101101101101110110111110100010101000000110000110111110000000111111011",
    })
  })
})

describe("parseMurmurHash3Seed", () => {
  test("accepts empty input as the default seed", () => {
    expect(parseMurmurHash3Seed("")).toEqual({
      value: 0,
      isValid: true,
    })
  })

  test("accepts decimal input", () => {
    expect(parseMurmurHash3Seed("42")).toEqual({
      value: 42,
      isValid: true,
    })
  })

  test("accepts hexadecimal input", () => {
    expect(parseMurmurHash3Seed("0x19")).toEqual({
      value: 25,
      isValid: true,
    })
  })

  test("wraps large values to 32 bits", () => {
    expect(parseMurmurHash3Seed("4294967297")).toEqual({
      value: 1,
      isValid: true,
    })
  })

  test("rejects invalid input", () => {
    expect(parseMurmurHash3Seed("oops")).toEqual({
      value: 0,
      isValid: false,
    })
    expect(parseMurmurHash3Seed("0b1010")).toEqual({
      value: 0,
      isValid: false,
    })
    expect(parseMurmurHash3Seed("-1")).toEqual({
      value: 0,
      isValid: false,
    })
  })
})

describe("formatMurmurHash3Digest", () => {
  test("formats raw digest values as multiple encodings", () => {
    expect(formatMurmurHash3Digest("a0a9683b25ac5e40d9af2895890dddf5")).toEqual(
      {
        hex: "a0a9683b25ac5e40d9af2895890dddf5",
        base64: "oKloOyWsXkDZryiViQ3d9Q==",
        decimal: "213556091551398619352241086932517248501",
        binary:
          "10100000101010010110100000111011001001011010110001011110010000001101100110101111001010001001010110001001000011011101110111110101",
      }
    )
  })

  test("normalizes odd-length hexadecimal values", () => {
    expect(formatMurmurHash3Digest("f")).toEqual({
      hex: "0f",
      base64: "Dw==",
      decimal: "15",
      binary: "00001111",
    })
  })
})
