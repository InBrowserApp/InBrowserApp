import {
  Field,
  FieldError,
  FieldLabel,
  FieldTitle,
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
import { Slider } from "@workspace/ui/components/ui/slider"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type { SelectChoice } from "./types"

type TextInputFieldProps = Readonly<{
  autoComplete?: string
  error?: string
  id: string
  inputMode?: "decimal" | "email" | "tel" | "text" | "url"
  label: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "datetime-local" | "email" | "number" | "tel" | "text" | "url"
  value: string
}>

function TextInputField({
  autoComplete,
  error,
  id,
  inputMode,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: TextInputFieldProps) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        aria-invalid={error ? true : undefined}
        autoComplete={autoComplete}
        id={id}
        inputMode={inputMode}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
      <FieldError>{error}</FieldError>
    </Field>
  )
}

function TextareaField({
  error,
  id,
  label,
  onChange,
  placeholder,
  value,
}: Readonly<{
  error?: string
  id: string
  label: string
  onChange: (value: string) => void
  placeholder?: string
  value: string
}>) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        aria-invalid={error ? true : undefined}
        className="min-h-32 resize-y"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
      <FieldError>{error}</FieldError>
    </Field>
  )
}

function SelectField<TValue extends string>({
  id,
  label,
  onValueChange,
  options,
  value,
}: Readonly<{
  id: string
  label: string
  onValueChange: (value: TValue) => void
  options: readonly SelectChoice<TValue>[]
  value: TValue
}>) {
  const selectedLabel = options.find((option) => option.value === value)?.label

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          onValueChange(nextValue as TValue)
        }}
      >
        <SelectTrigger className="w-full" id={id}>
          <SelectValue>{selectedLabel}</SelectValue>
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

function SliderField({
  label,
  max,
  min,
  onValueChange,
  step,
  value,
}: Readonly<{
  label: string
  max: number
  min: number
  onValueChange: (value: number) => void
  step: number
  value: number
}>) {
  return (
    <Field>
      <div className="flex items-center justify-between gap-3">
        <FieldTitle>{label}</FieldTitle>
        <span className="font-mono text-sm text-muted-foreground">{value}</span>
      </div>
      <Slider
        aria-label={label}
        max={max}
        min={min}
        step={step}
        value={[value]}
        onValueChange={([nextValue]) => {
          if (nextValue !== undefined) {
            onValueChange(nextValue)
          }
        }}
      />
    </Field>
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
          type="color"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
        <code className="font-mono text-xs text-muted-foreground uppercase">
          {value}
        </code>
      </div>
    </Field>
  )
}

function SwitchField({
  checked,
  id,
  label,
  onCheckedChange,
}: Readonly<{
  checked: boolean
  id: string
  label: string
  onCheckedChange: (checked: boolean) => void
}>) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex min-h-8 items-center">
        <Switch checked={checked} id={id} onCheckedChange={onCheckedChange} />
      </div>
    </Field>
  )
}

export {
  ColorField,
  SelectField,
  SliderField,
  SwitchField,
  TextInputField,
  TextareaField,
}
