import punycode from "punycode/"
import { afterEach, describe, expect, test, vi } from "vitest"

import {
  decodePunycodeDomain,
  encodeDomainToPunycode,
  isValidAsciiDomain,
  isValidUnicodeDomain,
} from "./punycode"

describe("punycode helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("encodes a unicode domain to punycode", () => {
    expect(encodeDomainToPunycode("🕸️.com")).toBe("xn--v86c4184b.com")
  })

  test("decodes a punycode domain to unicode", () => {
    expect(decodePunycodeDomain("xn--v86c4184b.com")).toBe("🕸️.com")
  })

  test("validates ascii domains", () => {
    expect(isValidAsciiDomain("example.com")).toBe(true)
    expect(isValidAsciiDomain("xn--v86c4184b.com")).toBe(true)
    expect(isValidAsciiDomain("")).toBe(true)
    expect(isValidAsciiDomain("münchen.de")).toBe(false)
    expect(isValidAsciiDomain("bad domain")).toBe(false)
    expect(isValidAsciiDomain("example..com")).toBe(false)
    expect(isValidAsciiDomain("xn--a-.com")).toBe(false)
    expect(isValidAsciiDomain("xn--b.com")).toBe(false)
  })

  test("validates unicode domains", () => {
    expect(isValidUnicodeDomain("")).toBe(true)
    expect(isValidUnicodeDomain("🕸️.com")).toBe(true)
    expect(isValidUnicodeDomain("münchen.de")).toBe(true)
    expect(isValidUnicodeDomain("bad domain")).toBe(false)
  })

  test("returns false when punycode encoding throws", () => {
    vi.spyOn(punycode, "toASCII").mockImplementation(() => {
      throw new RangeError("boom")
    })

    expect(isValidUnicodeDomain("example.com")).toBe(false)
  })
})
