import { useId, useState } from "react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { clamp } from "../core/geometry"
import type { Messages, Options } from "../types"

function AxisField({
  axis,
  messages: m,
  options,
  onChange,
}: {
  axis: "x" | "y"
  messages: Messages
  options: Options
  onChange: (options: Options) => void
}) {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {axis === "x" ? m.horizontalPosition : m.verticalPosition} (%)
      </FieldLabel>
      <Input
        id={id}
        name={`watermark-${axis}`}
        type="number"
        inputMode="decimal"
        dir="ltr"
        min={0}
        max={100}
        step={0.1}
        value={draft ?? Math.round(options[axis] * 100) / 100}
        onChange={(event) => {
          setDraft(event.target.value)
          if (event.target.value !== "")
            onChange({
              ...options,
              [axis]: clamp(Number(event.target.value), 0, 100),
            })
        }}
        onBlur={() => setDraft(null)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setDraft(null)
            event.currentTarget.blur()
          }
        }}
      />
    </Field>
  )
}

export function PositionFields({
  messages: m,
  options,
  onChange,
}: {
  messages: Messages
  options: Options
  onChange: (options: Options) => void
}) {
  return (
    <FieldGroup>
      <div className="grid grid-cols-2 gap-3">
        {(["x", "y"] as const).map((axis) => (
          <AxisField
            key={axis}
            axis={axis}
            messages={m}
            options={options}
            onChange={onChange}
          />
        ))}
      </div>
      <FieldDescription>{m.customPositionHint}</FieldDescription>
    </FieldGroup>
  )
}
