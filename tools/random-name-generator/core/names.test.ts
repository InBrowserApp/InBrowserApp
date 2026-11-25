import { describe, expect, it } from "vitest"
import {
  generateNames,
  getDefaultNameLocale,
  NAME_LOCALES,
  NAME_TYPES,
} from "./names"

describe("random names", () => {
  it.each(NAME_LOCALES)("generates all name types for %s", async (locale) => {
    const lists = await Promise.all(
      NAME_TYPES.map((type) => generateNames(locale, type, 3))
    )

    for (const names of lists) {
      expect(names).toHaveLength(3)
      expect(
        names.every((name) => name.trim().length > 0 && !name.includes("\n"))
      ).toBe(true)
    }
  })

  it("uses the selected writing system for sample Chinese and Japanese names", async () => {
    const chinese = await generateNames("zh-Hant", "full", 10)
    const japanese = await generateNames("ja", "family", 10)

    expect(chinese.every((name) => /^\p{Script=Han}+$/u.test(name))).toBe(true)
    expect(japanese.every((name) => /\p{Script=Han}/u.test(name))).toBe(true)
  })

  it("defaults to a compatible name locale independently of the page's language", () => {
    expect(getDefaultNameLocale("zh-TW")).toBe("zh-Hant")
    expect(getDefaultNameLocale("hi")).toBe("en-IN")
    expect(getDefaultNameLocale("ko")).toBe("ko")
    expect(getDefaultNameLocale("ms")).toBe("en-US")
  })
})
