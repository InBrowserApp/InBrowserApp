import { describe, expect, it } from "vitest"

import {
  MAX_UUID,
  MAX_UUID_HEX,
  MAX_UUID_URN,
  getMaxUuid,
  getMaxUuidRepresentations,
  isMaxUuid,
} from "./max-uuid"

describe("max UUID helpers", () => {
  it("returns the canonical max UUID", () => {
    expect(getMaxUuid()).toBe("ffffffff-ffff-ffff-ffff-ffffffffffff")
    expect(getMaxUuid()).toBe(MAX_UUID)
  })

  it("returns canonical, raw hex, and URN representations", () => {
    expect(getMaxUuidRepresentations()).toEqual({
      canonical: MAX_UUID,
      rawHex: MAX_UUID_HEX,
      urn: MAX_UUID_URN,
    })
  })

  it("recognizes max UUID input in common representations", () => {
    expect(isMaxUuid(MAX_UUID)).toBe(true)
    expect(isMaxUuid(MAX_UUID.toUpperCase())).toBe(true)
    expect(isMaxUuid(MAX_UUID_HEX)).toBe(true)
    expect(isMaxUuid(MAX_UUID_URN)).toBe(true)
    expect(isMaxUuid(`  ${MAX_UUID_URN.toUpperCase()}  `)).toBe(true)
  })

  it("rejects non-max UUID input", () => {
    expect(isMaxUuid("ffffffff-ffff-ffff-ffff-fffffffffffe")).toBe(false)
    expect(isMaxUuid("not-a-uuid")).toBe(false)
    expect(isMaxUuid("")).toBe(false)
  })
})
