import { describe, expect, test } from "vitest"

import { tool } from "./manifest"

describe("image-to-webp-converter manifest", () => {
  test("defines the image tool metadata", () => {
    expect(tool.category).toBe("image")
    expect(tool.icon).toBe("image")
    expect(tool.tags).toContain("webp")
    expect(tool.tags).toContain("batch")
  })
})
