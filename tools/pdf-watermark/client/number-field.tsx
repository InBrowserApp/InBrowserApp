import { useId } from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"

function NumberField({
  label,
  value,
  min,
  max,
  unit,
  description,
  onChange,
}: Readonly<{
  label: string
  value: number
  min: number
  max: number
  unit: string
  description?: string
  onChange: (value: number) => void
}>) {
  const id = useId()
  function update(n: number) {
    if (Number.isFinite(n))
      onChange(Math.max(min, Math.min(max, Math.round(n))))
  }
  return (
    <Field className="gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <Slider
          aria-label={label}
          className="min-w-0 flex-1"
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={([n]) => update(n ?? value)}
        />
        <Input
          className="w-20 tabular-nums"
          id={id}
          name={id}
          type="number"
          autoComplete="off"
          min={min}
          max={max}
          value={value}
          onChange={(event) => update(Number(event.target.value))}
        />
        <span className="w-5 text-xs text-muted-foreground" aria-hidden="true">
          {unit}
        </span>
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

export { NumberField }
