import { describe, expect, test } from "vitest"

import {
  encodeLittleEndianBitLength,
  formatRipemd320Digest,
  hashRipemd320,
} from "./ripemd320"

describe("hashRipemd320", () => {
  test("hashes a known RIPEMD-320 vector", async () => {
    const digest = await hashRipemd320(new Blob(["abc"]))

    expect(digest.hex).toBe(
      "de4c01b3054f8930a79d09ae738e92301e5a17085beffdc1b8d116713e74f82fa942d64cdbc4682d"
    )
    expect(digest.base64).toBe(
      "3kwBswVPiTCnnQmuc46SMB5aFwhb7/3BuNEWcT50+C+pQtZM28RoLQ=="
    )
  })

  test("hashes binary file data", async () => {
    const input = Uint8Array.from([0, 255, 1, 128, 64])
    const digest = await hashRipemd320(new Blob([input]))

    expect(digest.hex).toBe(
      "1c7ecc1f9422d8d0066c111377822126e04773b49dd44e4f7a27f7ff28a20400d8766fecbf5aac4f"
    )
  })

  test("hashes a message that uses the long finalize padding path", async () => {
    const digest = await hashRipemd320(new Blob(["a".repeat(56)]))

    expect(digest.hex).toBe(
      "c49b2d7215293232bc94bde21658cb68e60ae66d826f1b0b8ed95ac27d56606aa7d3aedf8a014344"
    )
  })
})

describe("formatRipemd320Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatRipemd320Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})

describe("encodeLittleEndianBitLength", () => {
  test("encodes message lengths as unsigned 64-bit little-endian bit counts", () => {
    expect(getBytes(encodeLittleEndianBitLength(0))).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0,
    ])
    expect(getBytes(encodeLittleEndianBitLength(0x80000000))).toEqual([
      0, 0, 0, 0, 4, 0, 0, 0,
    ])
    expect(getBytes(encodeLittleEndianBitLength(0xffffffff))).toEqual([
      248, 255, 255, 255, 7, 0, 0, 0,
    ])
  })
})

function getBytes(value: string) {
  return Array.from(value, (character) => character.charCodeAt(0))
}
