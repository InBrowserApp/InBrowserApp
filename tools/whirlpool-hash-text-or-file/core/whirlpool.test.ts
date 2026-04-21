import { describe, expect, test } from "vitest"

import { formatWhirlpoolDigest, hashWhirlpool } from "./whirlpool"

describe("hashWhirlpool", () => {
  test("hashes a blob with Whirlpool", async () => {
    const input = "abc"
    const digest = await hashWhirlpool(new Blob([input]))
    const expectedHex =
      "4e2448a4c6f486bb16b6562c73b4020bf3043e3a731bce721ae1b303d97e6d4c" +
      "7181eebdb6c57e277d0e34957114cbd6c797fc9d95d8b582d225292076d4eef5"
    const expectedBase64 =
      "TiRIpMb0hrsWtlYsc7QCC/MEPjpzG85yGuGzA9l+bUxxge69tsV+J30ONJVxFMvW" +
      "x5f8nZXYtYLSJSkgdtTu9Q=="

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(expectedBase64)
  })
})

describe("formatWhirlpoolDigest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatWhirlpoolDigest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
