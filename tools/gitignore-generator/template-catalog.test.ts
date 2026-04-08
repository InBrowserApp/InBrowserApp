import { describe, expect, test } from "vitest"

import { templateCatalog } from "./template-catalog"

describe("templateCatalog", () => {
  test("loads a deduplicated catalog from the vendored snapshot", () => {
    expect(templateCatalog.length).toBeGreaterThan(150)
    expect(templateCatalog.some((template) => template.name === "Node")).toBe(
      true
    )
    expect(
      templateCatalog.some((template) => template.category === "global")
    ).toBe(true)
    expect(
      templateCatalog.some((template) => template.category === "community")
    ).toBe(true)
  })
})
