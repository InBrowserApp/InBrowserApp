import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatSha224Digest, hashSha224 } from "./sha224"

describe("hashSha224", () => {
  test("hashes a blob with SHA-224", async () => {
    const input = "hello"
    const digest = await hashSha224(new Blob([input]))
    const expectedHex = createHash("sha224").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(
      createHash("sha224").update(input).digest("base64")
    )
  })

  test("hashes binary file data", async () => {
    const input = Uint8Array.from([0, 255, 1, 128, 64])
    const digest = await hashSha224(new Blob([input]))

    expect(digest.hex).toBe(createHash("sha224").update(input).digest("hex"))
  })
})

describe("formatSha224Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatSha224Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
