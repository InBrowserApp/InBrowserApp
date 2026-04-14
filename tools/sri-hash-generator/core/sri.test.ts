import { createHash, webcrypto } from "node:crypto"

import { describe, expect, test } from "vitest"

import { generateSri } from "./sri"

function createSriHash(
  algorithm: "sha256" | "sha384" | "sha512",
  input: string
) {
  return `${algorithm}-${createHash(algorithm).update(input).digest("base64")}`
}

describe("generateSri", () => {
  test("generates SHA-256, SHA-384, and SHA-512 SRI hashes", async () => {
    const input = "hello"
    const digest = await generateSri(
      new Blob([input]),
      webcrypto.subtle satisfies Pick<SubtleCrypto, "digest">
    )

    expect(digest).toEqual({
      sha256: createSriHash("sha256", input),
      sha384: createSriHash("sha384", input),
      sha512: createSriHash("sha512", input),
    })
  })

  test("throws when Web Crypto is unavailable", async () => {
    await expect(
      generateSri(
        new Blob(["hello"]),
        null as unknown as Pick<SubtleCrypto, "digest">
      )
    ).rejects.toThrow("SRI hash generation requires Web Crypto support.")
  })
})
