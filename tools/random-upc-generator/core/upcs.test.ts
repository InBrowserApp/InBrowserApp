import { describe, expect, it } from "vitest"

import { generateUpcs } from "./upcs"

describe("generateUpcs", () => {
  it("returns twelve-digit UPC-A values with valid check digits", async () => {
    const upcs = await generateUpcs(1000)

    expect(upcs).toHaveLength(1000)
    for (const upc of upcs) {
      expect(upc).toMatch(/^\d{12}$/)
      const weightedTotal = [...upc].reduce(
        (total, digit, index) =>
          total + Number(digit) * (index % 2 === 0 ? 3 : 1),
        0
      )
      expect(weightedTotal % 10).toBe(0)
    }
  })
})
