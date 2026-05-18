import { describe, expect, test, vi } from "vitest"

import {
  UUID_CLOCK_SEQUENCE_MAX,
  UUID_V6_MAX_COUNT,
  bytesToUuid,
  createRandomUuidClockSequence,
  createRandomUuidNode,
  createUuidV6Bytes,
  formatUuidNode,
  generateUuidV6,
  generateUuidV6Batch,
  isValidUuidClockSequence,
  isValidUuidV6UnixMilliseconds,
  normalizeUuidV6Count,
  parseUuidNode,
  unixMillisecondsToUuidTimestamp,
} from "./uuid-v6"

const UUID_V6_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u

describe("uuid-v6", () => {
  test("normalizes batch counts to the supported range", () => {
    expect(normalizeUuidV6Count(undefined)).toBe(1)
    expect(normalizeUuidV6Count(0)).toBe(1)
    expect(normalizeUuidV6Count(2.9)).toBe(2)
    expect(normalizeUuidV6Count(UUID_V6_MAX_COUNT + 1)).toBe(UUID_V6_MAX_COUNT)
  })

  test("validates clock sequence and timestamp inputs", () => {
    expect(isValidUuidClockSequence(0)).toBe(true)
    expect(isValidUuidClockSequence(UUID_CLOCK_SEQUENCE_MAX)).toBe(true)
    expect(isValidUuidClockSequence(-1)).toBe(false)
    expect(isValidUuidClockSequence(UUID_CLOCK_SEQUENCE_MAX + 1)).toBe(false)
    expect(isValidUuidClockSequence(1.5)).toBe(false)

    expect(isValidUuidV6UnixMilliseconds(Date.UTC(2026, 0, 1))).toBe(true)
    expect(isValidUuidV6UnixMilliseconds(Number.NaN)).toBe(false)
  })

  test("parses and formats node identifiers", () => {
    const node = Uint8Array.from([0, 17, 34, 51, 68, 85])

    expect(parseUuidNode("00:11:22:33:44:55")).toEqual(node)
    expect(parseUuidNode("00-11-22-33-44-55")).toEqual(node)
    expect(parseUuidNode("0011.2233.4455")).toEqual(node)
    expect(parseUuidNode("001122334455")).toEqual(node)
    expect(formatUuidNode(node)).toBe("00:11:22:33:44:55")
    expect(() => parseUuidNode("00:11:22")).toThrow("Invalid UUID node ID.")
    expect(() => formatUuidNode(new Uint8Array(5))).toThrow(
      "UUID node ID requires 6 bytes."
    )
  })

  test("creates RFC 9562 UUID v6 bytes with version and variant bits", () => {
    const bytes = createUuidV6Bytes({
      unixMilliseconds: -12_219_292_800_000,
      clockSequence: 0,
      node: new Uint8Array(6),
    })

    expect(bytesToUuid(bytes)).toBe("00000000-0000-6000-8000-000000000000")
    expect(bytes[6]! >> 4).toBe(6)
    expect(bytes[8]! >> 6).toBe(2)
  })

  test("generates sortable UUID v6 strings for nearby ticks", () => {
    const node = parseUuidNode("02:00:00:00:00:01")
    const first = generateUuidV6({
      unixMilliseconds: Date.UTC(2026, 0, 1),
      clockSequence: 7,
      node,
    })
    const second = generateUuidV6({
      unixMilliseconds: Date.UTC(2026, 0, 1),
      subMillisecondTick: 1,
      clockSequence: 7,
      node,
    })

    expect(first).toMatch(UUID_V6_PATTERN)
    expect(second).toMatch(UUID_V6_PATTERN)
    expect(first < second).toBe(true)
    expect(first.endsWith("-020000000001")).toBe(true)
  })

  test("rejects invalid byte arrays and generation inputs", () => {
    expect(() => bytesToUuid(new Uint8Array(15))).toThrow(
      "UUID requires 16 bytes."
    )
    expect(() =>
      generateUuidV6({
        unixMilliseconds: Number.NaN,
        clockSequence: 0,
        node: new Uint8Array(6),
      })
    ).toThrow(RangeError)
    expect(() =>
      generateUuidV6({
        unixMilliseconds: Date.UTC(2026, 0, 1),
        subMillisecondTick: -1,
        clockSequence: 0,
        node: new Uint8Array(6),
      })
    ).toThrow(RangeError)
    expect(() =>
      generateUuidV6({
        unixMilliseconds: Date.UTC(2026, 0, 1),
        clockSequence: UUID_CLOCK_SEQUENCE_MAX + 1,
        node: new Uint8Array(6),
      })
    ).toThrow(RangeError)
    expect(() =>
      generateUuidV6({
        unixMilliseconds: Date.UTC(2026, 0, 1),
        clockSequence: 0,
        node: new Uint8Array(5),
      })
    ).toThrow("UUID node ID requires 6 bytes.")
    expect(() =>
      generateUuidV6({
        unixMilliseconds: 103_072_857_660_684,
        subMillisecondTick: 6_976,
        clockSequence: 0,
        node: new Uint8Array(6),
      })
    ).toThrow(RangeError)
  })

  test("creates privacy-preserving random node IDs and clock sequences", () => {
    const cryptoSpy = vi
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation((array) => {
        const values = array as Uint8Array

        values.fill(0xff)
        return array
      })

    const node = createRandomUuidNode()

    expect(node[0]! & 0x01).toBe(0)
    expect(node[0]! & 0x02).toBe(0x02)
    expect(createRandomUuidClockSequence()).toBe(UUID_CLOCK_SEQUENCE_MAX)
    cryptoSpy.mockRestore()
  })

  test("generates batches with normalized counts and deterministic custom fields", () => {
    const node = parseUuidNode("02:00:00:00:00:01")
    const results = generateUuidV6Batch({
      count: UUID_V6_MAX_COUNT + 10,
      unixMilliseconds: Date.UTC(2026, 0, 1),
      nodeMode: "custom",
      customNode: node,
      clockSequenceMode: "custom",
      customClockSequence: 1,
    })

    expect(results).toHaveLength(UUID_V6_MAX_COUNT)
    expect(new Set(results).size).toBe(UUID_V6_MAX_COUNT)
    expect(results.every((value) => value.endsWith("-020000000001"))).toBe(true)
    expect([...results].sort()).toEqual(results)
  })

  test("generates batches with random modes and safe custom fallbacks", () => {
    const cryptoSpy = vi
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation((array) => {
        const values = array as Uint8Array

        values.fill(0)
        return array
      })
    const unixMilliseconds = Date.UTC(2026, 0, 1)
    const randomResult = generateUuidV6Batch({
      count: 1,
      unixMilliseconds,
      nodeMode: "random",
      clockSequenceMode: "random",
    })[0]!

    expect(randomResult).toMatch(UUID_V6_PATTERN)
    expect(randomResult).toContain("-8000-")
    expect(randomResult.endsWith("-020000000000")).toBe(true)
    cryptoSpy.mockRestore()

    expect(
      generateUuidV6Batch({
        count: 1,
        unixMilliseconds,
        nodeMode: "custom",
        clockSequenceMode: "custom",
      })[0]
    ).toContain("-8000-000000000000")
  })

  test("converts Unix milliseconds to the Gregorian UUID timestamp", () => {
    expect(unixMillisecondsToUuidTimestamp(0)).toBe(122_192_928_000_000_000n)
  })
})
