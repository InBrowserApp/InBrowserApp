import { afterEach, describe, expect, test, vi } from "vitest"

import {
  ULID_ALPHABET,
  ULID_LENGTH,
  ULID_MAX_COUNT,
  ULID_MIN_BATCH_COUNT,
  ULID_MAX_TIMESTAMP_MS,
  createUlid,
  createUlidFromRandomValue,
  decodeUlidTimestampMs,
  encodeRandomValue,
  encodeTime,
  generateUlid,
  generateUlidBatch,
  isValidUlidTimestampMs,
  normalizeUlidBatchCount,
  normalizeUlidCount,
} from "./ulid"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("ulid", () => {
  test("validates unix millisecond timestamps against the ULID range", () => {
    expect(isValidUlidTimestampMs(Number.NaN)).toBe(false)
    expect(isValidUlidTimestampMs(-1)).toBe(false)
    expect(isValidUlidTimestampMs(0)).toBe(true)
    expect(isValidUlidTimestampMs(ULID_MAX_TIMESTAMP_MS)).toBe(true)
    expect(isValidUlidTimestampMs(ULID_MAX_TIMESTAMP_MS + 1)).toBe(false)
  })

  test("normalizes batch counts to the supported range", () => {
    expect(normalizeUlidCount(undefined)).toBe(1)
    expect(normalizeUlidCount(0)).toBe(1)
    expect(normalizeUlidCount(3.9)).toBe(3)
    expect(normalizeUlidCount(ULID_MAX_COUNT + 10)).toBe(ULID_MAX_COUNT)
    expect(normalizeUlidBatchCount(undefined)).toBe(ULID_MIN_BATCH_COUNT)
    expect(normalizeUlidBatchCount(1)).toBe(ULID_MIN_BATCH_COUNT)
    expect(normalizeUlidBatchCount(3.9)).toBe(3)
  })

  test("encodes ULID time and random segments", () => {
    expect(encodeTime(0)).toBe("0000000000")
    expect(encodeTime(ULID_MAX_TIMESTAMP_MS)).toBe("7ZZZZZZZZZ")
    expect(encodeRandomValue(0n)).toBe("0000000000000000")
    expect(encodeRandomValue((1n << 80n) - 1n)).toBe("ZZZZZZZZZZZZZZZZ")
  })

  test("rejects invalid timestamp and random inputs", () => {
    expect(() => encodeTime(-1)).toThrow(RangeError)
    expect(() => encodeRandomValue(-1n)).toThrow(RangeError)
    expect(() => encodeRandomValue(1n << 80n)).toThrow(RangeError)
    expect(() => createUlid(0, new Uint8Array(9))).toThrow(
      "ULID requires 10 random bytes"
    )
  })

  test("creates deterministic ULIDs from fixed randomness", () => {
    const ulid = createUlid(0, new Uint8Array(10))

    expect(ulid).toBe("00000000000000000000000000")
    expect(ulid).toHaveLength(ULID_LENGTH)
    expect(createUlidFromRandomValue(1, 0n)).toBe("00000000010000000000000000")
  })

  test("decodes timestamps from valid ULIDs", () => {
    expect(decodeUlidTimestampMs("00000000010000000000000000")).toBe(1)
    expect(decodeUlidTimestampMs("0000000001000000000000000")).toBeNull()
    expect(decodeUlidTimestampMs("000000000I0000000000000000")).toBeNull()
    expect(decodeUlidTimestampMs("ZZZZZZZZZZ0000000000000000")).toBeNull()
  })

  test("generates randomized batches with normalized counts", () => {
    const spy = vi
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation((array) => array)

    const results = generateUlidBatch(ULID_MAX_COUNT + 50, 1, false)

    expect(results).toHaveLength(ULID_MAX_COUNT)
    expect(results.every((value) => value.startsWith("0000000001"))).toBe(true)
    expect(spy).toHaveBeenCalledTimes(ULID_MAX_COUNT)
  })

  test("generates monotonic batches that keep lexical order", () => {
    vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
      (array) => {
        const values = array as Uint8Array
        values.fill(0)
        return array
      }
    )

    const results = generateUlidBatch(3, 1, true)

    expect(results).toEqual([...results].sort())
    expect(new Set(results).size).toBe(3)
    expect(globalThis.crypto.getRandomValues).toHaveBeenCalledTimes(1)
  })

  test("keeps monotonic batches in range when randomness starts near max", () => {
    vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
      (array) => {
        const values = array as Uint8Array
        values.fill(0xff)
        return array
      }
    )

    const results = generateUlidBatch(3, 1, true)

    expect(results).toEqual([
      `0000000001${ULID_ALPHABET.at(-1)!.repeat(15)}X`,
      `0000000001${ULID_ALPHABET.at(-1)!.repeat(15)}Y`,
      `0000000001${ULID_ALPHABET.at(-1)!.repeat(16)}`,
    ])
  })

  test("uses the current time by default for single ULID generation", () => {
    vi.spyOn(Date, "now").mockReturnValue(123)
    vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
      (array) => {
        const values = array as Uint8Array
        values.fill(0)
        return array
      }
    )

    expect(generateUlid()).toBe("000000003V0000000000000000")
  })
})
