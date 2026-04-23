import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatSm3Digest, hashSm3 } from "./sm3"

describe("hashSm3", () => {
  test("hashes a blob with SM3", async () => {
    const input = "abc"
    const digest = await hashSm3(new Blob([input]))
    const expectedHex = createHash("sm3").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(createHash("sm3").update(input).digest("base64"))
  })
})

describe("formatSm3Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatSm3Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
