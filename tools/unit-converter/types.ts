import type { PrecisionOption } from "./core/format"
import type { UnitCategoryId } from "./core/units"
import type { ToolMeta } from "@workspace/tool-sdk"

type UnitConverterMessagesCatalog = Readonly<{
  converterTitle: string
  converterDescription: string
  categoryLabel: string
  fromLabel: string
  toLabel: string
  fromUnitLabel: string
  toUnitLabel: string
  swapLabel: string
  precisionLabel: string
  precisionOptions: Readonly<Record<PrecisionOption, string>>
  allUnitsTitle: string
  allUnitsDescription: string
  valuePlaceholder: string
  invalidValueMessage: string
  outOfRangeMessage: string
  copyValueLabel: string
  copiedLabel: string
  loadSampleLabel: string
  clearAllLabel: string
  categories: Readonly<Record<UnitCategoryId, string>>
  units: Readonly<Record<string, string>>
}>

type UnitConverterMessages = UnitConverterMessagesCatalog &
  Readonly<{
    meta: ToolMeta
  }>

export type { UnitConverterMessages, UnitConverterMessagesCatalog }
