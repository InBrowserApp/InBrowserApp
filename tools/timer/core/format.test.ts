import { describe, expect, test } from "vitest"

import { formatCountdown } from "./format"

describe("formatCountdown", () => {
  test("formats zero as hours minutes seconds and hundredths", () => {
    expect(formatCountdown(0)).toBe("00:00:00.00")
  })

  test("floors values to hundredths", () => {
    expect(formatCountdown(3_723_459)).toBe("01:02:03.45")
  })

  test("clamps negative values to zero", () => {
    expect(formatCountdown(-25)).toBe("00:00:00.00")
  })
})
