import { describe, expect, it } from "vitest"

import { tool } from "./manifest"

describe("barcode-reader manifest", () => {
  it("registers as an image tool", () => {
    expect(tool.category).toBe("image")
    expect(tool.icon).toBe("image")
    expect(tool.tags).toContain("barcode")
    expect(tool.tags).toContain("scanner")
  })
})
