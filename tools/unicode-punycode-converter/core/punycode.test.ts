import { describe, expect, test } from "vitest"

import {
  decodePunycodeDomain,
  encodeDomainToPunycode,
  isValidAsciiDomain,
  isValidUnicodeDomain,
} from "./punycode"

describe("punycode helpers", () => {
  test("encodes a unicode domain to punycode", () => {
    expect(encodeDomainToPunycode("🕸️.com")).toBe("xn--v86c4184b.com")
  })

  test("decodes a punycode domain to unicode", () => {
    expect(decodePunycodeDomain("xn--v86c4184b.com")).toBe("🕸️.com")
  })

  test("validates ascii domains", () => {
    expect(isValidAsciiDomain("example.com")).toBe(true)
    expect(isValidAsciiDomain("xn--v86c4184b.com")).toBe(true)
    expect(isValidAsciiDomain("bad domain")).toBe(false)
    expect(isValidAsciiDomain("example..com")).toBe(false)
  })

  test("validates unicode domains", () => {
    expect(isValidUnicodeDomain("🕸️.com")).toBe(true)
    expect(isValidUnicodeDomain("münchen.de")).toBe(true)
    expect(isValidUnicodeDomain("bad domain")).toBe(false)
  })
})
