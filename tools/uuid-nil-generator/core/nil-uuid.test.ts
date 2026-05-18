import { describe, expect, it } from "vitest"

import {
  NIL_UUID,
  NIL_UUID_HEX,
  NIL_UUID_URN,
  getNilUuid,
  getNilUuidRepresentations,
  isNilUuid,
} from "./nil-uuid"

describe("nil UUID helpers", () => {
  it("returns the canonical nil UUID", () => {
    expect(getNilUuid()).toBe("00000000-0000-0000-0000-000000000000")
    expect(getNilUuid()).toBe(NIL_UUID)
  })

  it("returns canonical, raw hex, and URN representations", () => {
    expect(getNilUuidRepresentations()).toEqual({
      canonical: NIL_UUID,
      rawHex: NIL_UUID_HEX,
      urn: NIL_UUID_URN,
    })
  })

  it("recognizes nil UUID input in common representations", () => {
    expect(isNilUuid(NIL_UUID)).toBe(true)
    expect(isNilUuid(NIL_UUID.toUpperCase())).toBe(true)
    expect(isNilUuid(NIL_UUID_HEX)).toBe(true)
    expect(isNilUuid(NIL_UUID_URN)).toBe(true)
    expect(isNilUuid(`  ${NIL_UUID_URN.toUpperCase()}  `)).toBe(true)
  })

  it("rejects non-nil UUID input", () => {
    expect(isNilUuid("00000000-0000-0000-0000-000000000001")).toBe(false)
    expect(isNilUuid("not-a-uuid")).toBe(false)
    expect(isNilUuid("")).toBe(false)
  })
})
