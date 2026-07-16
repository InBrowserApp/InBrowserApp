import { createDefaultUnits, STORAGE_KEY, STORAGE_VERSION } from "./constants"
import { PRECISION_OPTIONS } from "../core/format"
import { CATEGORY_IDS, findUnit, getCategory } from "../core/units"

import type { PrecisionOption, StoredUnits } from "./constants"
import type { UnitCategoryId } from "../core/units"

type StoredState = Readonly<{
  category: UnitCategoryId
  precision: PrecisionOption
  units: StoredUnits
  value: string
}>
type StorageReader = Pick<Storage, "getItem">
type StorageWriter = Pick<Storage, "setItem">

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parseUnits(value: unknown): StoredUnits | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const units = createDefaultUnits()
  const entries: Array<[UnitCategoryId, { from: string; to: string }]> = []

  for (const categoryId of CATEGORY_IDS) {
    const pair = value[categoryId]
    const category = getCategory(categoryId)!

    if (
      !isRecord(pair) ||
      typeof pair.from !== "string" ||
      typeof pair.to !== "string" ||
      !findUnit(category, pair.from) ||
      !findUnit(category, pair.to)
    ) {
      return undefined
    }

    entries.push([categoryId, { from: pair.from, to: pair.to }])
  }

  return { ...units, ...Object.fromEntries(entries) }
}

function parseStoredState(raw: string | null): StoredState | undefined {
  if (raw === null) {
    return undefined
  }

  let value: unknown

  try {
    value = JSON.parse(raw)
  } catch {
    return undefined
  }

  if (
    !isRecord(value) ||
    value.version !== STORAGE_VERSION ||
    typeof value.category !== "string" ||
    !getCategory(value.category) ||
    typeof value.value !== "string" ||
    typeof value.precision !== "string" ||
    !PRECISION_OPTIONS.includes(value.precision as PrecisionOption)
  ) {
    return undefined
  }

  const units = parseUnits(value.units)

  if (!units) {
    return undefined
  }

  return {
    category: value.category as UnitCategoryId,
    precision: value.precision as PrecisionOption,
    units,
    value: value.value,
  }
}

function readStoredState(storage?: StorageReader): StoredState | undefined {
  /* v8 ignore next 3 */
  if (typeof window === "undefined") {
    return undefined
  }

  try {
    const target = storage ?? window.localStorage
    return parseStoredState(target.getItem(STORAGE_KEY))
  } catch {
    return undefined
  }
}

function writeStoredState(
  state: StoredState,
  storage?: StorageWriter
): boolean {
  /* v8 ignore next 3 */
  if (typeof window === "undefined") {
    return false
  }

  try {
    const target = storage ?? window.localStorage
    target.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, ...state })
    )
    return true
  } catch {
    return false
  }
}

export { parseStoredState, readStoredState, writeStoredState }
