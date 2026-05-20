import { describe, expect, test } from "vitest"

import { tool } from "./manifest"

describe("tool manifest", () => {
  test("defines image category metadata", () => {
    expect(tool.category).toBe("image")
    expect(tool.tags).toContain("gif")
    expect(tool.tags).toContain("webp")
  })
})
