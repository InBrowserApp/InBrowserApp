import { DEFAULT_PRECISION } from "../core/format"
import { CATEGORY_IDS, DEFAULT_PAIRS } from "../core/units"

import type { PrecisionOption } from "../core/format"
import type { UnitCategoryId } from "../core/units"

const DEFAULT_CATEGORY: UnitCategoryId = "length"

const SAMPLE = {
  category: DEFAULT_CATEGORY,
  value: "1",
} as const

const STORAGE_KEY = "tools:unit-converter:state"
const STORAGE_VERSION = 2

type StoredUnits = Readonly<
  Record<UnitCategoryId, { from: string; to: string }>
>

function createDefaultUnits(): StoredUnits {
  return Object.fromEntries(
    CATEGORY_IDS.map((id) => [id, { ...DEFAULT_PAIRS[id] }])
  ) as StoredUnits
}

export {
  createDefaultUnits,
  DEFAULT_CATEGORY,
  DEFAULT_PRECISION,
  SAMPLE,
  STORAGE_KEY,
  STORAGE_VERSION,
}
export type { PrecisionOption, StoredUnits }
