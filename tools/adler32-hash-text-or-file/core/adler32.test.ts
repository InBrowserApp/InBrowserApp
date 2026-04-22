import { describe, expect, test } from "vitest"

import { calculateAdler32, formatAdler32Digest, hashAdler32 } from "./adler32"

describe("calculateAdler32", () => {
  test("returns the empty Adler-32 checksum", () => {
    expect(calculateAdler32(new Uint8Array())).toBe(1)
  })

  test("returns the known checksum for Wikipedia", () => {
    const input = new TextEncoder().encode("Wikipedia")

    expect(calculateAdler32(input)).toBe(300286872)
  })
})

describe("hashAdler32", () => {
  test("hashes a blob into hex, base64, decimal, and binary output", async () => {
    const digest = await hashAdler32(new Blob(["Wikipedia"]))

    expect(digest).toEqual({
      hex: "11e60398",
      base64: "EeYDmA==",
      decimal: "300286872",
      binary: "00010001111001100000001110011000",
    })
  })
})

describe("formatAdler32Digest", () => {
  test("formats the checksum as multiple encodings", () => {
    expect(formatAdler32Digest(0xfd7a0cfc)).toEqual({
      hex: "fd7a0cfc",
      base64: "/XoM/A==",
      decimal: "4252634364",
      binary: "11111101011110100000110011111100",
    })
  })
})
