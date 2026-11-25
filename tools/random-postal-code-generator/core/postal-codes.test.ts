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
  GB: /^(?:[A-Z]\d[\dABCDEFGHJKSTUW]?|[A-Z]{2}\d[\dABEHMNPRVWXY]?) \d[ABD-HJLNP-UW-Z]{2}$/,
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

  it("generates valid outward suffix letters for UK postcode patterns", async () => {
    const { faker } = await import("@faker-js/faker/locale/en_GB")
    faker.seed(42)

    const codes = await generatePostalCodes("GB", 1000, "zip5")

    expect(codes.some((code) => /^[A-Z]\d[A-Z] /.test(code))).toBe(true)
    expect(codes.some((code) => /^[A-Z]{2}\d[A-Z] /.test(code))).toBe(true)
    expect(codes.every((code) => patterns.GB.test(code))).toBe(true)
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
