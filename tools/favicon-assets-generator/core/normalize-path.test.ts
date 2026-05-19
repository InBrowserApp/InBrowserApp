import { describe, expect, test } from "vitest"

import { normalizeAssetPath, normalizeStartUrl } from "./normalize-path"

describe("normalizeAssetPath", () => {
  test("returns '/' for empty input", () => {
    expect(normalizeAssetPath("")).toBe("/")
  })

  test("returns '/' for whitespace input", () => {
    expect(normalizeAssetPath("   ")).toBe("/")
  })

  test("returns '/' for a single slash", () => {
    expect(normalizeAssetPath("/")).toBe("/")
  })

  test("adds a leading slash when missing", () => {
    expect(normalizeAssetPath("assets")).toBe("/assets/")
  })

  test("adds a trailing slash when missing", () => {
    expect(normalizeAssetPath("/assets")).toBe("/assets/")
  })

  test("keeps trailing slash when present", () => {
    expect(normalizeAssetPath("/assets/")).toBe("/assets/")
  })

  test("collapses repeated slashes", () => {
    expect(normalizeAssetPath("///nested//path//")).toBe("/nested/path/")
  })

  test("trims surrounding whitespace before normalizing", () => {
    expect(normalizeAssetPath("  assets/icons  ")).toBe("/assets/icons/")
  })
})

describe("normalizeStartUrl", () => {
  test("returns '/' for empty input", () => {
    expect(normalizeStartUrl("")).toBe("/")
  })

  test("preserves absolute https URLs", () => {
    expect(normalizeStartUrl("https://example.com/app")).toBe(
      "https://example.com/app"
    )
  })

  test("preserves absolute http URLs", () => {
    expect(normalizeStartUrl("http://example.com")).toBe("http://example.com")
  })

  test("adds a leading slash when missing", () => {
    expect(normalizeStartUrl("app")).toBe("/app")
  })

  test("collapses repeated slashes", () => {
    expect(normalizeStartUrl("//app//start")).toBe("/app/start")
  })

  test("does not force a trailing slash", () => {
    expect(normalizeStartUrl("/app")).toBe("/app")
  })

  test("trims whitespace", () => {
    expect(normalizeStartUrl("  /home  ")).toBe("/home")
  })
})
