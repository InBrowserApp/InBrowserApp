import { describe, expect, test } from "vitest"

import {
  convertByIds,
  convertToAll,
  convertUnits,
  fromBase,
  toBase,
} from "./convert"
import { CATEGORIES, CATEGORY_IDS, findUnit, getCategory } from "./units"

import type { UnitCategory } from "./units"

const length = CATEGORIES.length
const temperature = CATEGORIES.temperature
const digital = CATEGORIES.digital

function unit(category: UnitCategory, id: string) {
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

  test("temperature applies its offset before scaling", () => {
    expect(toBase(0, unit(temperature, "celsius"))).toBeCloseTo(273.15, 10)
    expect(toBase(100, unit(temperature, "celsius"))).toBeCloseTo(373.15, 10)
    expect(toBase(-459.67, unit(temperature, "fahrenheit"))).toBe(0)
    expect(fromBase(273.15, unit(temperature, "celsius"))).toBeCloseTo(0, 10)
    expect(fromBase(0, unit(temperature, "fahrenheit"))).toBe(-459.67)
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

  test.each([
    [-459.67, "fahrenheit", "kelvin", 0],
    [-459.67, "fahrenheit", "rankine", 0],
    [-273.15, "celsius", "kelvin", 0],
    [491.67, "rankine", "celsius", 0],
    [32, "fahrenheit", "celsius", 0],
    [-40, "fahrenheit", "celsius", -40],
    [-40, "celsius", "fahrenheit", -40],
  ])(
    "preserves the temperature anchor %s %s → %s",
    (value, fromId, toId, expected) => {
      const result = convertUnits(
        value,
        unit(temperature, fromId),
        unit(temperature, toId)
      )

      if (expected === 0) {
        expect(result).toBe(0)
      } else {
        expect(result).toBeCloseTo(expected, 12)
      }
    }
  )

  test("digital decimal and binary differ", () => {
    expect(
      convertUnits(1, unit(digital, "megabyte"), unit(digital, "byte"))
    ).toBe(1e6)
    expect(
      convertUnits(1, unit(digital, "mebibyte"), unit(digital, "byte"))
    ).toBe(1048576)
  })

  test("avoids unnecessary intermediate overflow", () => {
    const result = convertUnits(
      1e308,
      unit(length, "kilometer"),
      unit(length, "mile")
    )

    expect(result).toBe(1e308 * (1000 / 1609.344))
    expect(Number.isFinite(result)).toBe(true)
  })

  test("preserves same-unit subnormal values", () => {
    expect(
      convertUnits(
        Number.MIN_VALUE,
        unit(length, "nanometer"),
        unit(length, "nanometer")
      )
    ).toBe(Number.MIN_VALUE)
  })

  test("leaves genuine non-finite results unchanged", () => {
    expect(
      convertUnits(
        Number.POSITIVE_INFINITY,
        unit(temperature, "fahrenheit"),
        unit(temperature, "celsius")
      )
    ).toBe(Number.POSITIVE_INFINITY)
    expect(
      convertUnits(1e308, unit(length, "kilometer"), unit(length, "nanometer"))
    ).toBe(Number.POSITIVE_INFINITY)
  })

  test.each([
    ["length", "foot", "inch", 1, 12],
    ["length", "mile", "yard", 1, 1760],
    ["length", "nauticalMile", "meter", 1, 1852],
    ["mass", "poundMass", "ounceMass", 1, 16],
    ["mass", "stone", "poundMass", 1, 14],
    ["mass", "shortTon", "poundMass", 1, 2000],
    ["area", "acre", "squareFoot", 1, 43560],
    ["volume", "gallonUs", "quartUs", 1, 4],
    ["volume", "gallonUs", "fluidOunceUs", 1, 128],
    ["volume", "gallonImperial", "liter", 1, 4.54609],
    ["digital", "byte", "bit", 1, 8],
    ["digital", "mebibyte", "byte", 1, 2 ** 20],
    ["time", "week", "day", 1, 7],
    ["time", "year", "month", 1, 12],
  ] as const)(
    "matches the golden relationship in %s: %s → %s",
    (categoryId, fromId, toId, value, expected) => {
      const category = CATEGORIES[categoryId]
      const result = convertUnits(
        value,
        unit(category, fromId),
        unit(category, toId)
      )

      expect(result).toBeCloseTo(expected, 10)
    }
  )

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

  test("converts each target directly at extreme magnitudes", () => {
    const result = convertToAll(length, "kilometer", 1e308)

    expect(result.kilometer).toBe(1e308)
    expect(result.mile).toBe(1e308 * (1000 / 1609.344))
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
    expect(getCategory("__proto__")).toBeUndefined()
    expect(getCategory("constructor")).toBeUndefined()
  })

  test("findUnit resolves known and unknown ids", () => {
    expect(findUnit(length, "meter")?.symbol).toBe("m")
    expect(findUnit(length, "nope")).toBeUndefined()
  })

  test("registry ids, bases, and transforms are valid", () => {
    expect(Object.keys(CATEGORIES)).toEqual(CATEGORY_IDS)
    expect(new Set(CATEGORY_IDS).size).toBe(CATEGORY_IDS.length)

    for (const categoryId of CATEGORY_IDS) {
      const category = CATEGORIES[categoryId]
      const unitIds = category.units.map(({ id }) => id)
      const base = findUnit(category, category.baseUnitId)

      expect(category.id).toBe(categoryId)
      expect(new Set(unitIds).size).toBe(unitIds.length)
      expect(base).toBeDefined()
      expect(base?.factor).toBe(1)
      expect(base?.offset ?? 0).toBe(0)

      for (const registeredUnit of category.units) {
        expect(Number.isFinite(registeredUnit.factor)).toBe(true)
        expect(registeredUnit.factor).toBeGreaterThan(0)
        expect(Number.isFinite(registeredUnit.offset ?? 0)).toBe(true)
      }
    }
  })
})
