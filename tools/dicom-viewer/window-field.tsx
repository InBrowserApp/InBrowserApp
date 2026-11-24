import { useId, useState } from "react"
import { Input } from "@workspace/ui/components/ui/input"

export function WindowField({
  label,
  value,
  min,
  onValue,
}: {
  label: string
  value: number
  min?: number
  onValue: (value: number) => void
}) {
  const id = useId()
  const [draft, setDraft] = useState<string>()
  return (
    <label htmlFor={id} className="grid min-w-0 gap-1.5 text-sm">
      {label}
      <Input
        id={id}
        type="number"
        dir="ltr"
        step="any"
        min={min}
        value={draft ?? value}
        onChange={(event) => {
          const input = event.currentTarget
          setDraft(input.value)
          if (
            input.validity.valid &&
            Number.isFinite(input.valueAsNumber) &&
            input.valueAsNumber !== value
          ) {
            onValue(input.valueAsNumber)
          }
        }}
        onBlur={() => setDraft(undefined)}
      />
    </label>
  )
}
