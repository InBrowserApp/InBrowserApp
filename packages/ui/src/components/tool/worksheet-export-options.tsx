import { useEffect, useId, useRef, useState } from "react"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

type Options = {
  format: "csv" | "tsv" | "json" | "markdown"
  values: "formatted" | "raw"
  firstRowHeader: boolean
}
type Messages = {
  format: string
  formats: Record<Options["format"], string>
  values: string
  valueModes: Record<Options["values"], string>
  firstRowHeader: string
}

export function WorksheetExportOptions({
  value,
  onChange,
  messages: m,
}: {
  value: Options
  onChange: (value: Options) => void
  messages: Messages
}) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortal(root.current!.closest("dialog"))
  }, [])
  const fields = [
    { key: "format" as const, label: m.format, options: m.formats },
    { key: "values" as const, label: m.values, options: m.valueModes },
  ]
  return (
    <div ref={root} className="flex flex-wrap items-end gap-3">
      {fields.map(({ key, label, options }) => (
        <Field key={key} className="min-w-0 flex-1 basis-40 gap-1">
          <FieldLabel htmlFor={`${id}-${key}`}>{label}</FieldLabel>
          <Select
            value={value[key]}
            onValueChange={(next) => onChange({ ...value, [key]: next })}
          >
            <SelectTrigger id={`${id}-${key}`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent container={portal}>
              <SelectGroup>
                {Object.entries(options).map(([option, text]) => (
                  <SelectItem key={option} value={option}>
                    {text}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      ))}
      {value.format === "markdown" ? (
        <Field orientation="horizontal" className="basis-full gap-2">
          <Checkbox
            id={`${id}-header`}
            checked={value.firstRowHeader}
            onCheckedChange={(checked) =>
              onChange({ ...value, firstRowHeader: checked === true })
            }
          />
          <FieldLabel htmlFor={`${id}-header`}>{m.firstRowHeader}</FieldLabel>
        </Field>
      ) : null}
    </div>
  )
}
