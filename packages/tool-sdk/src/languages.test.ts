import { describe, expect, test } from "vitest"

import { uniqueLanguages } from "./languages"

describe("uniqueLanguages", () => {
  test("returns unique languages", () => {
    expect(uniqueLanguages(["en", "zh-CN", "en"])).toEqual(["en", "zh-CN"])
  })

  test("trims whitespace", () => {
    expect(uniqueLanguages(["  en  ", " zh-CN "])).toEqual(["en", "zh-CN"])
  })

  test("filters empty strings", () => {
    expect(uniqueLanguages(["en", "", "  ", "zh-CN"])).toEqual(["en", "zh-CN"])
  })

  test("returns empty array for empty input", () => {
    expect(uniqueLanguages([])).toEqual([])
  })
})
