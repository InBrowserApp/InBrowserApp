import { describe, expect, it } from "vitest"

import { resolvePreferredLanguageCode } from "./resolve-preferred-language"

// Mirror of the real SUPPORTED_SITE_LANGUAGES shape: one base-only family
// (most languages), the Chinese regional variants, plus a few that exercise
// alias handling (no, he, id).
const SUPPORTED = [
  "en",
  "zh-CN",
  "zh-TW",
  "de",
  "pt",
  "ar",
  "he",
  "id",
  "no",
] as const

const resolve = (tags: readonly string[]) =>
  resolvePreferredLanguageCode(SUPPORTED, tags)

describe("resolvePreferredLanguageCode", () => {
  it("matches an exact tag", () => {
    expect(resolve(["zh-TW"])).toBe("zh-TW")
    expect(resolve(["zh-CN"])).toBe("zh-CN")
  })

  it("strips the region when only the base language is supported", () => {
    expect(resolve(["en-US"])).toBe("en")
    expect(resolve(["en-GB"])).toBe("en")
    expect(resolve(["pt-BR"])).toBe("pt")
    expect(resolve(["de-AT-1996"])).toBe("de")
  })

  describe("Chinese falls back by script, not region", () => {
    it("routes Traditional regions and script to zh-TW", () => {
      expect(resolve(["zh-TW"])).toBe("zh-TW")
      expect(resolve(["zh-HK"])).toBe("zh-TW")
      expect(resolve(["zh-MO"])).toBe("zh-TW")
      expect(resolve(["zh-Hant"])).toBe("zh-TW")
      expect(resolve(["zh-Hant-HK"])).toBe("zh-TW")
      expect(resolve(["zh-Hant-TW"])).toBe("zh-TW")
    })

    it("routes Simplified regions and script to zh-CN", () => {
      expect(resolve(["zh-CN"])).toBe("zh-CN")
      expect(resolve(["zh-SG"])).toBe("zh-CN")
      expect(resolve(["zh-MY"])).toBe("zh-CN")
      expect(resolve(["zh-Hans"])).toBe("zh-CN")
      expect(resolve(["zh-Hans-CN"])).toBe("zh-CN")
      expect(resolve(["zh-Hans-SG"])).toBe("zh-CN")
    })

    it("defaults a bare or undetermined zh tag to Simplified", () => {
      expect(resolve(["zh"])).toBe("zh-CN")
      expect(resolve(["zh-Hani"])).toBe("zh-CN")
    })

    it("lets script win over a contradictory region", () => {
      expect(resolve(["zh-Hant-CN"])).toBe("zh-TW")
    })

    it("never collapses Traditional into Simplified (regression)", () => {
      // The previous heuristic resolved zh-TW to zh-CN because Simplified
      // was listed first among same-base variants.
      expect(resolve(["zh-TW"])).not.toBe("zh-CN")
      expect(resolve(["zh-Hant"])).not.toBe("zh-CN")
    })
  })

  describe("deprecated / macrolanguage aliases", () => {
    it("maps Norwegian Bokmål and Nynorsk to no", () => {
      expect(resolve(["nb-NO"])).toBe("no")
      expect(resolve(["nb"])).toBe("no")
      expect(resolve(["nn"])).toBe("no")
    })

    it("maps legacy Hebrew (iw) and Indonesian (in) codes", () => {
      expect(resolve(["iw"])).toBe("he")
      expect(resolve(["in-ID"])).toBe("id")
    })
  })

  it("honours browser priority order, skipping unsupported tags", () => {
    expect(resolve(["ja", "de"])).toBe("de")
    expect(resolve(["fr", "en"])).toBe("en")
    expect(resolve(["en", "zh-CN"])).toBe("en")
    expect(resolve(["zh-CN", "en"])).toBe("zh-CN")
  })

  it("is case-insensitive and ignores blank tags", () => {
    expect(resolve(["EN-us"])).toBe("en")
    expect(resolve(["ZH-hant"])).toBe("zh-TW")
    expect(resolve(["", "  ", "de"])).toBe("de")
  })

  it("returns null when nothing matches", () => {
    expect(resolve(["ja", "ko"])).toBeNull()
    expect(resolve([])).toBeNull()
  })
})
