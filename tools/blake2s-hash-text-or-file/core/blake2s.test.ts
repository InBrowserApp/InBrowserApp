import { createHash } from "node:crypto"

import { describe, expect, test } from "vitest"

import {
  INVALID_BLAKE2S_KEY_BASE64_ERROR,
  INVALID_BLAKE2S_OUTPUT_LENGTH_ERROR,
  INVALID_BLAKE2S_OUTPUT_LENGTH_STEP_ERROR,
  formatBlake2sDigest,
  hashBlake2s,
} from "./blake2s"

describe("hashBlake2s", () => {
  test("hashes a blob with the default 256-bit BLAKE2s digest", async () => {
    const input = "hello"
    const digest = await hashBlake2s(new Blob([input]), {
      outputLength: 256,
    })

    expect(digest.hex).toBe(
      createHash("blake2s256").update(input).digest("hex")
    )
    expect(digest.base64).toBe(
      createHash("blake2s256").update(input).digest("base64")
    )
  })

  test("hashes a blob with a 128-bit output", async () => {
    const digest = await hashBlake2s(new Blob(["hello"]), {
      outputLength: 128,
    })

    expect(digest.hex).toBe("96d539653dbf841c384b53d5f04658e5")
  })

  test("hashes a blob with a keyed 128-bit output", async () => {
    const digest = await hashBlake2s(new Blob(["hello"]), {
      outputLength: 128,
      keyBase64: "a2V5\n",
    })

    expect(digest.hex).toBe("c799966af1eb4f572595b00dbf8a28be")
  })

  test("throws when the key is not valid Base64", async () => {
    await expect(
      hashBlake2s(new Blob(["hello"]), {
        outputLength: 256,
        keyBase64: "***",
      })
    ).rejects.toThrow(INVALID_BLAKE2S_KEY_BASE64_ERROR)
  })

  test("throws when the output length is out of range", async () => {
    await expect(
      hashBlake2s(new Blob(["hello"]), {
        outputLength: 264,
      })
    ).rejects.toThrow(INVALID_BLAKE2S_OUTPUT_LENGTH_ERROR)
  })

  test("throws when the output length is not a multiple of 8 bits", async () => {
    await expect(
      hashBlake2s(new Blob(["hello"]), {
        outputLength: 126,
      })
    ).rejects.toThrow(INVALID_BLAKE2S_OUTPUT_LENGTH_STEP_ERROR)
  })
})

describe("formatBlake2sDigest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatBlake2sDigest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
