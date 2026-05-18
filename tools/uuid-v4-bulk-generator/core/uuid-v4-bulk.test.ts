import { afterEach, describe, expect, test, vi } from "vitest"

import {
  UUID_V4_BULK_DEFAULT_COUNT,
  UUID_V4_BULK_MAX_COUNT,
  UUID_V4_BULK_MIN_COUNT,
  formatUuidV4Bytes,
  generateUuidV4,
  generateUuidV4Batch,
  isUuidV4,
  normalizeUuidV4BulkCount,
} from "./uuid-v4-bulk"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("uuid v4 bulk core", () => {
  test("normalizes batch count within supported bounds", () => {
    expect(normalizeUuidV4BulkCount(undefined)).toBe(UUID_V4_BULK_DEFAULT_COUNT)
    expect(normalizeUuidV4BulkCount(null)).toBe(UUID_V4_BULK_DEFAULT_COUNT)
    expect(normalizeUuidV4BulkCount(Number.NaN)).toBe(
      UUID_V4_BULK_DEFAULT_COUNT
    )
    expect(normalizeUuidV4BulkCount(0)).toBe(UUID_V4_BULK_MIN_COUNT)
    expect(normalizeUuidV4BulkCount(12.9)).toBe(12)
    expect(normalizeUuidV4BulkCount(UUID_V4_BULK_MAX_COUNT + 10)).toBe(
      UUID_V4_BULK_MAX_COUNT
    )
  })

  test("generates the requested number of UUIDs with an injected generator", () => {
    let index = 0
    const ids = generateUuidV4Batch(3, () => {
      index += 1
      return `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`
    })

    expect(ids).toEqual([
      "00000000-0000-4000-8000-000000000001",
      "00000000-0000-4000-8000-000000000002",
      "00000000-0000-4000-8000-000000000003",
    ])
  })

  test("uses native crypto.randomUUID when available", () => {
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn(() => "7d0f8a31-946c-42d2-84aa-6eeacb50d3f1"),
    })

    expect(generateUuidV4()).toBe("7d0f8a31-946c-42d2-84aa-6eeacb50d3f1")
    expect(globalThis.crypto.randomUUID).toHaveBeenCalled()
  })

  test("falls back to getRandomValues and forces version and variant bits", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: vi.fn((array: Uint8Array) => {
        array.set(
          new Uint8Array([
            0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x06, 0x77, 0x08, 0x99, 0xaa,
            0xbb, 0xcc, 0xdd, 0xee, 0xff,
          ])
        )
        return array
      }),
    })

    const uuid = generateUuidV4()

    expect(uuid).toBe("00112233-4455-4677-8899-aabbccddeeff")
    expect(isUuidV4(uuid)).toBe(true)
  })

  test("formats raw random bytes as a UUID v4 string", () => {
    const uuid = formatUuidV4Bytes(
      new Uint8Array([
        0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa, 0x00, 0x99, 0xff, 0x88, 0x77, 0x66,
        0x55, 0x44, 0x33, 0x22,
      ])
    )

    expect(uuid).toBe("ffeeddcc-bbaa-4099-bf88-776655443322")
  })

  test("rejects byte arrays that cannot represent a UUID", () => {
    expect(() => formatUuidV4Bytes(new Uint8Array(15))).toThrow(
      "UUID v4 generation requires exactly 16 random bytes."
    )
  })

  test("validates only lowercase RFC 4122 UUID v4 strings", () => {
    expect(isUuidV4("7d0f8a31-946c-42d2-84aa-6eeacb50d3f1")).toBe(true)
    expect(isUuidV4("7d0f8a31-946c-32d2-84aa-6eeacb50d3f1")).toBe(false)
    expect(isUuidV4("7d0f8a31-946c-42d2-c4aa-6eeacb50d3f1")).toBe(false)
    expect(isUuidV4("7D0F8A31-946C-42D2-84AA-6EEACB50D3F1")).toBe(false)
    expect(isUuidV4("not-a-uuid")).toBe(false)
  })

  test("throws a clear error when secure randomness is unavailable", () => {
    vi.stubGlobal("crypto", undefined)

    expect(() => generateUuidV4()).toThrow(
      "Secure random values are unavailable in this browser."
    )
  })

  test("throws a clear error when no secure random API is available", () => {
    vi.stubGlobal("crypto", {})

    expect(() => generateUuidV4()).toThrow(
      "Secure random values are unavailable in this browser."
    )
  })
})
