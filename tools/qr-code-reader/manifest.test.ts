import { describe, expect, it } from "vitest"

import { tool } from "./manifest"

describe("qr-code-reader manifest", () => {
  it("registers as an image tool", () => {
    expect(tool.category).toBe("image")
    expect(tool.icon).toBe("image")
    expect(tool.tags).toContain("qrcode")
  })
})
