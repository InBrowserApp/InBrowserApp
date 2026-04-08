import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import type { SkipEmptyLinesMode } from "../core/convert-csv-to-json"

type CheckboxFieldProps = Readonly<{
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}>

type TextFieldProps = Readonly<{
  id: string
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: "number" | "text"
  min?: number
  max?: number
  disabled?: boolean
  description?: string
}>

type SelectFieldProps = Readonly<{
  label: string
  value: SkipEmptyLinesMode
  options: readonly Readonly<{ label: string; value: SkipEmptyLinesMode }>[]
  onValueChange: (value: SkipEmptyLinesMode) => void
}>

function CheckboxField({
  id,
  label,
  checked,
  onCheckedChange,
}: CheckboxFieldProps) {
  return (
    <Field orientation="horizontal">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(nextChecked) => {
          onCheckedChange(Boolean(nextChecked))
        }}
      />
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      </FieldContent>
    </Field>
  )
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
  disabled,
  description,
}: TextFieldProps) {
  return (
    <Field data-disabled={disabled || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        placeholder={placeholder}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

function SkipEmptyLinesField({
  label,
  value,
  options,
  onValueChange,
}: SelectFieldProps) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          onValueChange(nextValue as SkipEmptyLinesMode)
        }}
      >
        <SelectTrigger className="w-full" aria-label={label}>
          <SelectValue>
            {options.find((option) => option.value === value)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
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

export { CheckboxField, SkipEmptyLinesField, TextField }
