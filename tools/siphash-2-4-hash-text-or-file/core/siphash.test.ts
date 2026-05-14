import { describe, expect, test } from "vitest"

import {
  formatSipHashDigest,
  hashSipHash24,
  parseSipHashKey,
  sipHash24Bytes,
} from "./siphash"

const VECTOR_KEY = "0x000102030405060708090a0b0c0d0e0f"

function makeSequentialBytes(length: number) {
  return Uint8Array.from({ length }, (_, index) => index)
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join(
    ""
  )
}

describe("parseSipHashKey", () => {
  test("parses a 16-byte hex key with optional prefix and separators", () => {
    const result = parseSipHashKey("0x0001 0203:0405-0607_08090a0b0c0d0e0f")

    expect(result).toEqual({
      status: "valid",
      normalizedHex: "000102030405060708090a0b0c0d0e0f",
      key: makeSequentialBytes(16),
    })
  })

  test("reports empty and invalid key input", () => {
    expect(parseSipHashKey("   ")).toEqual({ status: "empty" })
    expect(parseSipHashKey("001122")).toEqual({ status: "invalid" })
    expect(parseSipHashKey("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")).toEqual({
      status: "invalid",
    })
  })
})

describe("sipHash24Bytes", () => {
  test.each([
    [0, "726fdb47dd0e0e31"],
    [1, "74f839c593dc67fd"],
    [7, "ab0200f58b01d137"],
    [8, "93f5f5799a932462"],
    [15, "a129ca6149be45e5"],
  ])("matches the SipHash-2-4 vector for %i bytes", (length, expected) => {
    const key = makeSequentialBytes(16)
    const message = makeSequentialBytes(length)

    expect(toHex(sipHash24Bytes(message, key))).toBe(expected)
  })

  test("requires a 16-byte key", () => {
    expect(() =>
      sipHash24Bytes(new Uint8Array([1, 2, 3]), new Uint8Array(15))
    ).toThrow("SipHash-2-4 requires a 16-byte key.")
  })
})

describe("hashSipHash24", () => {
  test("hashes blob input into hex, base64, decimal, and binary output", async () => {
    const keyState = parseSipHashKey(VECTOR_KEY)

    if (keyState.status !== "valid") {
      throw new Error("Vector key should parse.")
    }

    const digest = await hashSipHash24(
      new Blob([makeSequentialBytes(7)]),
      keyState.key
    )

    expect(digest).toEqual({
      hex: "ab0200f58b01d137",
      base64: "qwIA9YsB0Tc=",
      decimal: BigInt("0xab0200f58b01d137").toString(),
      binary:
        "1010101100000010000000001111010110001011000000011101000100110111",
    })
  })
})

describe("formatSipHashDigest", () => {
  test("rejects non-64-bit output", () => {
    expect(() => formatSipHashDigest(new Uint8Array(7))).toThrow(
      "SipHash-2-4 output must be 8 bytes."
    )
  })
})
