import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatMd5Digest, hashMd5 } from "./md5"

describe("hashMd5", () => {
  test("hashes a blob with MD5", async () => {
    const input = "hello"
    const digest = await hashMd5(new Blob([input]))
    const expectedHex = createHash("md5").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(createHash("md5").update(input).digest("base64"))
  })

  test("hashes binary file data", async () => {
    const input = Uint8Array.from([0, 255, 1, 128, 64])
    const digest = await hashMd5(new Blob([input]))

    expect(digest.hex).toBe(createHash("md5").update(input).digest("hex"))
  })
})

describe("formatMd5Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatMd5Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
