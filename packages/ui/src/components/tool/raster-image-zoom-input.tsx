import { useEffect, useState } from "react"
import { Input } from "@workspace/ui/components/ui/input"

export function ZoomInput({
  value,
  label,
  onChange,
}: {
  value: number
  label: string
  onChange: (value: number) => void
}) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])
  function commit() {
    const next = Number(draft)
    if (draft.trim() && Number.isFinite(next) && next > 0) {
      if (next !== value) onChange(next)
    } else setDraft(String(value))
  }
  return (
    <Input
      className="w-24"
      aria-label={label}
      type="number"
      inputMode="decimal"
      step="any"
      min="0"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          commit()
        }
        if (event.key === "Escape" && draft !== String(value)) {
          event.preventDefault()
          event.stopPropagation()
          setDraft(String(value))
        }
      }}
    />
  )
}
