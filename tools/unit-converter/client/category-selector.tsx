import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { CATEGORY_IDS } from "../core/units"

import type { UnitCategoryId } from "../core/units"

type CategorySelectorProps = Readonly<{
  label: string
  names: Readonly<Record<UnitCategoryId, string>>
  onChange: (category: UnitCategoryId) => void
  value: UnitCategoryId
}>

function CategorySelector({
  label,
  names,
  onChange,
  value,
}: CategorySelectorProps) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <ToggleGroup
        type="single"
        value={value}
        variant="outline"
        className="flex-wrap justify-start gap-2"
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
    </div>
  )
}

export { CategorySelector }
