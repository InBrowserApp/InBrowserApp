import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatSha3512Digest, hashSha3512 } from "./sha3512"

describe("hashSha3512", () => {
  test("hashes a blob with SHA3-512", async () => {
    const input = "hello"
    const digest = await hashSha3512(new Blob([input]))
    const expectedHex = createHash("sha3-512").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(
      createHash("sha3-512").update(input).digest("base64")
    )
  })
})

describe("formatSha3512Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatSha3512Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
