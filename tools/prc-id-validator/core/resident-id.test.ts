import { describe, expect, it } from "vitest"

import {
  getResidentIdCheckDigit,
  normalizeResidentId,
  validateResidentId,
} from "./resident-id"

const NOW = new Date(Date.UTC(2026, 3, 15))

function buildResidentId(core: string) {
  const checkDigit = getResidentIdCheckDigit(core)

  if (!checkDigit) {
    throw new Error(`Unable to build resident id for core: ${core}`)
  }

  return `${core}${checkDigit}`
}

describe("normalizeResidentId", () => {
  it("removes spaces and hyphens and uppercases trailing x", () => {
    expect(normalizeResidentId("110101 19900101-001x")).toBe(
      "11010119900101001X"
    )
  })
})

describe("getResidentIdCheckDigit", () => {
  it("returns the expected checksum digit", () => {
    expect(getResidentIdCheckDigit("11010119900101001")).toBe("5")
  })

  it("returns null for invalid cores", () => {
    expect(getResidentIdCheckDigit("1101011990010100A")).toBeNull()
  })
})

describe("validateResidentId", () => {
  it("validates a male resident id and decodes region and age", () => {
    const residentId = buildResidentId("11010119900101001")
    const result = validateResidentId(residentId, NOW)

    expect(result.isValid).toBe(true)
    expect(result.regionCode).toBe("110101")
    expect(result.provinceName).toBe("北京市")
    expect(result.cityName).toBe("市辖区")
    expect(result.areaName).toBe("东城区")
    expect(result.birthDateText).toBe("1990-01-01")
    expect(result.age).toBe(36)
    expect(result.gender).toBe("male")
    expect(result.expectedCheckDigit).toBe("5")
    expect(result.actualCheckDigit).toBe("5")
  })

  it("marks even sequence codes as female", () => {
    const residentId = buildResidentId("11010119900101002")
    const result = validateResidentId(residentId, NOW)

    expect(result.isValid).toBe(true)
    expect(result.gender).toBe("female")
  })

  it("computes age based on whether the birthday already happened this year", () => {
    const residentId = buildResidentId("11010120001231001")
    const result = validateResidentId(residentId, NOW)

    expect(result.isValid).toBe(true)
    expect(result.age).toBe(25)
  })

  it("computes age when the birth month matches but the birthday is still ahead", () => {
    const residentId = buildResidentId("11010120000420001")
    const result = validateResidentId(residentId, NOW)

    expect(result.isValid).toBe(true)
    expect(result.age).toBe(25)
  })

  it("flags invalid length and missing parsed fields", () => {
    const result = validateResidentId("11010119900101001", NOW)

    expect(result.isLengthValid).toBe(false)
    expect(result.isFormatValid).toBe(false)
    expect(result.regionCode).toBeNull()
    expect(result.birthDateText).toBeNull()
    expect(result.expectedCheckDigit).toBeNull()
    expect(result.isValid).toBe(false)
  })

  it("flags invalid format", () => {
    const result = validateResidentId("11010119900101A018", NOW)

    expect(result.isFormatValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it("flags unknown region codes", () => {
    const residentId = buildResidentId("99010119900101001")
    const result = validateResidentId(residentId, NOW)

    expect(result.isRegionValid).toBe(false)
    expect(result.areaName).toBeNull()
    expect(result.isChecksumValid).toBe(true)
    expect(result.isValid).toBe(false)
  })

  it("flags impossible birthdates", () => {
    const residentId = buildResidentId("11010119900230001")
    const result = validateResidentId(residentId, NOW)

    expect(result.isBirthdateValid).toBe(false)
    expect(result.birthDate).toBeNull()
    expect(result.birthDateText).toBeNull()
    expect(result.isValid).toBe(false)
  })

  it("flags invalid birth months", () => {
    const residentId = buildResidentId("11010119901301001")
    const result = validateResidentId(residentId, NOW)

    expect(result.isBirthdateValid).toBe(false)
    expect(result.birthDate).toBeNull()
    expect(result.birthDateText).toBeNull()
    expect(result.isValid).toBe(false)
  })

  it("flags future birthdates while preserving parsed text", () => {
    const residentId = buildResidentId("11010120990101001")
    const result = validateResidentId(residentId, NOW)

    expect(result.isBirthdateValid).toBe(false)
    expect(result.birthDateText).toBe("2099-01-01")
    expect(result.age).toBeNull()
    expect(result.isValid).toBe(false)
  })

  it("flags invalid checksums", () => {
    const residentId = buildResidentId("11010119900101001")
    const invalidResidentId = `${residentId.slice(0, -1)}X`
    const result = validateResidentId(invalidResidentId, NOW)

    expect(result.isChecksumValid).toBe(false)
    expect(result.isValid).toBe(false)
  })
})
