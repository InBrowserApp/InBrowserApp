import { describe, expect, test } from "vitest"

import {
  formatCityHash64Digest,
  hashCityHash64,
  parseCityHash64Seed,
} from "./cityhash64"

describe("hashCityHash64", () => {
  test("hashes a blob with the default seed", async () => {
    const digest = await hashCityHash64(
      new Blob(["Hello from CityHash64 in the browser."])
    )

    expect(digest).toEqual({
      hex: "28db5604b771b148",
      base64: "KNtWBLdxsUg=",
      decimal: "2944041359674290504",
      binary:
        "0010100011011011010101100000010010110111011100011011000101001000",
    })
  })

  test("hashes a blob with a custom seed", async () => {
    const seed = parseCityHash64Seed("25")

    expect(seed.isValid).toBe(true)

    const digest = await hashCityHash64(
      new Blob(["My hovercraft is full of eels."]),
      seed.value
    )

    expect(digest).toEqual({
      hex: "8a5f4dc414908446",
      base64: "il9NxBSQhEY=",
      decimal: "9970773604575511622",
      binary:
        "1000101001011111010011011100010000010100100100001000010001000110",
    })
  })
})

describe("parseCityHash64Seed", () => {
  test("accepts empty input as unseeded CityHash64", () => {
    expect(parseCityHash64Seed("")).toEqual({
      value: null,
      isValid: true,
    })
  })

  test("accepts decimal input", () => {
    expect(parseCityHash64Seed("42")).toEqual({
      value: 42n,
      isValid: true,
    })
  })

  test("accepts hexadecimal input", () => {
    expect(parseCityHash64Seed("0x19")).toEqual({
      value: 25n,
      isValid: true,
    })
  })

  test("wraps large values to 64 bits", () => {
    expect(parseCityHash64Seed("18446744073709551617")).toEqual({
      value: 1n,
      isValid: true,
    })
  })

  test("rejects invalid input", () => {
    expect(parseCityHash64Seed("oops")).toEqual({
      value: null,
      isValid: false,
    })
    expect(parseCityHash64Seed("0b1010")).toEqual({
      value: null,
      isValid: false,
    })
    expect(parseCityHash64Seed("-1")).toEqual({
      value: null,
      isValid: false,
    })
  })
})

describe("formatCityHash64Digest", () => {
  test("formats raw digest values as multiple encodings", () => {
    expect(formatCityHash64Digest(0x28db5604b771b148n)).toEqual({
      hex: "28db5604b771b148",
      base64: "KNtWBLdxsUg=",
      decimal: "2944041359674290504",
      binary:
        "0010100011011011010101100000010010110111011100011011000101001000",
    })
  })
})
