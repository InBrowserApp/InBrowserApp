import { useId } from "react"

import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

type RecurrenceNumberFieldProps = Readonly<{
  label: string
  name: string
  value: number
  min: number
  max?: number
  onValueChange: (value: number) => void
}>

function RecurrenceNumberField({
  label,
  name,
  value,
  min,
  max,
  onValueChange,
}: RecurrenceNumberFieldProps) {
  const inputId = useId()

  return (
    <Field>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <Input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        name={name}
        autoComplete="off"
        step={1}
        value={String(value)}
        onChange={(event) => {
          onValueChange(Number(event.target.value || min))
        }}
      />
    </Field>
  )
}

export { RecurrenceNumberField }
