import { findUnit, getCategory } from "./units"

import type { Unit, UnitCategory } from "./units"

// base = value * factor + offset
function toBase(value: number, unit: Unit): number {
  return value * unit.factor + (unit.offset ?? 0)
}

function fromBase(base: number, unit: Unit): number {
  return (base - (unit.offset ?? 0)) / unit.factor
}

function convertUnits(value: number, from: Unit, to: Unit): number {
  return fromBase(toBase(value, from), to)
}

type AllConversions = Readonly<Record<string, number>>

// Convert a value expressed in `fromUnitId` to every unit in the category.
function convertToAll(
  category: UnitCategory,
  fromUnitId: string,
  value: number
): AllConversions {
  const fromUnit = findUnit(category, fromUnitId)

  if (!fromUnit) {
    return {}
  }

  const base = toBase(value, fromUnit)
  const result: Record<string, number> = {}

  for (const unit of category.units) {
    result[unit.id] = fromBase(base, unit)
  }

  return result
}

// Convenience wrapper used by the UI: resolves ids and guards missing units.
function convertByIds(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number
): number | undefined {
  const category = getCategory(categoryId)

  if (!category) {
    return undefined
  }

  const from = findUnit(category, fromUnitId)
  const to = findUnit(category, toUnitId)

  if (!from || !to) {
    return undefined
  }

  return convertUnits(value, from, to)
}

export { convertByIds, convertToAll, convertUnits, fromBase, toBase }
export type { AllConversions }
