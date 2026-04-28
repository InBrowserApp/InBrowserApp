import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

import { BaseField } from "./base-field"

import type { BaseFieldId } from "../core/number-base"

type CustomSectionProps = Readonly<{
  baseDraft: string
  baseValueId: string
  copyLabel: string
  copiedLabel: string
  description: string
  invalid: boolean
  label: string
  onBaseChange: (value: string) => void
  onBaseCommit: () => void
  onValueChange: (field: BaseFieldId, value: string) => void
  placeholder: string
  title: string
  value: string
  valueId: string
  valueLabel: string
}>

function CustomSection({
  baseDraft,
  baseValueId,
  copyLabel,
  copiedLabel,
  description,
  invalid,
  label,
  onBaseChange,
  onBaseCommit,
  onValueChange,
  placeholder,
  title,
  value,
  valueId,
  valueLabel,
}: CustomSectionProps) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-1">
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[10rem_minmax(0,1fr)]">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={baseValueId}>{valueLabel}</Label>
            <span aria-hidden="true" className="invisible h-9 shrink-0" />
          </div>
          <Input
            id={baseValueId}
            type="number"
            min={2}
            max={64}
            value={baseDraft}
            inputMode="numeric"
            className="h-11 font-mono text-base"
            onBlur={onBaseCommit}
            onChange={(event) => {
              onBaseChange(event.target.value)
            }}
          />
        </div>

        <BaseField
          id={valueId}
          label={label}
          placeholder={placeholder}
          value={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          invalid={invalid}
          onChange={(nextValue) => {
            onValueChange("custom", nextValue)
          }}
        />
      </div>
    </section>
  )
}

export { CustomSection }
