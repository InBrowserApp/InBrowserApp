"use client"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

type ColorFieldProps = Readonly<{
  id: string
  label: string
  description?: string
  value: string
  onChange: (next: string) => void
}>

function normalizeHexInput(raw: string): string {
  const trimmed = raw.trim()

  if (!trimmed) {
    return "#000000"
  }

  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`
  return withHash.toUpperCase()
}

function isValidHex(value: string): boolean {
  return /^#[0-9A-F]{6}$/.test(value)
}

function ColorField({
  id,
  label,
  description,
  value,
  onChange,
}: ColorFieldProps) {
  const safeValue = isValidHex(value) ? value : "#FFFFFF"

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          value={safeValue}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-9 w-12 cursor-pointer rounded-md border border-input bg-background p-1"
          aria-label={label}
        />
        <Input
          value={value}
          onChange={(event) => {
            const next = normalizeHexInput(event.target.value)
            onChange(next)
          }}
          className="font-mono uppercase"
          maxLength={7}
          spellCheck={false}
        />
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

export { ColorField }
