import { useState } from "react"
import { Input } from "@workspace/ui/components/ui/input"

export function PageInput({
  value,
  total,
  onPage,
  label,
  id,
}: {
  value: number | null
  total: number
  onPage: (page: number) => void
  label: string
  id?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)

  function commit(input: HTMLInputElement) {
    const typed = input.valueAsNumber
    setDraft(null)
    if (!Number.isFinite(typed)) return
    const page = Math.min(total, Math.max(1, Math.round(typed)))
    if (page !== value) onPage(page)
  }

  return (
    <Input
      id={id}
      aria-label={label}
      type="number"
      inputMode="numeric"
      dir="ltr"
      min={1}
      max={total}
      className="w-20 text-center tabular-nums"
      value={draft ?? value?.toString() ?? ""}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={(event) => commit(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          commit(event.currentTarget)
        }
      }}
    />
  )
}
