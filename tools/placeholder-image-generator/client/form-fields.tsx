import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"

type OptionPillChoice<TValue extends string | number> = Readonly<{
  label: string
  value: TValue
}>

function OptionPills<TValue extends string | number>({
  onChange,
  options,
  value,
}: Readonly<{
  onChange: (value: TValue) => void
  options: readonly OptionPillChoice<TValue>[]
  value: TValue
}>) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {options.map((option) => (
        <Button
          key={option.label}
          onClick={() => {
            onChange(option.value)
          }}
          size="sm"
          type="button"
          variant={value === option.value ? "secondary" : "outline"}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

function ColorField({
  label,
  onChange,
  value,
}: Readonly<{
  label: string
  onChange: (value: string) => void
  value: string
}>) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <input
          aria-label={label}
          className="h-10 w-14 cursor-pointer rounded-lg border border-input bg-transparent p-1"
          onChange={(event) => {
            onChange(event.target.value)
          }}
          type="color"
          value={value}
        />
        <code className="font-mono text-xs text-muted-foreground uppercase">
          {value}
        </code>
      </div>
    </Field>
  )
}

function NumberField({
  id,
  label,
  min = 0,
  onChange,
  placeholder,
  value,
}: Readonly<{
  id: string
  label: string
  min?: number
  onChange: (value: number) => void
  placeholder?: string
  value: number
}>) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        min={min}
        onChange={(event) => {
          onChange(Number(event.target.value) || 0)
        }}
        placeholder={placeholder}
        type="number"
        value={value}
      />
    </Field>
  )
}

function SliderField({
  description,
  label,
  max,
  min,
  onValueChange,
  step = 1,
  suffix = "",
  value,
}: Readonly<{
  description?: string
  label: string
  max: number
  min: number
  onValueChange: (value: number) => void
  step?: number
  suffix?: string
  value: number
}>) {
  return (
    <Field className="gap-4">
      <div className="flex items-center justify-between gap-3">
        <FieldTitle>{label}</FieldTitle>
        <span className="font-mono text-sm text-muted-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        aria-label={label}
        max={max}
        min={min}
        onValueChange={([nextValue]) => {
          if (nextValue === undefined) {
            return
          }

          onValueChange(nextValue)
        }}
        step={step}
        value={[value]}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

export { ColorField, NumberField, OptionPills, SliderField }
