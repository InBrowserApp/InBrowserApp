import { describe, expect, test } from "vitest"

import {
  DEFAULT_UUID_V3_NAMESPACE,
  UUID_V3_NAMESPACE_PRESETS,
  bytesToUuid,
  generateUuidV3,
  isValidNamespaceUuid,
  normalizeNamespaceUuid,
  resolveNamespacePresetId,
} from "./uuid-v3"

describe("uuid v3 core", () => {
  test("generates the expected RFC-style DNS namespace result", () => {
    expect(generateUuidV3(DEFAULT_UUID_V3_NAMESPACE, "example.com")).toBe(
      "9073926b-929f-31c2-abc9-fad77ae3e8eb"
    )
  })

  test("generates deterministic values for unicode names", () => {
    const first = generateUuidV3(DEFAULT_UUID_V3_NAMESPACE, "café/用户")
    const second = generateUuidV3(DEFAULT_UUID_V3_NAMESPACE, "café/用户")

    expect(first).toBe(second)
    expect(first[14]).toBe("3")
    expect(["8", "9", "a", "b"]).toContain(first[19])
  })

  test("normalizes common UUID input forms", () => {
    expect(normalizeNamespaceUuid("6BA7B810-9DAD-11D1-80B4-00C04FD430C8")).toBe(
      DEFAULT_UUID_V3_NAMESPACE
    )
    expect(
      normalizeNamespaceUuid("{6ba7b810-9dad-11d1-80b4-00c04fd430c8}")
    ).toBe(DEFAULT_UUID_V3_NAMESPACE)
    expect(
      normalizeNamespaceUuid("urn:uuid:6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    ).toBe(DEFAULT_UUID_V3_NAMESPACE)
    expect(normalizeNamespaceUuid("6ba7b8109dad11d180b400c04fd430c8")).toBe(
      DEFAULT_UUID_V3_NAMESPACE
    )
  })

  test("rejects malformed namespace UUID values", () => {
    expect(normalizeNamespaceUuid("")).toBeNull()
    expect(
      normalizeNamespaceUuid("{6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    ).toBeNull()
    expect(
      normalizeNamespaceUuid("6ba7b810-9dad-11d1-80b4-00c04fd430cz")
    ).toBeNull()
    expect(
      normalizeNamespaceUuid("6ba7b810-9dad-11d1-80b400c04fd430c8")
    ).toBeNull()
    expect(isValidNamespaceUuid(DEFAULT_UUID_V3_NAMESPACE)).toBe(true)
    expect(isValidNamespaceUuid("not-a-uuid")).toBe(false)
  })

  test("resolves standard namespace presets", () => {
    for (const preset of UUID_V3_NAMESPACE_PRESETS) {
      expect(resolveNamespacePresetId(preset.value)).toBe(preset.id)
    }

    expect(
      resolveNamespacePresetId("00000000-0000-0000-0000-000000000000")
    ).toBeNull()
  })

  test("throws when generation receives an invalid namespace", () => {
    expect(() => generateUuidV3("invalid", "example.com")).toThrow(
      "Namespace must be a valid UUID"
    )
  })

  test("formats UUID bytes and rejects invalid byte lengths", () => {
    expect(
      bytesToUuid(
        new Uint8Array([
          0x90, 0x73, 0x92, 0x6b, 0x92, 0x9f, 0x31, 0xc2, 0xab, 0xc9, 0xfa,
          0xd7, 0x7a, 0xe3, 0xe8, 0xeb,
        ])
      )
    ).toBe("9073926b-929f-31c2-abc9-fad77ae3e8eb")

    expect(() => bytesToUuid(new Uint8Array([1, 2, 3]))).toThrow(
      "UUID byte array must contain exactly 16 bytes"
    )
  })
})
