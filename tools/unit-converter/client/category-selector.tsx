import { useId } from "react"

import { FieldLegend, FieldSet } from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { CATEGORY_IDS } from "../core/units"

import type { UnitCategoryId } from "../core/units"

type CategorySelectorProps = Readonly<{
  label: string
  direction: "ltr" | "rtl"
  names: Readonly<Record<UnitCategoryId, string>>
  onChange: (category: UnitCategoryId) => void
  value: UnitCategoryId
}>

function CategorySelector({
  label,
  direction,
  names,
  onChange,
  value,
}: CategorySelectorProps) {
  const labelId = useId()

  return (
    <FieldSet className="gap-2">
      <FieldLegend id={labelId} variant="label">
        {label}
      </FieldLegend>
      <ToggleGroup
        type="single"
        aria-labelledby={labelId}
        dir={direction}
        value={value}
        variant="outline"
        spacing={8}
        className="w-full flex-wrap"
        onValueChange={(next) => {
          if (next) {
            onChange(next as UnitCategoryId)
          }
        }}
      >
        {CATEGORY_IDS.map((id) => (
          <ToggleGroupItem key={id} value={id} className="px-3">
            {names[id]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FieldSet>
  )
}

export { CategorySelector }
