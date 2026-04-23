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
      hex: "a8d02b9a",
      base64: "qNArmg==",
      decimal: "2832214938",
      binary: "10101000110100000010101110011010",
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
      hex: "9638b3af",
      base64: "ljizrw==",
      decimal: "2520298415",
      binary: "10010110001110001011001110101111",
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
    expect(formatMurmurHash3Digest(0xa8d02b9a)).toEqual({
      hex: "a8d02b9a",
      base64: "qNArmg==",
      decimal: "2832214938",
      binary: "10101000110100000010101110011010",
    })
  })
})
