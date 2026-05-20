import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"

type NumberSliderFieldProps = Readonly<{
  description: string
  disabled: boolean
  id: string
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  suffix: string
  value: number
}>

function NumberSliderField({
  description,
  disabled,
  id,
  label,
  max,
  min,
  onChange,
  suffix,
  value,
}: NumberSliderFieldProps) {
  return (
    <Field className="gap-3">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <span className="font-mono text-sm text-muted-foreground">
          {value} {suffix}
        </span>
      </div>
      <FieldDescription>{description}</FieldDescription>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem]">
        <Slider
          aria-label={label}
          disabled={disabled}
          max={max}
          min={min}
          onValueChange={([nextValue]) => {
            onChange(nextValue ?? value)
          }}
          step={1}
          value={[value]}
        />
        <Input
          autoComplete="off"
          disabled={disabled}
          id={id}
          inputMode="numeric"
          max={max}
          min={min}
          onChange={(event) => {
            onChange(Number(event.target.value))
          }}
          type="number"
          value={value}
        />
      </div>
    </Field>
  )
}

export { NumberSliderField }
