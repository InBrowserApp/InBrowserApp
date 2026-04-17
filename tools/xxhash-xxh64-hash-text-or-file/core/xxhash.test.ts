import { describe, expect, test } from "vitest"

import { formatXxHashDigest, hashXxHash } from "./xxhash"

describe("hashXxHash", () => {
  test("hashes a blob into hex, base64, decimal, and binary output", async () => {
    const digest = await hashXxHash(new Blob(["Wikipedia"]))

    expect(digest).toEqual({
      hex: "8c1d59a179b5665c",
      base64: "jB1ZoXm1Zlw=",
      decimal: "10096324489701058140",
      binary:
        "1000110000011101010110011010000101111001101101010110011001011100",
    })
  })
})

describe("formatXxHashDigest", () => {
  test("formats the checksum as multiple encodings", () => {
    expect(formatXxHashDigest(0x8c1d59a179b5665cn)).toEqual({
      hex: "8c1d59a179b5665c",
      base64: "jB1ZoXm1Zlw=",
      decimal: "10096324489701058140",
      binary:
        "1000110000011101010110011010000101111001101101010110011001011100",
    })
  })
})
