import { describe, expect, test } from "vitest"

import {
  formatBytes,
  formatDimensions,
  formatProgressLabel,
  getTotalImageSize,
} from "./utils"

describe("client formatting utilities", () => {
  test("formats byte counts", () => {
    expect(formatBytes(0)).toBe("0 B")
    expect(formatBytes(Number.NaN)).toBe("0 B")
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatBytes(12_345)).toBe("12 KB")
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB")
  })

  test("formats dimensions, progress, and totals", () => {
    expect(formatDimensions(320.4, 240.6)).toBe("320 x 241 px")
    expect(formatProgressLabel("{completed}/{total}", 2, 5)).toBe("2/5")
    expect(
      getTotalImageSize([
        { file: new File(["0123456789"], "a") },
        { file: new File(["x".repeat(25)], "b") },
      ] as never)
    ).toBe(35)
  })
})
