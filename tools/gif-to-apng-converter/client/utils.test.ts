import { describe, expect, test } from "vitest"

import { formatBytes, formatDeltaText } from "./utils"

describe("GIF to APNG client formatters", () => {
  test("formats byte counts with the requested locale", () => {
    expect(formatBytes(512, "en")).toBe("512 B")
    expect(formatBytes(1536, "en")).toBe("1.5 KB")
    expect(formatBytes(1536, "fr")).toContain("1,5")
  })

  test("formats output size deltas with localized percentages", () => {
    expect(formatDeltaText(1000, 1500, "en")).toBe("+500 B (+50%)")
    expect(formatDeltaText(1000, 500, "en")).toBe("-500 B (-50%)")
  })
})
