import { describe, expect, test } from "vitest"

import { MAX_UUID, NIL_UUID, classifyUuidVariant, validateUuid } from "./uuid"

describe("uuid validation", () => {
  test("reports an empty input distinctly", () => {
    const result = validateUuid("   ")

    expect(result.isValid).toBe(false)
    expect(result.reason).toBe("empty")
    expect(result.isCanonicalFormat).toBe(false)
    expect(result.segments).toBeNull()
  })

  test("validates and normalizes a standard UUID", () => {
    const result = validateUuid("6BA7B810-9DAD-11D1-80B4-00C04FD430C8")

    expect(result.isValid).toBe(true)
    expect(result.reason).toBe("valid")
    expect(result.normalized).toBe("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    expect(result.hex).toBe("6ba7b8109dad11d180b400c04fd430c8")
    expect(result.version).toBe(1)
    expect(result.variant).toBe("rfc4122")
    expect(result.byteLength).toBe(16)
    expect(result.segments).toEqual({
      timeLow: "6ba7b810",
      timeMid: "9dad",
      timeHighAndVersion: "11d1",
      clockSequence: "80b4",
      node: "00c04fd430c8",
    })
  })

  test("accepts modern UUID versions through version 8", () => {
    expect(validateUuid("01890f87-8a6f-7b9a-b391-6e0c85ba8f61").isValid).toBe(
      true
    )
    expect(validateUuid("00000000-0000-8000-8000-000000000000").isValid).toBe(
      true
    )
  })

  test("accepts nil and max UUID special values", () => {
    const nil = validateUuid(NIL_UUID)
    const max = validateUuid(MAX_UUID)

    expect(nil.isValid).toBe(true)
    expect(nil.kind).toBe("nil")
    expect(nil.version).toBeNull()
    expect(nil.variant).toBeNull()
    expect(max.isValid).toBe(true)
    expect(max.kind).toBe("max")
  })

  test("rejects malformed canonical text", () => {
    const result = validateUuid("6ba7b8109dad11d180b400c04fd430c8")

    expect(result.isValid).toBe(false)
    expect(result.reason).toBe("format")
    expect(result.isCanonicalFormat).toBe(false)
  })

  test("rejects unsupported standard UUID versions", () => {
    const result = validateUuid("00000000-0000-0000-8000-000000000000")

    expect(result.isCanonicalFormat).toBe(true)
    expect(result.isValid).toBe(false)
    expect(result.reason).toBe("version")
    expect(result.version).toBe(0)
  })

  test("rejects non-RFC variants for standard UUIDs", () => {
    const result = validateUuid("6ba7b810-9dad-11d1-70b4-00c04fd430c8")

    expect(result.isCanonicalFormat).toBe(true)
    expect(result.isValid).toBe(false)
    expect(result.reason).toBe("variant")
    expect(result.variant).toBe("ncs")
  })

  test("classifies all variant bit ranges", () => {
    expect(classifyUuidVariant("7")).toBe("ncs")
    expect(classifyUuidVariant("8")).toBe("rfc4122")
    expect(classifyUuidVariant("b")).toBe("rfc4122")
    expect(classifyUuidVariant("d")).toBe("microsoft")
    expect(classifyUuidVariant("f")).toBe("future")
  })
})
