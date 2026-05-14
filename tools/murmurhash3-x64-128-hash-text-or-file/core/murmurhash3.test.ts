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
      hex: "c382657f9a06c49d4a71fdc6d9b0d48f",
      base64: "w4Jlf5oGxJ1Kcf3G2bDUjw==",
      decimal: "259876516402683604490973672373125960847",
      binary:
        "11000011100000100110010101111111100110100000011011000100100111010100101001110001111111011100011011011001101100001101010010001111",
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
      hex: "e85cec5bbbe05ddefccbf1b933fff845",
      base64: "6FzsW7vgXd78y/G5M//4RQ==",
      decimal: "308863380249659876761444031133898504261",
      binary:
        "11101000010111001110110001011011101110111110000001011101110111101111110011001011111100011011100100110011111111111111100001000101",
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
    expect(formatMurmurHash3Digest("c382657f9a06c49d4a71fdc6d9b0d48f")).toEqual(
      {
        hex: "c382657f9a06c49d4a71fdc6d9b0d48f",
        base64: "w4Jlf5oGxJ1Kcf3G2bDUjw==",
        decimal: "259876516402683604490973672373125960847",
        binary:
          "11000011100000100110010101111111100110100000011011000100100111010100101001110001111111011100011011011001101100001101010010001111",
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
