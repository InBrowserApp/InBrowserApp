import { afterEach, describe, expect, test, vi } from "vitest"

import {
  UUID_V4_BYTE_LENGTH,
  formatUuidV4Bytes,
  generateUuidV4,
  isCanonicalUuidV4,
} from "./uuid-v4"

const sequentialBytes = Uint8Array.from(
  { length: UUID_V4_BYTE_LENGTH },
  (_, index) => index
)

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("uuid-v4 core", () => {
  test("formats canonical UUID v4 values from random bytes", () => {
    expect(formatUuidV4Bytes(sequentialBytes)).toBe(
      "00010203-0405-4607-8809-0a0b0c0d0e0f"
    )
  })

  test("does not mutate the caller-provided random bytes", () => {
    const bytes = Uint8Array.from(sequentialBytes)

    formatUuidV4Bytes(bytes)

    expect(bytes).toEqual(sequentialBytes)
  })

  test("rejects byte arrays that cannot hold one UUID", () => {
    expect(() => formatUuidV4Bytes(new Uint8Array(15))).toThrow(RangeError)
    expect(() => formatUuidV4Bytes(new Uint8Array(17))).toThrow(RangeError)
  })

  test("generates UUID v4 values from the provided random source", () => {
    const randomBytesSource = vi.fn(() => Uint8Array.from(sequentialBytes))

    const uuid = generateUuidV4(randomBytesSource)

    expect(randomBytesSource).toHaveBeenCalledWith(UUID_V4_BYTE_LENGTH)
    expect(uuid).toBe("00010203-0405-4607-8809-0a0b0c0d0e0f")
    expect(isCanonicalUuidV4(uuid)).toBe(true)
  })

  test("validates only lowercase canonical UUID v4 strings", () => {
    expect(isCanonicalUuidV4("00010203-0405-4607-8809-0a0b0c0d0e0f")).toBe(true)
    expect(isCanonicalUuidV4("00010203-0405-3607-8809-0a0b0c0d0e0f")).toBe(
      false
    )
    expect(isCanonicalUuidV4("00010203-0405-4607-c809-0a0b0c0d0e0f")).toBe(
      false
    )
    expect(isCanonicalUuidV4("00010203-0405-4607-8809-0A0B0C0D0E0F")).toBe(
      false
    )
    expect(isCanonicalUuidV4("not-a-uuid")).toBe(false)
  })

  test("uses Web Crypto random values by default", () => {
    const getRandomValues = vi
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation((array) => {
        const bytes = new Uint8Array(
          array.buffer,
          array.byteOffset,
          array.byteLength
        )

        bytes.set(sequentialBytes)
        return array
      })

    expect(generateUuidV4()).toBe("00010203-0405-4607-8809-0a0b0c0d0e0f")
    expect(getRandomValues).toHaveBeenCalledOnce()
  })

  test("fails clearly when Web Crypto random values are unavailable", () => {
    vi.stubGlobal("crypto", {})

    expect(() => generateUuidV4()).toThrow(
      "Web Crypto random values are not available."
    )
  })
})
