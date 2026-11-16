import { useEffect, useId, useState } from "react"
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
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])
  function update(n: number) {
    const next = Number.isFinite(n)
      ? Math.max(min, Math.min(max, Math.round(n)))
      : value
    setDraft(String(next))
    onChange(next)
  }
  return (
    <Field className="gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <Slider
          aria-label={label}
          aria-valuetext={`${value} ${unit}`}
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
          name={label}
          type="number"
          dir="ltr"
          autoComplete="off"
          min={min}
          max={max}
          value={draft}
          onChange={(event) => {
            const raw = event.target.value
            setDraft(raw)
            const next = Number(raw)
            if (raw && Number.isFinite(next) && next >= min && next <= max)
              onChange(next)
          }}
          onBlur={() => update(draft ? Number(draft) : value)}
          aria-describedby={`${id}-unit`}
        />
        <span className="w-5 text-xs text-muted-foreground" id={`${id}-unit`}>
          {unit}
        </span>
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

export { NumberField }
