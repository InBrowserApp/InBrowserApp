import { findUnit, getCategory } from "./units"

import type { Unit, UnitCategory } from "./units"

// base = (value + offset) * factor
function toBase(value: number, unit: Unit): number {
  return (value + (unit.offset ?? 0)) * unit.factor
}

function fromBase(base: number, unit: Unit): number {
  const offset = unit.offset ?? 0
  const scaled = base / unit.factor

  return normalizeOffsetCancellation(scaled - offset, scaled, offset)
}

function convertUnits(value: number, from: Unit, to: Unit): number {
  if (from.id === to.id) {
    return value
  }

  const fromOffset = from.offset ?? 0
  const toOffset = to.offset ?? 0
  const scaled = (value + fromOffset) * (from.factor / to.factor)

  return normalizeOffsetCancellation(scaled - toOffset, scaled, toOffset)
}

// Subtracting a temperature scale offset can leave a few ulps around zero.
// Only normalize cancellation at the target offset; tiny linear quantities
// and genuine temperatures close to absolute zero must remain untouched.
function normalizeOffsetCancellation(
  value: number,
  scaled: number,
  offset: number
): number {
  if (!Number.isFinite(value) || offset === 0) {
    return value
  }

  const scale = Math.max(Math.abs(scaled), Math.abs(offset))
  const tolerance = scale * Number.EPSILON * 4

  return Math.abs(value) <= tolerance ? 0 : value
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

  const result: Record<string, number> = {}

  for (const unit of category.units) {
    result[unit.id] = convertUnits(value, fromUnit, unit)
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
