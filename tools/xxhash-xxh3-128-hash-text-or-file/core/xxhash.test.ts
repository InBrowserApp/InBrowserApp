import { createXXHash128 } from "hash-wasm"
import { describe, expect, test } from "vitest"

import {
  formatXxHashXxh3128Digest,
  hashXxHashXxh3128,
  parseSeedInput,
} from "./xxhash"

async function createReferenceDigest(input: string, seedInput = "0") {
  const seed = parseSeedInput(seedInput)

  if (!seed.isValid) {
    throw new Error("Seed must be valid for reference digests")
  }

  const hasher = await createXXHash128(seed.low, seed.high)
  hasher.update(new TextEncoder().encode(input))
  const digestBytes = hasher.digest("binary") as Uint8Array
  const digest = new Uint8Array(digestBytes.length)
  digest.set(digestBytes)

  return formatXxHashXxh3128Digest(digest.buffer.slice(0))
}

describe("hashXxHashXxh3128", () => {
  test("hashes a blob into hex, base64, decimal, and binary output", async () => {
    const digest = await hashXxHashXxh3128(new Blob(["Wikipedia"]), {
      low: 0,
      high: 0,
    })

    expect(digest).toEqual(await createReferenceDigest("Wikipedia"))
  })

  test("honors the optional seed when hashing", async () => {
    const seed = parseSeedInput("0x1234")

    expect(seed.isValid).toBe(true)

    const digest = await hashXxHashXxh3128(new Blob(["Wikipedia"]), seed)

    expect(digest).toEqual(await createReferenceDigest("Wikipedia", "0x1234"))
  })
})

describe("formatXxHashXxh3128Digest", () => {
  test("formats the digest as multiple encodings", () => {
    expect(
      formatXxHashXxh3128Digest(Uint8Array.from([0, 1, 2, 255]).buffer)
    ).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})

describe("parseSeedInput", () => {
  test("accepts empty input as the default seed", () => {
    expect(parseSeedInput("")).toEqual({
      low: 0,
      high: 0,
      isValid: true,
    })
  })

  test("accepts decimal and hexadecimal seeds", () => {
    expect(parseSeedInput("4660")).toEqual({
      low: 4660,
      high: 0,
      isValid: true,
    })
    expect(parseSeedInput("0x123456789abcdef0")).toEqual({
      low: 0x9abcdef0,
      high: 0x12345678,
      isValid: true,
    })
  })

  test("wraps large seeds to uint64", () => {
    expect(parseSeedInput("18446744073709551616")).toEqual({
      low: 0,
      high: 0,
      isValid: true,
    })
  })

  test("rejects unsupported seed formats", () => {
    expect(parseSeedInput("-1").isValid).toBe(false)
    expect(parseSeedInput("0x").isValid).toBe(false)
    expect(parseSeedInput("hello").isValid).toBe(false)
  })
})
