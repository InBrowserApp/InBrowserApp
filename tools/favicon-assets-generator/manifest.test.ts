import { describe, expect, test } from "vitest"

import { tool } from "./manifest"

describe("favicon-assets-generator manifest", () => {
  test("declares the image category", () => {
    expect(tool.category).toBe("image")
  })

  test("uses the image icon for the tool tile", () => {
    expect(tool.icon).toBe("image")
  })

  test("tags include the canonical favicon / pwa keywords", () => {
    expect(tool.tags).toEqual(
      expect.arrayContaining(["favicon", "icon", "ico", "pwa", "manifest"])
    )
  })
})
