import { describe, expect, test } from "vitest"

import {
  convertByIds,
  convertToAll,
  convertUnits,
  fromBase,
  toBase,
} from "./convert"
import { CATEGORIES, findUnit, getCategory } from "./units"

const length = CATEGORIES.length
const temperature = CATEGORIES.temperature
const digital = CATEGORIES.digital

function unit(category: typeof length, id: string) {
  const found = findUnit(category, id)

  if (!found) {
    throw new Error(`missing unit ${id}`)
  }

  return found
}

describe("toBase / fromBase", () => {
  test("linear units scale by factor with no offset", () => {
    expect(toBase(2, unit(length, "kilometer"))).toBe(2000)
    expect(fromBase(2000, unit(length, "kilometer"))).toBe(2)
  })

  test("temperature applies the affine offset", () => {
    expect(toBase(0, unit(temperature, "celsius"))).toBeCloseTo(273.15, 10)
    expect(toBase(100, unit(temperature, "celsius"))).toBeCloseTo(373.15, 10)
    expect(fromBase(273.15, unit(temperature, "celsius"))).toBeCloseTo(0, 10)
  })
})

describe("convertUnits", () => {
  test("meters to feet", () => {
    const result = convertUnits(1, unit(length, "meter"), unit(length, "foot"))

    expect(result).toBeCloseTo(3.280839895, 8)
  })

  test("0°C equals 32°F", () => {
    const result = convertUnits(
      0,
      unit(temperature, "celsius"),
      unit(temperature, "fahrenheit")
    )

    expect(result).toBeCloseTo(32, 10)
  })

  test("100°C equals 212°F", () => {
    const result = convertUnits(
      100,
      unit(temperature, "celsius"),
      unit(temperature, "fahrenheit")
    )

    expect(result).toBeCloseTo(212, 10)
  })

  test("digital decimal and binary differ", () => {
    expect(
      convertUnits(1, unit(digital, "megabyte"), unit(digital, "byte"))
    ).toBe(1e6)
    expect(
      convertUnits(1, unit(digital, "mebibyte"), unit(digital, "byte"))
    ).toBe(1048576)
  })

  test("round-trips within tolerance across every category", () => {
    for (const category of Object.values(CATEGORIES)) {
      for (const target of category.units) {
        const base = unit(category, category.baseUnitId)
        const there = convertUnits(7, base, target)
        const back = convertUnits(there, target, base)

        expect(back).toBeCloseTo(7, 6)
      }
    }
  })
})

describe("convertToAll", () => {
  test("returns a value for every unit in the category", () => {
    const result = convertToAll(length, "meter", 1)

    expect(Object.keys(result).length).toBe(length.units.length)
    expect(result.centimeter).toBe(100)
    expect(result.millimeter).toBe(1000)
  })

  test("returns empty object for an unknown source unit", () => {
    expect(convertToAll(length, "nope", 1)).toEqual({})
  })
})

describe("convertByIds", () => {
  test("resolves a full conversion by string ids", () => {
    expect(convertByIds("length", "kilometer", "meter", 3)).toBe(3000)
  })

  test("returns undefined for unknown category", () => {
    expect(convertByIds("nope", "meter", "foot", 1)).toBeUndefined()
  })

  test("returns undefined for unknown from unit", () => {
    expect(convertByIds("length", "nope", "foot", 1)).toBeUndefined()
  })

  test("returns undefined for unknown to unit", () => {
    expect(convertByIds("length", "meter", "nope", 1)).toBeUndefined()
  })
})

describe("registry helpers", () => {
  test("getCategory resolves known and unknown ids", () => {
    expect(getCategory("length")).toBe(length)
    expect(getCategory("nope")).toBeUndefined()
  })

  test("findUnit resolves known and unknown ids", () => {
    expect(findUnit(length, "meter")?.symbol).toBe("m")
    expect(findUnit(length, "nope")).toBeUndefined()
  })
})
