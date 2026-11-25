import { describe, expect, it } from "vitest"
import {
  generatePostalCodes,
  getDefaultPostalCountry,
  POSTAL_COUNTRIES,
} from "./postal-codes"

const patterns = {
  AU: /^\d{4}$/,
  BR: /^\d{5}-\d{3}$/,
  CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
  CN: /^\d{6}$/,
  DE: /^\d{5}$/,
  FR: /^\d{5}$/,
  GB: /^[A-Z]{1,2}\d[A-Z0-9]? \d[ABD-HJLNP-UW-Z]{2}$/,
  IN: /^[1-9]\d{5}$/,
  JP: /^\d{3}-\d{4}$/,
  KR: /^\d{5}$/,
  TW: /^\d{6}$/,
  US: /^\d{5}$/,
}

describe("generatePostalCodes", () => {
  it.each(POSTAL_COUNTRIES)(
    "generates a batch in the %s format",
    async (country) => {
      const codes = await generatePostalCodes(country, 50, "zip5")

      expect(codes).toHaveLength(50)
      expect(codes.every((code) => patterns[country].test(code))).toBe(true)
    }
  )

  it("can generate ZIP+4 for the US", async () => {
    const [code] = await generatePostalCodes("US", 1, "zip4")

    expect(code).toMatch(/^\d{5}-\d{4}$/)
  })
})

describe("getDefaultPostalCountry", () => {
  it("uses a supported region from the page language and falls back to US", () => {
    expect(getDefaultPostalCountry("zh-TW")).toBe("TW")
    expect(getDefaultPostalCountry("ja")).toBe("JP")
    expect(getDefaultPostalCountry("en-GB")).toBe("GB")
    expect(getDefaultPostalCountry("pl")).toBe("US")
  })
})
