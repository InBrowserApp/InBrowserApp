import { useId } from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Slider } from "@workspace/ui/components/ui/slider"

export function RangeField({
  label,
  value,
  min,
  max,
  suffix = "%",
  hint,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  suffix?: string
  hint?: string
  onChange: (value: number) => void
}) {
  const id = useId()
  return (
    <Field>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel id={id}>{label}</FieldLabel>
        <span className="text-sm text-muted-foreground tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        aria-labelledby={id}
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([next]) => onChange(next!)}
      />
      {hint ? <FieldDescription>{hint}</FieldDescription> : null}
    </Field>
  )
}

export function SelectField<T extends string>({
  label,
  value,
  choices,
  onChange,
}: {
  label: string
  value: T
  choices: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  const id = useId()
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={(next) => onChange(next as T)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {choices.map((choice) => (
              <SelectItem key={choice.value} value={choice.value}>
                {choice.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
