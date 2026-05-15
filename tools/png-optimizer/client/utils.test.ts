import { describe, expect, it } from "vitest"

import { formatBytes, formatDelta, formatPercent } from "./utils"

describe("png optimizer client formatting", () => {
  it("formats byte counts", () => {
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB")
    expect(formatBytes(-1536)).toBe("-1.5 KB")
  })

  it("formats percentages", () => {
    expect(formatPercent(0)).toBe("0%")
    expect(formatPercent(Number.NaN)).toBe("0%")
    expect(formatPercent(4.25)).toBe("4.3%")
    expect(formatPercent(12.6)).toBe("13%")
    expect(formatPercent(-4.25)).toBe("-4.3%")
  })

  it("combines byte and percentage deltas", () => {
    expect(formatDelta(1536, 12.4)).toBe("1.5 KB (12%)")
  })
})
