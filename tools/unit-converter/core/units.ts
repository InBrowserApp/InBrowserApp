// Unit registry for the converter.
//
// Every unit is expressed relative to its category base unit with an affine
// transform: `base = value * factor + offset`. Linear units (length, mass,
// data, ...) leave `offset` at 0; only temperature needs a non-zero offset.
// This single model keeps the conversion core tiny and fully testable.

type Unit = Readonly<{
  id: string
  symbol: string
  factor: number
  offset?: number
}>

type UnitCategory = Readonly<{
  id: string
  baseUnitId: string
  units: readonly Unit[]
}>

const CATEGORY_IDS = [
  "length",
  "mass",
  "temperature",
  "area",
  "volume",
  "speed",
  "digital",
  "time",
] as const

type UnitCategoryId = (typeof CATEGORY_IDS)[number]

// Fahrenheit in kelvin: K = (F + 459.67) * 5 / 9 → factor 5/9, offset below.
const FAHRENHEIT_OFFSET = (459.67 * 5) / 9

const CATEGORIES: Readonly<Record<UnitCategoryId, UnitCategory>> = {
  length: {
    id: "length",
    baseUnitId: "meter",
    units: [
      { id: "kilometer", symbol: "km", factor: 1000 },
      { id: "meter", symbol: "m", factor: 1 },
      { id: "centimeter", symbol: "cm", factor: 0.01 },
      { id: "millimeter", symbol: "mm", factor: 0.001 },
      { id: "micrometer", symbol: "µm", factor: 1e-6 },
      { id: "nanometer", symbol: "nm", factor: 1e-9 },
      { id: "mile", symbol: "mi", factor: 1609.344 },
      { id: "yard", symbol: "yd", factor: 0.9144 },
      { id: "foot", symbol: "ft", factor: 0.3048 },
      { id: "inch", symbol: "in", factor: 0.0254 },
      { id: "nauticalMile", symbol: "nmi", factor: 1852 },
    ],
  },
  mass: {
    id: "mass",
    baseUnitId: "kilogram",
    units: [
      { id: "tonne", symbol: "t", factor: 1000 },
      { id: "kilogram", symbol: "kg", factor: 1 },
      { id: "gram", symbol: "g", factor: 0.001 },
      { id: "milligram", symbol: "mg", factor: 1e-6 },
      { id: "microgram", symbol: "µg", factor: 1e-9 },
      { id: "poundMass", symbol: "lb", factor: 0.45359237 },
      { id: "ounceMass", symbol: "oz", factor: 0.028349523125 },
      { id: "stone", symbol: "st", factor: 6.35029318 },
      { id: "shortTon", symbol: "ton", factor: 907.18474 },
      { id: "carat", symbol: "ct", factor: 0.0002 },
    ],
  },
  temperature: {
    id: "temperature",
    baseUnitId: "kelvin",
    units: [
      { id: "celsius", symbol: "°C", factor: 1, offset: 273.15 },
      {
        id: "fahrenheit",
        symbol: "°F",
        factor: 5 / 9,
        offset: FAHRENHEIT_OFFSET,
      },
      { id: "kelvin", symbol: "K", factor: 1, offset: 0 },
      { id: "rankine", symbol: "°R", factor: 5 / 9, offset: 0 },
    ],
  },
  area: {
    id: "area",
    baseUnitId: "squareMeter",
    units: [
      { id: "squareKilometer", symbol: "km²", factor: 1e6 },
      { id: "squareMeter", symbol: "m²", factor: 1 },
      { id: "squareCentimeter", symbol: "cm²", factor: 1e-4 },
      { id: "squareMillimeter", symbol: "mm²", factor: 1e-6 },
      { id: "hectare", symbol: "ha", factor: 10000 },
      { id: "acre", symbol: "ac", factor: 4046.8564224 },
      { id: "squareMile", symbol: "mi²", factor: 2589988.110336 },
      { id: "squareYard", symbol: "yd²", factor: 0.83612736 },
      { id: "squareFoot", symbol: "ft²", factor: 0.09290304 },
      { id: "squareInch", symbol: "in²", factor: 0.00064516 },
    ],
  },
  volume: {
    id: "volume",
    baseUnitId: "cubicMeter",
    units: [
      { id: "cubicMeter", symbol: "m³", factor: 1 },
      { id: "liter", symbol: "L", factor: 0.001 },
      { id: "milliliter", symbol: "mL", factor: 1e-6 },
      { id: "cubicFoot", symbol: "ft³", factor: 0.028316846592 },
      { id: "cubicInch", symbol: "in³", factor: 1.6387064e-5 },
      { id: "gallonUs", symbol: "gal", factor: 0.003785411784 },
      { id: "quartUs", symbol: "qt", factor: 9.46352946e-4 },
      { id: "pintUs", symbol: "pt", factor: 4.73176473e-4 },
      { id: "cupUs", symbol: "cup", factor: 2.365882365e-4 },
      { id: "fluidOunceUs", symbol: "fl oz", factor: 2.95735295625e-5 },
      { id: "tablespoonUs", symbol: "tbsp", factor: 1.478676478125e-5 },
      { id: "teaspoonUs", symbol: "tsp", factor: 4.92892159375e-6 },
      { id: "gallonImperial", symbol: "gal (UK)", factor: 0.00454609 },
    ],
  },
  speed: {
    id: "speed",
    baseUnitId: "meterPerSecond",
    units: [
      { id: "meterPerSecond", symbol: "m/s", factor: 1 },
      { id: "kilometerPerHour", symbol: "km/h", factor: 1 / 3.6 },
      { id: "milePerHour", symbol: "mph", factor: 0.44704 },
      { id: "knot", symbol: "kn", factor: 1852 / 3600 },
      { id: "footPerSecond", symbol: "ft/s", factor: 0.3048 },
    ],
  },
  digital: {
    id: "digital",
    baseUnitId: "byte",
    units: [
      { id: "bit", symbol: "bit", factor: 0.125 },
      { id: "byte", symbol: "B", factor: 1 },
      { id: "kilobyte", symbol: "kB", factor: 1e3 },
      { id: "megabyte", symbol: "MB", factor: 1e6 },
      { id: "gigabyte", symbol: "GB", factor: 1e9 },
      { id: "terabyte", symbol: "TB", factor: 1e12 },
      { id: "petabyte", symbol: "PB", factor: 1e15 },
      { id: "kibibyte", symbol: "KiB", factor: 2 ** 10 },
      { id: "mebibyte", symbol: "MiB", factor: 2 ** 20 },
      { id: "gibibyte", symbol: "GiB", factor: 2 ** 30 },
      { id: "tebibyte", symbol: "TiB", factor: 2 ** 40 },
      { id: "pebibyte", symbol: "PiB", factor: 2 ** 50 },
    ],
  },
  time: {
    id: "time",
    baseUnitId: "second",
    units: [
      { id: "nanosecond", symbol: "ns", factor: 1e-9 },
      { id: "microsecond", symbol: "µs", factor: 1e-6 },
      { id: "millisecond", symbol: "ms", factor: 0.001 },
      { id: "second", symbol: "s", factor: 1 },
      { id: "minute", symbol: "min", factor: 60 },
      { id: "hour", symbol: "h", factor: 3600 },
      { id: "day", symbol: "d", factor: 86400 },
      { id: "week", symbol: "wk", factor: 604800 },
      { id: "month", symbol: "mo", factor: 2629746 },
      { id: "year", symbol: "yr", factor: 31556952 },
    ],
  },
}

const DEFAULT_PAIRS: Readonly<
  Record<UnitCategoryId, Readonly<{ from: string; to: string }>>
> = {
  length: { from: "meter", to: "foot" },
  mass: { from: "kilogram", to: "poundMass" },
  temperature: { from: "celsius", to: "fahrenheit" },
  area: { from: "squareMeter", to: "squareFoot" },
  volume: { from: "liter", to: "gallonUs" },
  speed: { from: "kilometerPerHour", to: "milePerHour" },
  digital: { from: "megabyte", to: "mebibyte" },
  time: { from: "hour", to: "minute" },
}

function getCategory(id: string): UnitCategory | undefined {
  return CATEGORIES[id as UnitCategoryId]
}

function findUnit(category: UnitCategory, unitId: string): Unit | undefined {
  return category.units.find((unit) => unit.id === unitId)
}

export { CATEGORIES, CATEGORY_IDS, DEFAULT_PAIRS, findUnit, getCategory }
export type { Unit, UnitCategory, UnitCategoryId }
