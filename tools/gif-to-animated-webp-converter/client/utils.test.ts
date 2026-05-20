import { describe, expect, test } from "vitest"

import {
  formatBytes,
  formatSizeChangeText,
  resolveSizeChangeTrend,
} from "./utils"

describe("client utils", () => {
  test("formats byte sizes", () => {
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB")
  })

  test("formats output size changes from the original", () => {
    expect(formatSizeChangeText(1000, 800)).toBe("-200 B (-20%)")
    expect(formatSizeChangeText(1000, 1250)).toBe("+250 B (+25%)")
    expect(formatSizeChangeText(1000, 1000)).toBe("0 B (0%)")
  })

  test("resolves the size change trend", () => {
    expect(resolveSizeChangeTrend(1000, 800)).toBe("decrease")
    expect(resolveSizeChangeTrend(1000, 1250)).toBe("increase")
    expect(resolveSizeChangeTrend(1000, 1000)).toBe("equal")
  })
})
