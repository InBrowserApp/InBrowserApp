import { describe, expect, test } from "vitest"

import { formatXxHashDigest, hashXxHash } from "./xxhash"

describe("hashXxHash", () => {
  test("hashes a blob into hex, base64, decimal, and binary output", async () => {
    const digest = await hashXxHash(new Blob(["Wikipedia"]))

    expect(digest).toEqual({
      hex: "f628bb38",
      base64: "9ii7OA==",
      decimal: "4129864504",
      binary: "11110110001010001011101100111000",
    })
  })
})

describe("formatXxHashDigest", () => {
  test("formats the checksum as multiple encodings", () => {
    expect(formatXxHashDigest(0x02cc5d05)).toEqual({
      hex: "02cc5d05",
      base64: "AsxdBQ==",
      decimal: "46947589",
      binary: "00000010110011000101110100000101",
    })
  })
})
