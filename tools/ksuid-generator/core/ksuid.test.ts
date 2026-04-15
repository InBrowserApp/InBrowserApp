import { describe, expect, test, vi } from "vitest"

import {
  KSUID_EPOCH_SECONDS,
  KSUID_LENGTH,
  KSUID_MAX_COUNT,
  MAX_KSUID_TIMESTAMP,
  createKsuidBytes,
  encodeKsuid,
  generateKsuid,
  generateKsuidIds,
  isValidKsuidUnixSeconds,
  normalizeKsuidCount,
} from "./ksuid"

describe("ksuid", () => {
  test("validates unix seconds against the KSUID epoch range", () => {
    expect(isValidKsuidUnixSeconds(Number.NaN)).toBe(false)
    expect(isValidKsuidUnixSeconds(KSUID_EPOCH_SECONDS - 1)).toBe(false)
    expect(isValidKsuidUnixSeconds(KSUID_EPOCH_SECONDS)).toBe(true)
    expect(
      isValidKsuidUnixSeconds(KSUID_EPOCH_SECONDS + MAX_KSUID_TIMESTAMP)
    ).toBe(true)
    expect(
      isValidKsuidUnixSeconds(KSUID_EPOCH_SECONDS + MAX_KSUID_TIMESTAMP + 1)
    ).toBe(false)
  })

  test("normalizes the count to the supported range", () => {
    expect(normalizeKsuidCount(undefined)).toBe(1)
    expect(normalizeKsuidCount(0)).toBe(1)
    expect(normalizeKsuidCount(3.9)).toBe(3)
    expect(normalizeKsuidCount(KSUID_MAX_COUNT + 10)).toBe(KSUID_MAX_COUNT)
  })

  test("creates bytes with the timestamp prefix and payload", () => {
    const payload = Uint8Array.from({ length: 16 }, (_, index) => index + 1)
    const bytes = createKsuidBytes(KSUID_EPOCH_SECONDS + 1, payload)

    expect(Array.from(bytes.slice(0, 4))).toEqual([0, 0, 0, 1])
    expect(Array.from(bytes.slice(4))).toEqual(Array.from(payload))
  })

  test("rejects invalid timestamps and payload lengths", () => {
    expect(() => createKsuidBytes(KSUID_EPOCH_SECONDS - 1)).toThrow(RangeError)
    expect(() =>
      createKsuidBytes(KSUID_EPOCH_SECONDS, new Uint8Array(15))
    ).toThrow("KSUID requires 16 random bytes")
  })

  test("encodes deterministic KSUIDs with a fixed payload", () => {
    const payload = new Uint8Array(16)
    const ksuid = generateKsuid(KSUID_EPOCH_SECONDS, payload)

    expect(ksuid).toMatch(/^[0-9A-Za-z]+$/u)
    expect(ksuid).toHaveLength(KSUID_LENGTH)
    expect(encodeKsuid(createKsuidBytes(KSUID_EPOCH_SECONDS, payload))).toBe(
      ksuid
    )
  })

  test("rejects KSUID byte arrays with the wrong length", () => {
    expect(() => encodeKsuid(new Uint8Array(19))).toThrow(
      "KSUID requires 20 bytes"
    )
  })

  test("sorts lexicographically by timestamp when payload is the same", () => {
    const payload = new Uint8Array(16)
    const first = generateKsuid(KSUID_EPOCH_SECONDS, payload)
    const second = generateKsuid(KSUID_EPOCH_SECONDS + 1, payload)

    expect(first < second).toBe(true)
  })

  test("generates batches with normalized counts", () => {
    const spy = vi
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation((array) => array)

    const results = generateKsuidIds(KSUID_MAX_COUNT + 50, KSUID_EPOCH_SECONDS)

    expect(results).toHaveLength(KSUID_MAX_COUNT)
    expect(spy).toHaveBeenCalledTimes(KSUID_MAX_COUNT)
  })
})
