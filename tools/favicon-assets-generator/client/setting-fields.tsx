import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"

type ColorFieldProps = Readonly<{
  description?: string
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}>

function ColorField({
  description,
  id,
  label,
  value,
  onChange,
}: ColorFieldProps) {
  return (
    <Field>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Input
          aria-label={`${label} picker`}
          type="color"
          value={value}
          className="h-8 w-11 cursor-pointer p-1"
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
      </div>
      <Input
        id={id}
        value={value}
        spellCheck={false}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

type PercentageFieldProps = Readonly<{
  id: string
  label: string
  suffix: string
  value: number
  onChange: (value: number) => void
}>

function PercentageField({
  id,
  label,
  suffix,
  value,
  onChange,
}: PercentageFieldProps) {
  return (
    <Field>
      <div className="flex items-center justify-between gap-3">
        <FieldTitle>{label}</FieldTitle>
        <span className="font-mono text-sm text-muted-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        id={id}
        aria-label={label}
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={([nextValue]) => {
          if (nextValue === undefined) {
            return
          }

          onChange(nextValue)
        }}
      />
    </Field>
  )
}

export { ColorField, PercentageField }
