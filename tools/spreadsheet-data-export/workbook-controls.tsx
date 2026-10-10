import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import type { Sheet } from "@workspace/spreadsheet-export/types"
import type { Messages } from "./types"

export function WorkbookControls({
  sheets,
  sheet,
  onSheet,
  draft,
  onDraft,
  onApply,
  invalid,
  messages: m,
}: {
  sheets: Sheet[]
  sheet: number
  onSheet: (index: number) => void
  draft: string
  onDraft: (value: string) => void
  onApply: () => void
  invalid: boolean
  messages: Messages
}) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortal(root.current!.closest("dialog"))
  }, [])
  return (
    <div ref={root} className="flex flex-wrap items-start gap-3">
      <Field className="min-w-0 flex-1 basis-40 gap-1">
        <FieldLabel htmlFor={`${id}-sheet`}>{m.sheet}</FieldLabel>
        <Select
          value={String(sheet)}
          onValueChange={(value) => onSheet(Number(value))}
        >
          <SelectTrigger id={`${id}-sheet`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent container={portal}>
            <SelectGroup>
              {sheets.map((item, index) => (
                <SelectItem key={index} value={String(index)}>
                  {item.name}
                  {item.hidden ? ` (${m.hidden})` : ""}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <form
        className="flex min-w-0 flex-1 basis-72 flex-wrap items-start gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          onApply()
        }}
      >
        <Field className="min-w-0 flex-1 basis-32 gap-1">
          <FieldLabel htmlFor={`${id}-range`}>{m.range}</FieldLabel>
          <Input
            id={`${id}-range`}
            dir="ltr"
            value={draft}
            onChange={(event) => onDraft(event.target.value)}
            placeholder={sheets[sheet]?.range || "A1:D20"}
            aria-describedby={`${id}-hint`}
            aria-invalid={invalid}
          />
          <p
            id={`${id}-hint`}
            className={
              invalid
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            {invalid ? m.invalidRange : m.rangeHint}
          </p>
        </Field>
        <Button className="mt-6" type="submit" variant="outline">
          {m.applyRange}
        </Button>
      </form>
    </div>
  )
}
