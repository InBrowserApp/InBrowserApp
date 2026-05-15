import { describe, expect, test } from "vitest"

import { createTimeUuid, decodeUuid, isUuid, normalizeUuidInput } from "./uuid"

describe("normalizeUuidInput", () => {
  test("normalizes common pasted UUID forms", () => {
    expect(
      normalizeUuidInput("  URN:UUID:550E8400-E29B-41D4-A716-446655440000  ")
    ).toBe("550e8400-e29b-41d4-a716-446655440000")
    expect(normalizeUuidInput("{550e8400-e29b-41d4-a716-446655440000}")).toBe(
      "550e8400-e29b-41d4-a716-446655440000"
    )
    expect(normalizeUuidInput("550e8400e29b41d4a716446655440000")).toBe(
      "550e8400-e29b-41d4-a716-446655440000"
    )
    expect(normalizeUuidInput("not a uuid")).toBe("not a uuid")
  })
})

describe("isUuid", () => {
  test("checks UUID shape after normalization", () => {
    expect(isUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true)
    expect(isUuid("550e8400e29b41d4a716446655440000")).toBe(true)
    expect(isUuid("550e8400-e29b-41d4-a716")).toBe(false)
  })
})

describe("createTimeUuid", () => {
  test("creates a v1 UUID from a date and random bytes", () => {
    const uuid = createTimeUuid(
      new Date("2026-05-18T01:40:00.123Z"),
      Uint8Array.from([0x12, 0x34, 0x02, 0xaa, 0xbb, 0xcc, 0xdd, 0xee])
    )
    const decoded = decodeUuid(uuid)

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-/)
    expect(decoded).toMatchObject({
      ok: true,
      version: 1,
      versionKind: "time",
      variant: 1,
      variantKind: "rfc4122",
      timestamp: {
        unixMilliseconds: 1779068400123,
        utcIso: "2026-05-18T01:40:00.123Z",
      },
      clockSequence: 4660,
      node: {
        value: "03:AA:BB:CC:DD:EE",
        isMulticast: true,
      },
    })
  })

  test("requires enough random bytes", () => {
    expect(() =>
      createTimeUuid(new Date("2026-05-18T01:40:00.123Z"), new Uint8Array(7))
    ).toThrow("requires at least 8 random bytes")
  })
})

describe("decodeUuid", () => {
  test("decodes a canonical v4 UUID", () => {
    const decoded = decodeUuid("550e8400-e29b-41d4-a716-446655440000")

    expect(decoded).toMatchObject({
      ok: true,
      uuid: "550e8400-e29b-41d4-a716-446655440000",
      hex: "550e8400e29b41d4a716446655440000",
      version: 4,
      versionKind: "random",
      variant: 1,
      variantKind: "rfc4122",
      base64: "VQ6EAOKbQdSnFkRmVUQAAA==",
      decimal: "113059749145936325402354257176981405696",
      octal: "1250350200070515501651234262106312521000000",
      algorithm: null,
      timestamp: null,
      clockSequence: null,
      node: null,
    })
    expect(decoded.ok && decoded.binary).toHaveLength(128)
    expect(decoded.ok && decoded.binary.startsWith("01010101")).toBe(true)
  })

  test("returns a failure for malformed input", () => {
    expect(decodeUuid("not-a-uuid")).toEqual({
      ok: false,
      input: "not-a-uuid",
      normalized: "not-a-uuid",
      error: "invalid-format",
    })
  })

  test("decodes v1 timestamp, clock sequence, and node fields", () => {
    const decoded = decodeUuid("6ba7b810-9dad-11d1-80b4-00c04fd430c8")

    expect(decoded).toMatchObject({
      ok: true,
      version: 1,
      versionKind: "time",
      timestamp: {
        unixMilliseconds: 886630433151,
        utcIso: "1998-02-04T22:13:53.151Z",
      },
      clockSequence: 180,
      node: {
        value: "00:C0:4F:D4:30:C8",
        isMulticast: false,
      },
    })
  })

  test("decodes v6 and v7 timestamp layouts", () => {
    expect(decodeUuid("1ec9414c-232a-6b00-b3c8-9e6bdec7705b")).toMatchObject({
      ok: true,
      versionKind: "timeReordered",
      timestamp: {
        unixMilliseconds: 1645557742000,
        utcIso: "2022-02-22T19:22:22.000Z",
      },
      clockSequence: 13256,
      node: {
        value: "9E:6B:DE:C7:70:5B",
        isMulticast: false,
      },
    })
    expect(decodeUuid("01890fdb-5f7b-7c10-8b24-3f4b3f4f5f6a")).toMatchObject({
      ok: true,
      versionKind: "unixTime",
      timestamp: {
        unixMilliseconds: 1688188182395,
        utcIso: "2023-07-01T05:09:42.395Z",
      },
    })
  })

  test("identifies namespace hash algorithms", () => {
    expect(decodeUuid("a3bb189e-8bf9-3888-9912-ace4e6543002")).toMatchObject({
      ok: true,
      versionKind: "md5",
      algorithm: "md5",
    })
    expect(decodeUuid("886313e1-3b8a-5372-9b90-0c9aee199e5d")).toMatchObject({
      ok: true,
      versionKind: "sha1",
      algorithm: "sha1",
    })
  })

  test("identifies nil, max, custom, dce, and reserved versions", () => {
    expect(decodeUuid("00000000-0000-0000-0000-000000000000")).toMatchObject({
      ok: true,
      version: 0,
      versionKind: "nil",
      variantKind: "ncs",
    })
    expect(decodeUuid("ffffffff-ffff-ffff-ffff-ffffffffffff")).toMatchObject({
      ok: true,
      version: 15,
      versionKind: "max",
      variantKind: "future",
    })
    expect(decodeUuid("550e8400-e29b-81d4-a716-446655440000")).toMatchObject({
      ok: true,
      versionKind: "custom",
    })
    expect(decodeUuid("550e8400-e29b-21d4-a716-446655440000")).toMatchObject({
      ok: true,
      versionKind: "dce",
      clockSequence: 10006,
    })
    expect(decodeUuid("550e8400-e29b-91d4-a716-446655440000")).toMatchObject({
      ok: true,
      versionKind: "reserved",
    })
  })

  test("identifies non-RFC variant families", () => {
    expect(decodeUuid("550e8400-e29b-41d4-7716-446655440000")).toMatchObject({
      ok: true,
      variant: 0,
      variantKind: "ncs",
    })
    expect(decodeUuid("550e8400-e29b-41d4-c716-446655440000")).toMatchObject({
      ok: true,
      variant: 2,
      variantKind: "microsoft",
    })
    expect(decodeUuid("550e8400-e29b-41d4-e716-446655440000")).toMatchObject({
      ok: true,
      variant: 3,
      variantKind: "future",
    })
  })
})
