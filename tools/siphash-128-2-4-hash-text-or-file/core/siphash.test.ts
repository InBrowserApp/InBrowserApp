import { describe, expect, test } from "vitest"

import {
  formatSipHashDigest,
  hashSipHash128,
  parseSipHashKey,
  sipHash128Bytes,
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

describe("sipHash128Bytes", () => {
  test.each([
    [0, "57eeaa6c80b6a79741b174c411264797"],
    [1, "c38b21b0d75da7d4321f1d794dbfa1eb"],
    [7, "c87ba8d48ff34974729e430944cf3f04"],
    [8, "f8fa317e0f9fbdca41e1694676e8d398"],
    [15, "2152a4ce598ec92f5163778013caff1d"],
  ])("matches the SipHash-128-2-4 vector for %i bytes", (length, expected) => {
    const key = makeSequentialBytes(16)
    const message = makeSequentialBytes(length)

    expect(toHex(sipHash128Bytes(message, key))).toBe(expected)
  })

  test("requires a 16-byte key", () => {
    expect(() =>
      sipHash128Bytes(new Uint8Array([1, 2, 3]), new Uint8Array(15))
    ).toThrow("SipHash-128-2-4 requires a 16-byte key.")
  })
})

describe("hashSipHash128", () => {
  test("hashes blob input into hex, base64, decimal, and binary output", async () => {
    const keyState = parseSipHashKey(VECTOR_KEY)

    if (keyState.status !== "valid") {
      throw new Error("Vector key should parse.")
    }

    const digest = await hashSipHash128(
      new Blob([makeSequentialBytes(7)]),
      keyState.key
    )

    expect(digest).toEqual({
      hex: "c87ba8d48ff34974729e430944cf3f04",
      base64: "yHuo1I/zSXRynkMJRM8/BA==",
      decimal: "266487675956317297143194830299334655748",
      binary:
        "11001000011110111010100011010100100011111111001101001001011101000111001010011110010000110000100101000100110011110011111100000100",
    })
  })
})

describe("formatSipHashDigest", () => {
  test("rejects non-128-bit output", () => {
    expect(() => formatSipHashDigest(new Uint8Array(7))).toThrow(
      "SipHash-128-2-4 output must be 16 bytes."
    )
  })
})
