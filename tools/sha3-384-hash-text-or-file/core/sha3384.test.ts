import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatSha3384Digest, hashSha3384 } from "./sha3384"

describe("hashSha3384", () => {
  test("hashes a blob with SHA3-384", async () => {
    const input = "hello"
    const digest = await hashSha3384(new Blob([input]))
    const expectedHex = createHash("sha3-384").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(
      createHash("sha3-384").update(input).digest("base64")
    )
  })
})

describe("formatSha3384Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatSha3384Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
