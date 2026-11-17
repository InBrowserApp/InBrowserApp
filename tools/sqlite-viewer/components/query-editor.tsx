import { useEffect, useId, useRef, useState } from "react"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import type { Messages } from "../types"

export function QueryEditor({
  sql,
  onSql,
  limit,
  onLimit,
  onRun,
  onCancel,
  busy,
  invalid,
  messages: m,
  lang,
}: {
  sql: string
  onSql: (sql: string) => void
  limit: number
  onLimit: (limit: number) => void
  onRun: () => void
  onCancel: () => void
  busy: boolean
  invalid: boolean
  messages: Messages
  lang: string
}) {
  const id = useId()
  const root = useRef<HTMLFormElement>(null)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortal(root.current!.closest("dialog"))
  }, [])
  return (
    <form
      ref={root}
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (!busy) onRun()
      }}
    >
      <Field>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <FieldLabel htmlFor={id}>{m.sql}</FieldLabel>
          <Badge variant="outline">{m.readOnly}</Badge>
        </div>
        <Textarea
          id={id}
          name="sql"
          dir="ltr"
          aria-describedby={`${id}-hint`}
          aria-invalid={invalid}
          autoComplete="off"
          spellCheck={false}
          value={sql}
          onChange={(event) => onSql(event.target.value)}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault()
              if (!busy) onRun()
            }
          }}
          placeholder={m.placeholder}
          className="[field-sizing:fixed] min-h-32 resize-y font-mono text-sm"
        />
        <FieldDescription id={`${id}-hint`}>{m.sqlHint}</FieldDescription>
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor={`${id}-limit`}
            className="text-sm text-muted-foreground"
          >
            {m.rowLimit}
          </label>
          <Select
            value={String(limit)}
            onValueChange={(value) => onLimit(Number(value))}
            disabled={busy}
          >
            <SelectTrigger id={`${id}-limit`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent container={portal}>
              <SelectGroup>
                {[100, 1000, 10000].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {new Intl.NumberFormat(lang).format(value)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {busy ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              {m.cancel}
            </Button>
          ) : null}
          <Button type="submit" disabled={busy}>
            {busy ? <Spinner aria-hidden="true" /> : null}
            {busy ? m.running : m.run}
          </Button>
        </div>
      </div>
    </form>
  )
}
