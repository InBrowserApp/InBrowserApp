import { describe, expect, test } from "vitest"

import { tool } from "./manifest"

describe("image-to-avif-converter manifest", () => {
  test("defines the image tool metadata", () => {
    expect(tool.category).toBe("image")
    expect(tool.icon).toBe("image")
    expect(tool.tags).toContain("avif")
    expect(tool.tags).toContain("batch")
  })
})
