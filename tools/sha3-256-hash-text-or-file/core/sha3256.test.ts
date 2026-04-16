import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatSha3256Digest, hashSha3256 } from "./sha3256"

describe("hashSha3256", () => {
  test("hashes a blob with SHA3-256", async () => {
    const input = "hello"
    const digest = await hashSha3256(new Blob([input]))
    const expectedHex = createHash("sha3-256").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(
      createHash("sha3-256").update(input).digest("base64")
    )
  })
})

describe("formatSha3256Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatSha3256Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
