import { createHash, webcrypto } from "node:crypto"

import { describe, expect, test } from "vitest"

import {
  HASH_ALGORITHMS,
  formatHashDigest,
  hashSource,
  isHashAlgorithm,
  type HashAlgorithm,
} from "./hash"

const NODE_ALGORITHM_BY_WEB_CRYPTO_ALGORITHM = {
  "SHA-1": "sha1",
  "SHA-256": "sha256",
  "SHA-384": "sha384",
  "SHA-512": "sha512",
} as const satisfies Record<HashAlgorithm, string>

describe("hashSource", () => {
  test.each(HASH_ALGORITHMS)("hashes a blob with %s", async (algorithm) => {
    const input = "hello"
    const digest = await hashSource(
      new Blob([input]),
      algorithm,
      webcrypto.subtle satisfies Pick<SubtleCrypto, "digest">
    )
    const nodeAlgorithm = NODE_ALGORITHM_BY_WEB_CRYPTO_ALGORITHM[algorithm]

    expect(digest.hex).toBe(
      createHash(nodeAlgorithm).update(input).digest("hex")
    )
    expect(digest.base64).toBe(
      createHash(nodeAlgorithm).update(input).digest("base64")
    )
  })

  test("throws when Web Crypto is unavailable", async () => {
    await expect(
      hashSource(
        new Blob(["hello"]),
        "SHA-256",
        null as unknown as Pick<SubtleCrypto, "digest">
      )
    ).rejects.toThrow("SHA-256 hashing requires Web Crypto support.")
  })
})

describe("formatHashDigest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatHashDigest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})

describe("isHashAlgorithm", () => {
  test("accepts supported Web Crypto SHA algorithms", () => {
    expect(isHashAlgorithm("SHA-256")).toBe(true)
  })

  test("rejects unsupported algorithms", () => {
    expect(isHashAlgorithm("MD5")).toBe(false)
  })
})
