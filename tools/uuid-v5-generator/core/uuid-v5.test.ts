import { describe, expect, test } from "vitest"

import {
  DEFAULT_UUID_V5_NAMESPACE,
  UUID_V5_NAMESPACE_PRESETS,
  UUID_V5_DEFAULT_NAME,
  formatUuidBytes,
  generateUuidV5,
  isValidNamespaceUuid,
  normalizeNamespaceUuid,
  parseUuidBytes,
  resolveNamespacePresetId,
} from "./uuid-v5"

describe("uuid v5 core", () => {
  test("normalizes and validates UUID strings", () => {
    expect(
      normalizeNamespaceUuid(" 6BA7B810-9DAD-11D1-80B4-00C04FD430C8 ")
    ).toBe("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    expect(
      normalizeNamespaceUuid("urn:uuid:6ba7b8109dad11d180b400c04fd430c8")
    ).toBe("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    expect(
      normalizeNamespaceUuid("{6ba7b810-9dad-11d1-80b4-00c04fd430c8}")
    ).toBe("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    expect(isValidNamespaceUuid(DEFAULT_UUID_V5_NAMESPACE)).toBe(true)
    expect(isValidNamespaceUuid("6ba7b8109dad11d180b400c04fd430c8")).toBe(true)
    expect(isValidNamespaceUuid("{not-a-uuid")).toBe(false)
    expect(isValidNamespaceUuid("not-a-uuid")).toBe(false)
  })

  test("parses and formats UUID bytes", () => {
    const bytes = parseUuidBytes("6ba7b810-9dad-11d1-80b4-00c04fd430c8")

    expect(bytes).toEqual(
      Uint8Array.from([
        0x6b, 0xa7, 0xb8, 0x10, 0x9d, 0xad, 0x11, 0xd1, 0x80, 0xb4, 0x00, 0xc0,
        0x4f, 0xd4, 0x30, 0xc8,
      ])
    )
    expect(formatUuidBytes(bytes!)).toBe("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    expect(parseUuidBytes("invalid")).toBeNull()
  })

  test("rejects byte arrays with the wrong length", () => {
    expect(() => formatUuidBytes(Uint8Array.from([1, 2, 3]))).toThrow(
      "UUID byte arrays must contain 16 bytes."
    )
  })

  test("resolves the matching namespace preset", () => {
    expect(resolveNamespacePresetId(UUID_V5_NAMESPACE_PRESETS[0].value)).toBe(
      "dns"
    )
    expect(
      resolveNamespacePresetId("00000000-0000-0000-0000-000000000000")
    ).toBe(null)
  })

  test("generates RFC-compatible deterministic UUID v5 values", async () => {
    await expect(
      generateUuidV5(UUID_V5_NAMESPACE_PRESETS[0].value, UUID_V5_DEFAULT_NAME)
    ).resolves.toEqual({
      ok: true,
      uuid: "cfbff0d1-9375-5685-968c-48ce8b15ae17",
    })

    await expect(
      generateUuidV5(UUID_V5_NAMESPACE_PRESETS[0].value, "www.widgets.com")
    ).resolves.toEqual({
      ok: true,
      uuid: "21f7f8de-8051-5b89-8680-0195ef798b6a",
    })
  })

  test("returns a validation result for invalid namespaces", async () => {
    await expect(
      generateUuidV5("bad namespace", "example.com")
    ).resolves.toEqual({
      ok: false,
      code: "invalid-namespace",
    })
  })
})
