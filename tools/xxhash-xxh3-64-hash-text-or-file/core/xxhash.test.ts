import { describe, expect, test } from "vitest"

import { formatXxHashDigest, hashXxHash, parseXxHashSeed } from "./xxhash"

describe("hashXxHash", () => {
  test("hashes a blob with the default seed", async () => {
    const digest = await hashXxHash(new Blob(["hello world"]))

    expect(digest).toEqual({
      hex: "d447b1ea40e6988b",
      base64: "1Eex6kDmmIs=",
      decimal: "15296390279056496779",
      binary:
        "1101010001000111101100011110101001000000111001101001100010001011",
    })
  })

  test("hashes a blob with a custom seed", async () => {
    const seed = parseXxHashSeed("1")

    expect(seed.isValid).toBe(true)

    const digest = await hashXxHash(new Blob(["hello world"]), seed)

    expect(digest).toEqual({
      hex: "b7aeb52a10fdaf2d",
      base64: "t661KhD9ry0=",
      decimal: "13235715547166781229",
      binary:
        "1011011110101110101101010010101000010000111111011010111100101101",
    })
  })
})

describe("parseXxHashSeed", () => {
  test("accepts empty input as the default seed", () => {
    expect(parseXxHashSeed("")).toEqual({
      low: 0,
      high: 0,
      isValid: true,
    })
  })

  test("accepts decimal input", () => {
    expect(parseXxHashSeed("42")).toEqual({
      low: 42,
      high: 0,
      isValid: true,
    })
  })

  test("accepts hexadecimal input", () => {
    expect(parseXxHashSeed("0x100000001")).toEqual({
      low: 1,
      high: 1,
      isValid: true,
    })
  })

  test("wraps large values to 64 bits", () => {
    expect(parseXxHashSeed("18446744073709551617")).toEqual({
      low: 1,
      high: 0,
      isValid: true,
    })
  })

  test("rejects invalid input", () => {
    expect(parseXxHashSeed("oops")).toEqual({
      low: 0,
      high: 0,
      isValid: false,
    })
    expect(parseXxHashSeed("0b1010")).toEqual({
      low: 0,
      high: 0,
      isValid: false,
    })
    expect(parseXxHashSeed("-1")).toEqual({
      low: 0,
      high: 0,
      isValid: false,
    })
  })
})

describe("formatXxHashDigest", () => {
  test("formats raw digest bytes as multiple encodings", () => {
    const digest = Uint8Array.from([
      0xd4, 0x47, 0xb1, 0xea, 0x40, 0xe6, 0x98, 0x8b,
    ])

    expect(formatXxHashDigest(digest.buffer)).toEqual({
      hex: "d447b1ea40e6988b",
      base64: "1Eex6kDmmIs=",
      decimal: "15296390279056496779",
      binary:
        "1101010001000111101100011110101001000000111001101001100010001011",
    })
  })
})
