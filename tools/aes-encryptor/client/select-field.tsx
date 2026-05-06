import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import type { SelectOption } from "./types"

function SelectField<TValue extends string>({
  label,
  value,
  options,
  onValueChange,
}: Readonly<{
  label: string
  value: TValue
  options: readonly SelectOption<TValue>[]
  onValueChange: (value: TValue) => void
}>) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue as TValue)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export { SelectField }
