import { afterEach, describe, expect, test, vi } from "vitest"

import {
  UUID_V7_DEFAULT_COUNT,
  UUID_V7_MAX_COUNT,
  UUID_V7_MAX_TIMESTAMP_MS,
  createUuidV7Generator,
  generateUuidV7Ids,
  isUuidV7,
  normalizeUnixTimestampMs,
  normalizeUuidV7Count,
  parseUuidV7Timestamp,
} from "./uuid-v7"

function fillWithSequence(bytes: Uint8Array) {
  bytes.forEach((_, index) => {
    bytes[index] = index
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("uuid v7 core", () => {
  test("normalizes batch count within supported bounds", () => {
    expect(normalizeUuidV7Count(undefined)).toBe(UUID_V7_DEFAULT_COUNT)
    expect(normalizeUuidV7Count(null)).toBe(UUID_V7_DEFAULT_COUNT)
    expect(normalizeUuidV7Count(Number.NaN)).toBe(UUID_V7_DEFAULT_COUNT)
    expect(normalizeUuidV7Count(0)).toBe(1)
    expect(normalizeUuidV7Count(UUID_V7_MAX_COUNT + 10)).toBe(UUID_V7_MAX_COUNT)
    expect(normalizeUuidV7Count(4.9)).toBe(4)
  })

  test("normalizes Unix timestamps to the UUID v7 timestamp range", () => {
    expect(normalizeUnixTimestampMs(Number.NaN)).toBe(0)
    expect(normalizeUnixTimestampMs(-1)).toBe(0)
    expect(normalizeUnixTimestampMs(123.9)).toBe(123)
    expect(normalizeUnixTimestampMs(UUID_V7_MAX_TIMESTAMP_MS + 1)).toBe(
      UUID_V7_MAX_TIMESTAMP_MS
    )
  })

  test("creates an RFC-shaped UUID v7 from timestamp and random bytes", () => {
    const timestamp = 0x0123456789ab
    const generate = createUuidV7Generator({
      now: () => timestamp,
      randomBytes: fillWithSequence,
    })
    const uuid = generate()

    expect(uuid).toBe("01234567-89ab-7001-8203-040506070809")
    expect(isUuidV7(uuid)).toBe(true)
    expect(parseUuidV7Timestamp(uuid)).toBe(timestamp)
  })

  test("keeps UUIDs lexically ordered within the same millisecond", () => {
    const generate = createUuidV7Generator({
      now: () => 1_700_000_000_000,
      randomBytes: (bytes) => bytes.fill(0),
    })
    const ids = [generate(), generate(), generate()]

    expect(ids).toEqual([...ids].sort())
    expect(ids.map((id) => id.slice(14, 18))).toEqual(["7000", "7001", "7002"])
  })

  test("uses a logical next timestamp when the per-millisecond sequence wraps", () => {
    const generate = createUuidV7Generator({
      now: () => 1_700_000_000_000,
      randomBytes: (bytes) => {
        bytes.fill(0)
        bytes[0] = 0x0f
        bytes[1] = 0xff
      },
    })
    const first = generate()
    const second = generate()

    expect(first.slice(14, 18)).toBe("7fff")
    expect(parseUuidV7Timestamp(second)).toBe(1_700_000_000_001)
  })

  test("falls back to a monotonic sequence when the clock moves backward", () => {
    const times = [1_700_000_000_010, 1_700_000_000_000]
    const generate = createUuidV7Generator({
      now: () => times.shift() ?? 1_700_000_000_000,
      randomBytes: (bytes) => bytes.fill(0),
    })
    const first = generate()
    const second = generate()

    expect(parseUuidV7Timestamp(first)).toBe(1_700_000_000_010)
    expect(parseUuidV7Timestamp(second)).toBe(1_700_000_000_010)
    expect(second.localeCompare(first)).toBeGreaterThan(0)
  })

  test("generates a normalized batch of valid UUID v7 identifiers", () => {
    const ids = generateUuidV7Ids(3, {
      now: () => 1_700_000_000_000,
      randomBytes: fillWithSequence,
    })

    expect(ids).toHaveLength(3)
    expect(ids.every(isUuidV7)).toBe(true)
  })

  test("validates UUID v7 strings case-insensitively", () => {
    expect(isUuidV7("01234567-89AB-7001-8203-040506070809")).toBe(true)
    expect(isUuidV7("01234567-89ab-6001-8203-040506070809")).toBe(false)
    expect(isUuidV7("01234567-89ab-7001-7203-040506070809")).toBe(false)
    expect(parseUuidV7Timestamp("not-a-uuid")).toBeNull()
  })

  test("uses crypto.getRandomValues when no custom random source is passed", () => {
    const getRandomValues = vi.fn((bytes: Uint8Array) => {
      bytes.fill(0)
      return bytes
    })

    vi.stubGlobal("crypto", { getRandomValues })

    const uuid = createUuidV7Generator({ now: () => 0 })()

    expect(uuid).toBe("00000000-0000-7000-8000-000000000000")
    expect(getRandomValues).toHaveBeenCalled()
  })

  test("throws a clear error when Web Crypto is unavailable", () => {
    vi.stubGlobal("crypto", undefined)

    expect(() => createUuidV7Generator({ now: () => 0 })()).toThrow(
      "crypto.getRandomValues"
    )
  })
})
