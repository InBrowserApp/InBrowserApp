import { describe, expect, test } from "vitest"

import { formatRipemd128Digest, hashRipemd128 } from "./ripemd128"

describe("hashRipemd128", () => {
  test("hashes known RIPEMD-128 vectors", async () => {
    const vectors = [
      { input: "", hex: "cdf26213a150dc3ecb610f18f6b38b46" },
      { input: "a", hex: "86be7afa339d0fc7cfc785e72f578d33" },
      { input: "abc", hex: "c14a12199c66e4ba84636b0f69144c77" },
      {
        input: "message digest",
        hex: "9e327b3d6e523062afc1132d7df9d1b8",
      },
    ] as const

    for (const { input, hex } of vectors) {
      const digest = await hashRipemd128(new Blob([input]))

      expect(digest.hex).toBe(hex)
    }

    const digest = await hashRipemd128(new Blob(["abc"]))

    expect(digest.base64).toBe("wUoSGZxm5LqEY2sPaRRMdw==")
  })

  test("hashes binary file data", async () => {
    const input = Uint8Array.from([0, 255, 1, 128, 64])
    const digest = await hashRipemd128(new Blob([input]))

    expect(digest.hex).toBe("6359484077a374c7b8bb9881ef6b8192")
  })

  test("hashes a message that uses the long finalize padding path", async () => {
    const digest = await hashRipemd128(new Blob(["a".repeat(56)]))

    expect(digest.hex).toBe("6356ebd92cd62ee084789c6ec8eb3de3")
  })
})

describe("formatRipemd128Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatRipemd128Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
