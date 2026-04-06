import { describe, expect, test } from "vitest"

import { resolveLocale } from "./resolve-locale"

describe("resolveLocale", () => {
  test("resolves exact language match", () => {
    const modules = {
      "./meta/en.json": { name: "English" },
      "./meta/zh-CN.json": { name: "Chinese" },
    }

    expect(resolveLocale(modules, "zh-CN")).toEqual({ name: "Chinese" })
  })

  test("falls back to en when requested language is missing", () => {
    const modules = {
      "./meta/en.json": { name: "English" },
    }

    expect(resolveLocale(modules, "fr")).toEqual({ name: "English" })
  })

  test("falls back to first available when en is also missing", () => {
    const modules = {
      "./meta/ja.json": { name: "Japanese" },
    }

    expect(resolveLocale(modules, "fr")).toEqual({ name: "Japanese" })
  })

  test("returns undefined for empty modules", () => {
    expect(resolveLocale({}, "en")).toBeUndefined()
  })

  test("extracts language from nested path", () => {
    const modules = {
      "./deeply/nested/path/en.json": { name: "English" },
    }

    expect(resolveLocale(modules, "en")).toEqual({ name: "English" })
  })

  test("strips file extension to get language", () => {
    const modules = {
      "./intro/en.mdx": "content-en",
      "./intro/zh-CN.mdx": "content-zh",
    }

    expect(resolveLocale(modules, "zh-CN")).toBe("content-zh")
  })

  test("handles path with no filename gracefully", () => {
    // Path ending with / produces empty last segment via split
    const modules = { "": "value" }
    // The empty key has no slash, so .at(-1) returns ""
    // Language becomes "" after extension strip, won't match "en"
    expect(resolveLocale(modules, "en")).toBe("value")
  })
})
