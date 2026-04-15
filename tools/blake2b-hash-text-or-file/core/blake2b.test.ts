import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import {
  INVALID_BLAKE2B_KEY_BASE64_ERROR,
  INVALID_BLAKE2B_OUTPUT_LENGTH_ERROR,
  INVALID_BLAKE2B_OUTPUT_LENGTH_STEP_ERROR,
  formatBlake2bDigest,
  hashBlake2b,
} from "./blake2b"

describe("hashBlake2b", () => {
  test("hashes a blob with the default 512-bit BLAKE2b digest", async () => {
    const input = "hello"
    const digest = await hashBlake2b(new Blob([input]), {
      outputLength: 512,
    })

    expect(digest.hex).toBe(
      createHash("blake2b512").update(input).digest("hex")
    )
    expect(digest.base64).toBe(
      createHash("blake2b512").update(input).digest("base64")
    )
  })

  test("hashes a blob with a 256-bit output", async () => {
    const digest = await hashBlake2b(new Blob(["hello"]), {
      outputLength: 256,
    })

    expect(digest.hex).toBe(
      "324dcf027dd4a30a932c441f365a25e86b173defa4b8e58948253471b81b72cf"
    )
  })

  test("hashes a blob with a keyed 256-bit output", async () => {
    const digest = await hashBlake2b(new Blob(["hello"]), {
      outputLength: 256,
      keyBase64: "a2V5\n",
    })

    expect(digest.hex).toBe(
      "30002f17070c8cee9d5cc38cc0bf4ef6f2c709b2c8f556dcd5e7f8c20901bb30"
    )
  })

  test("throws when the key is not valid Base64", async () => {
    await expect(
      hashBlake2b(new Blob(["hello"]), {
        outputLength: 512,
        keyBase64: "***",
      })
    ).rejects.toThrow(INVALID_BLAKE2B_KEY_BASE64_ERROR)
  })

  test("throws when the output length is out of range", async () => {
    await expect(
      hashBlake2b(new Blob(["hello"]), {
        outputLength: 520,
      })
    ).rejects.toThrow(INVALID_BLAKE2B_OUTPUT_LENGTH_ERROR)
  })

  test("throws when the output length is not a multiple of 8 bits", async () => {
    await expect(
      hashBlake2b(new Blob(["hello"]), {
        outputLength: 510,
      })
    ).rejects.toThrow(INVALID_BLAKE2B_OUTPUT_LENGTH_STEP_ERROR)
  })
})

describe("formatBlake2bDigest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatBlake2bDigest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
