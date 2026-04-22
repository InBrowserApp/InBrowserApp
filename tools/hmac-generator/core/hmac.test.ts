import { createHmac, webcrypto } from "node:crypto"

import { describe, expect, test } from "vitest"

import { HMAC_ALGORITHMS, generateHmac } from "./hmac"

describe("generateHmac", () => {
  test.each(HMAC_ALGORITHMS)(
    "generates %s HMAC output for string and file input",
    async (algorithm) => {
      const textInput = "hello"
      const secretKey = "secret"
      const subtle = webcrypto.subtle as unknown as Pick<
        SubtleCrypto,
        "importKey" | "sign"
      >

      const textDigest = await generateHmac(
        new Blob([textInput]),
        secretKey,
        algorithm,
        subtle
      )
      const fileDigest = await generateHmac(
        new Blob([textInput]),
        secretKey,
        algorithm,
        subtle
      )
      const expected = createHmac(
        algorithm.toLowerCase().replace("-", ""),
        secretKey
      ).update(textInput)

      expect(textDigest).toEqual({
        hex: expected.digest("hex"),
        base64: createHmac(algorithm.toLowerCase().replace("-", ""), secretKey)
          .update(textInput)
          .digest("base64"),
      })
      expect(fileDigest).toEqual(textDigest)
    }
  )

  test("throws when Web Crypto is unavailable", async () => {
    await expect(
      generateHmac(
        new Blob(["hello"]),
        "secret",
        "SHA-256",
        null as unknown as Pick<SubtleCrypto, "importKey" | "sign">
      )
    ).rejects.toThrow("HMAC generation requires Web Crypto support.")
  })
})
