import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatSha512224Digest, hashSha512224 } from "./sha512224"

describe("hashSha512224", () => {
  test("hashes a blob with SHA-512/224", async () => {
    const input = "hello"
    const digest = await hashSha512224(new Blob([input]))
    const expectedHex = createHash("sha512-224").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(
      createHash("sha512-224").update(input).digest("base64")
    )
  })
})

describe("formatSha512224Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatSha512224Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
