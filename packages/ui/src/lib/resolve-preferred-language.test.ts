import { describe, expect, it } from "vitest"

import { resolvePreferredLanguageCode } from "./resolve-preferred-language"

const SUPPORTED = ["en", "zh-CN", "zh-TW", "de", "pt", "ar"] as const

describe("resolvePreferredLanguageCode", () => {
  it("matches an exact tag", () => {
    expect(resolvePreferredLanguageCode(SUPPORTED, ["zh-TW"])).toBe("zh-TW")
  })

  it("does not collapse Traditional Chinese into Simplified", () => {
    // Regression: the previous switcher heuristic resolved zh-TW to zh-CN
    // because zh-CN was listed first among the same-base variants.
    expect(resolvePreferredLanguageCode(SUPPORTED, ["zh-TW"])).not.toBe("zh-CN")
  })

  it("strips the region when only the base language is supported", () => {
    expect(resolvePreferredLanguageCode(SUPPORTED, ["en-GB"])).toBe("en")
    expect(resolvePreferredLanguageCode(SUPPORTED, ["pt-BR"])).toBe("pt")
  })

  it("falls back to the first variant for a bare base tag", () => {
    expect(resolvePreferredLanguageCode(SUPPORTED, ["zh"])).toBe("zh-CN")
  })

  it("routes Traditional script/region subtags to the Traditional variant", () => {
    expect(resolvePreferredLanguageCode(SUPPORTED, ["zh-Hant"])).toBe("zh-TW")
    expect(resolvePreferredLanguageCode(SUPPORTED, ["zh-Hant-HK"])).toBe(
      "zh-TW"
    )
    expect(resolvePreferredLanguageCode(SUPPORTED, ["zh-HK"])).toBe("zh-TW")
  })

  it("routes Simplified script/region subtags to the Simplified variant", () => {
    expect(resolvePreferredLanguageCode(SUPPORTED, ["zh-Hans"])).toBe("zh-CN")
    expect(resolvePreferredLanguageCode(SUPPORTED, ["zh-Hans-SG"])).toBe(
      "zh-CN"
    )
  })

  it("honours browser priority order, skipping unsupported tags", () => {
    expect(resolvePreferredLanguageCode(SUPPORTED, ["ja", "de"])).toBe("de")
    expect(resolvePreferredLanguageCode(SUPPORTED, ["fr", "en"])).toBe("en")
  })

  it("is case-insensitive and ignores blank tags", () => {
    expect(resolvePreferredLanguageCode(SUPPORTED, ["EN-US"])).toBe("en")
    expect(resolvePreferredLanguageCode(SUPPORTED, ["", "  ", "de"])).toBe("de")
  })

  it("returns null when nothing matches", () => {
    expect(resolvePreferredLanguageCode(SUPPORTED, ["ja", "ko"])).toBeNull()
    expect(resolvePreferredLanguageCode(SUPPORTED, [])).toBeNull()
  })
})
