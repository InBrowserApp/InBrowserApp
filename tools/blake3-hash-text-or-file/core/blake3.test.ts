import { beforeEach, describe, expect, test, vi } from "vitest"

const blake3Mocks = vi.hoisted(() => {
  const createHash = vi.fn()
  const createKeyed = vi.fn()
  const loadBlake3 = vi.fn(async () => ({
    createHash,
    createKeyed,
  }))

  return {
    createHash,
    createKeyed,
    loadBlake3,
  }
})

vi.mock("blake3-wasm/browser-async", () => ({
  default: blake3Mocks.loadBlake3,
}))

vi.mock("blake3-wasm/dist/wasm/web/blake3_js_bg.wasm?url", () => ({
  default: "/mock/blake3.wasm",
}))

import {
  INVALID_BLAKE3_KEY_BASE64_ERROR,
  INVALID_BLAKE3_OUTPUT_LENGTH_ERROR,
  INVALID_BLAKE3_OUTPUT_LENGTH_STEP_ERROR,
  formatBlake3Digest,
  hashBlake3,
} from "./blake3"

describe("hashBlake3", () => {
  beforeEach(() => {
    blake3Mocks.createHash.mockReset()
    blake3Mocks.createKeyed.mockReset()
  })

  test("hashes a blob with the default 256-bit BLAKE3 digest", async () => {
    const hasher = {
      update: vi.fn(),
      digest: vi.fn(() => Uint8Array.from([0, 1, 2, 255])),
    }

    blake3Mocks.createHash.mockReturnValue(hasher)

    const digest = await hashBlake3(new Blob(["hello"]), {
      outputLength: 256,
    })

    expect(blake3Mocks.loadBlake3).toHaveBeenCalledWith("/mock/blake3.wasm")
    expect(blake3Mocks.createHash).toHaveBeenCalledTimes(1)
    expect(blake3Mocks.createKeyed).not.toHaveBeenCalled()
    expect(Array.from(hasher.update.mock.calls[0]?.[0] ?? [])).toEqual([
      104, 101, 108, 108, 111,
    ])
    expect(hasher.digest).toHaveBeenCalledWith({ length: 32 })
    expect(digest).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })

  test("hashes a blob with a 128-bit output", async () => {
    const hasher = {
      update: vi.fn(),
      digest: vi.fn(() => Uint8Array.from([1, 2, 3, 4])),
    }

    blake3Mocks.createHash.mockReturnValue(hasher)

    const digest = await hashBlake3(new Blob(["hello"]), {
      outputLength: 128,
    })

    expect(blake3Mocks.createHash).toHaveBeenCalledTimes(1)
    expect(hasher.digest).toHaveBeenCalledWith({ length: 16 })
    expect(digest.hex).toBe("01020304")
  })

  test("uses keyed hashing when the decoded key is exactly 32 bytes", async () => {
    const keyedHasher = {
      update: vi.fn(),
      digest: vi.fn(() => Uint8Array.from([9, 10, 11, 12])),
    }

    blake3Mocks.createKeyed.mockReturnValue(keyedHasher)

    const digest = await hashBlake3(new Blob(["hello"]), {
      outputLength: 128,
      keyBase64: Buffer.alloc(32, 1).toString("base64"),
    })

    expect(blake3Mocks.createKeyed).toHaveBeenCalledTimes(1)
    expect(blake3Mocks.createHash).not.toHaveBeenCalled()
    expect(keyedHasher.digest).toHaveBeenCalledWith({ length: 16 })
    expect(digest.hex).toBe("090a0b0c")
  })

  test("falls back to the unkeyed hasher when the decoded key is not 32 bytes", async () => {
    const hasher = {
      update: vi.fn(),
      digest: vi.fn(() => Uint8Array.from([13, 14, 15, 16])),
    }

    blake3Mocks.createHash.mockReturnValue(hasher)

    const digest = await hashBlake3(new Blob(["hello"]), {
      outputLength: 256,
      keyBase64: "a2V5\n",
    })

    expect(blake3Mocks.createKeyed).not.toHaveBeenCalled()
    expect(blake3Mocks.createHash).toHaveBeenCalledTimes(1)
    expect(digest.hex).toBe("0d0e0f10")
  })

  test("throws when the key is not valid Base64", async () => {
    await expect(
      hashBlake3(new Blob(["hello"]), {
        outputLength: 256,
        keyBase64: "***",
      })
    ).rejects.toThrow(INVALID_BLAKE3_KEY_BASE64_ERROR)
  })

  test("throws when the output length is out of range", async () => {
    await expect(
      hashBlake3(new Blob(["hello"]), {
        outputLength: 264,
      })
    ).rejects.toThrow(INVALID_BLAKE3_OUTPUT_LENGTH_ERROR)
  })

  test("throws when the output length is not a multiple of 8 bits", async () => {
    await expect(
      hashBlake3(new Blob(["hello"]), {
        outputLength: 126,
      })
    ).rejects.toThrow(INVALID_BLAKE3_OUTPUT_LENGTH_STEP_ERROR)
  })
})

describe("formatBlake3Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatBlake3Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})
