import { useEffect, useRef, useState } from "react"
import type { ComponentProps } from "react"
import { Input } from "@workspace/ui/components/ui/input"

type Props = Omit<
  ComponentProps<typeof Input>,
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "onKeyDown"
  | "min"
  | "max"
  | "type"
> & {
  value: number
  min: number
  max: number
  onCommit: (value: number) => void
}

export function DocumentNumberInput({
  value,
  min,
  max,
  onCommit,
  ...props
}: Props) {
  const [draft, setDraft] = useState(String(value))
  const dirty = useRef(false)
  useEffect(() => {
    setDraft(String(value))
    dirty.current = false
  }, [value])
  function commit() {
    if (!dirty.current) return
    dirty.current = false
    const next = Number(draft)
    if (draft.trim() && Number.isInteger(next) && next >= min && next <= max) {
      setDraft(String(next))
      if (next !== value) onCommit(next)
    } else setDraft(String(value))
  }
  return (
    <Input
      {...props}
      type="number"
      inputMode="numeric"
      autoComplete="off"
      min={min}
      max={max}
      value={draft}
      onChange={(event) => {
        dirty.current = true
        setDraft(event.target.value)
      }}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          commit()
        } else if (event.key === "Escape" && dirty.current) {
          event.preventDefault()
          event.stopPropagation()
          dirty.current = false
          setDraft(String(value))
        }
      }}
    />
  )
}
