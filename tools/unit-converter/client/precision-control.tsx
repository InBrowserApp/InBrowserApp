import { useId } from "react"

import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import { PRECISION_OPTIONS } from "../core/format"

import type { PrecisionOption } from "../core/format"

type PrecisionControlProps = Readonly<{
  label: string
  onChange: (precision: PrecisionOption) => void
  optionLabels: Readonly<Record<PrecisionOption, string>>
  value: PrecisionOption
}>

function PrecisionControl({
  label,
  onChange,
  optionLabels,
  value,
}: PrecisionControlProps) {
  const id = useId()

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          onChange(next as PrecisionOption)
        }}
      >
        <SelectTrigger id={id} className="h-10 w-full sm:w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRECISION_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {optionLabels[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { PrecisionControl }
