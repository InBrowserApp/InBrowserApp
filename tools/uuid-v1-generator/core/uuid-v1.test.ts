import { afterEach, describe, expect, test, vi } from "vitest"

import {
  UUID_V1_MAX_CLOCK_SEQUENCE,
  UUID_V1_MAX_COUNT,
  createUuidV1Bytes,
  formatMacAddress,
  generateUuidV1,
  generateUuidV1Batch,
  isValidUuidV1ClockSequence,
  normalizeMacAddress,
  normalizeUuidV1ClockSequence,
  normalizeUuidV1Count,
  parseMacAddress,
  randomMacAddress,
  randomUuidV1ClockSequence,
} from "./uuid-v1"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("uuid-v1", () => {
  test("normalizes count and clock sequence inputs", () => {
    expect(normalizeUuidV1Count(undefined)).toBe(1)
    expect(normalizeUuidV1Count(0)).toBe(1)
    expect(normalizeUuidV1Count(3.9)).toBe(3)
    expect(normalizeUuidV1Count(UUID_V1_MAX_COUNT + 1)).toBe(UUID_V1_MAX_COUNT)

    expect(normalizeUuidV1ClockSequence(undefined)).toBe(0)
    expect(normalizeUuidV1ClockSequence(-1)).toBe(0)
    expect(normalizeUuidV1ClockSequence(42.9)).toBe(42)
    expect(normalizeUuidV1ClockSequence(UUID_V1_MAX_CLOCK_SEQUENCE + 1)).toBe(
      UUID_V1_MAX_CLOCK_SEQUENCE
    )
  })

  test("validates clock sequence range", () => {
    expect(isValidUuidV1ClockSequence(-1)).toBe(false)
    expect(isValidUuidV1ClockSequence(0)).toBe(true)
    expect(isValidUuidV1ClockSequence(42.5)).toBe(false)
    expect(isValidUuidV1ClockSequence(UUID_V1_MAX_CLOCK_SEQUENCE)).toBe(true)
    expect(isValidUuidV1ClockSequence(UUID_V1_MAX_CLOCK_SEQUENCE + 1)).toBe(
      false
    )
  })

  test("parses and formats common MAC address forms", () => {
    const parsed = parseMacAddress("00:11-22.33 44:55")

    expect(parsed ? Array.from(parsed) : null).toEqual([
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55,
    ])
    expect(normalizeMacAddress("001122334455")).toBe("00:11:22:33:44:55")
    expect(normalizeMacAddress("00:11:22:33:44")).toBeNull()
    expect(normalizeMacAddress("00:11:22:33:44:5Z")).toBeNull()
  })

  test("rejects malformed node byte arrays", () => {
    expect(() => formatMacAddress(new Uint8Array(5))).toThrow(
      "UUID v1 node must contain 6 bytes"
    )
  })

  test("generates locally administered random MAC addresses", () => {
    vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
      (array) => {
        const bytes = array as Uint8Array

        for (let index = 0; index < bytes.length; index += 1) {
          bytes[index] = index
        }

        return array
      }
    )

    expect(randomMacAddress()).toBe("02:01:02:03:04:05")
  })

  test("generates random clock sequences within the UUID v1 range", () => {
    vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
      (array) => {
        const bytes = array as Uint8Array

        bytes[0] = 0xff
        bytes[1] = 0xff
        return array
      }
    )

    expect(randomUuidV1ClockSequence()).toBe(UUID_V1_MAX_CLOCK_SEQUENCE)
  })

  test("generates deterministic UUID v1 values", () => {
    const node = parseMacAddress("00:11:22:33:44:55")!
    const uuid = generateUuidV1({
      msecs: 0,
      node,
      clockSequence: 0x1234,
      nsecs: 0,
    })

    expect(uuid).toBe("13814000-1dd2-11b2-9234-001122334455")
    expect(
      Array.from(createUuidV1Bytes({ msecs: 0, node, clockSequence: 0 }))
    ).toHaveLength(16)
  })

  test("increments 100ns ticks for batches in the same millisecond", () => {
    const node = parseMacAddress("00:11:22:33:44:55")!

    expect(
      generateUuidV1Batch(2, {
        msecs: 0,
        node,
        clockSequence: 0x1234,
      })
    ).toEqual([
      "13814000-1dd2-11b2-9234-001122334455",
      "13814001-1dd2-11b2-9234-001122334455",
    ])
  })

  test("rejects invalid generation options", () => {
    const node = parseMacAddress("00:11:22:33:44:55")!

    expect(() =>
      generateUuidV1({ msecs: Number.NaN, node, clockSequence: 0 })
    ).toThrow("UUID v1 timestamp must be finite")
    expect(() =>
      generateUuidV1({
        msecs: 0,
        node: new Uint8Array(5),
        clockSequence: 0,
      })
    ).toThrow("UUID v1 node must contain 6 bytes")
    expect(() => generateUuidV1({ msecs: 0, node, clockSequence: -1 })).toThrow(
      "UUID v1 clock sequence must be between 0 and 16383"
    )
    expect(() =>
      generateUuidV1({ msecs: 0, node, clockSequence: 0, nsecs: 10_000 })
    ).toThrow("UUID v1 nsecs must be between 0 and 9999")
    expect(() =>
      generateUuidV1Batch(2, {
        msecs: 0,
        node,
        clockSequence: 0,
        nsecs: 9_999,
      })
    ).toThrow("UUID v1 batch exceeds one millisecond")
  })
})
