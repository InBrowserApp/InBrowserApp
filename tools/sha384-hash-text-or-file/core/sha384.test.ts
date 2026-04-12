import { createHash, webcrypto } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatSha384Digest, hashSha384 } from "./sha384"

describe("hashSha384", () => {
  test("hashes a blob with SHA-384", async () => {
    const input = "hello"
    const digest = await hashSha384(
      new Blob([input]),
      webcrypto.subtle satisfies Pick<SubtleCrypto, "digest">
    )
    const expectedHex = createHash("sha384").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(
      createHash("sha384").update(input).digest("base64")
    )
  })

  test("throws when Web Crypto is unavailable", async () => {
    await expect(
      hashSha384(
        new Blob(["hello"]),
        null as unknown as Pick<SubtleCrypto, "digest">
      )
    ).rejects.toThrow("SHA-384 hashing requires Web Crypto support.")
  })
})

describe("formatSha384Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatSha384Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
