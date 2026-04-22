import { createHash, webcrypto } from "node:crypto"

import { describe, expect, test } from "vitest"

import { formatSha512Digest, hashSha512 } from "./sha512"

describe("hashSha512", () => {
  test("hashes a blob with SHA-512", async () => {
    const input = "hello"
    const digest = await hashSha512(
      new Blob([input]),
      webcrypto.subtle satisfies Pick<SubtleCrypto, "digest">
    )
    const expectedHex = createHash("sha512").update(input).digest("hex")

    expect(digest.hex).toBe(expectedHex)
    expect(digest.base64).toBe(
      createHash("sha512").update(input).digest("base64")
    )
  })

  test("throws when Web Crypto is unavailable", async () => {
    await expect(
      hashSha512(
        new Blob(["hello"]),
        null as unknown as Pick<SubtleCrypto, "digest">
      )
    ).rejects.toThrow("SHA-512 hashing requires Web Crypto support.")
  })
})

describe("formatSha512Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatSha512Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
