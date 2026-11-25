import { describe, expect, it } from "vitest"

import { generateVins } from "./vins"

const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
const letterValues = "12345678_12345_7_923456789"

function digitValue(character: string) {
  return character >= "A"
    ? Number(letterValues.charAt(character.charCodeAt(0) - 65))
    : Number(character)
}

function checkDigit(vin: string) {
  const total = weights.reduce(
    (sum, weight, index) => sum + weight * digitValue(vin.charAt(index)),
    0
  )
  return "0123456789X".charAt(total % 11)
}

describe("generateVins", () => {
  it("generates one VIN when requested", async () => {
    const vins = await generateVins(1)
    expect(vins).toHaveLength(1)
    expect(vins[0]).toMatch(/^[A-HJ-NPR-Z0-9]{17}$/)
  })

  it("uses the VIN alphabet and ninth-position checksum across a large batch", async () => {
    const vins = await generateVins(1000)

    expect(vins).toHaveLength(1000)
    for (const vin of vins) {
      expect(vin).toMatch(/^[A-HJ-NPR-Z0-9]{17}$/)
      expect(vin.charAt(8)).toBe(checkDigit(vin))
    }
  })
})
