import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import type { UnitCategory } from "../core/units"

type UnitSelectProps = Readonly<{
  ariaLabel: string
  category: UnitCategory
  direction: "ltr" | "rtl"
  onChange: (unitId: string) => void
  unitNames: Readonly<Record<string, string>>
  value: string
}>

function UnitSelect({
  ariaLabel,
  category,
  direction,
  onChange,
  unitNames,
  value,
}: UnitSelectProps) {
  return (
    <Select dir={direction} value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={ariaLabel} className="h-11 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {category.units.map((unit) => (
            <SelectItem key={unit.id} value={unit.id}>
              {unitNames[unit.id]} ({unit.symbol})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { UnitSelect }
