import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Slider } from "@workspace/ui/components/ui/slider"

type NumberFieldProps = Readonly<{
  id: string
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  step?: number
  value: number
}>

function NumberField({
  id,
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}: NumberFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <Slider
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(nextValue) => {
            onChange(nextValue[0] ?? min)
          }}
        />
        <InputGroup className="w-20 shrink-0">
          <InputGroupInput
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={String(value)}
            onChange={(event) => {
              onChange(Number(event.target.value))
            }}
          />
        </InputGroup>
      </div>
    </Field>
  )
}

export { NumberField }
