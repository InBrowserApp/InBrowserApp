import { useEffect, useId, useRef, useState } from "react"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import type { ImportOptions } from "../formats"
import type { Messages } from "../types"

export function ImportControls({
  value,
  onChange,
  messages: m,
}: {
  value: ImportOptions
  onChange: (value: ImportOptions) => void
  messages: Messages
}) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortal(root.current!.closest("dialog"))
  }, [])
  const fields = [
    {
      key: "delimiter" as const,
      label: m.delimiter,
      options: [
        ["auto", m.detect],
        [",", m.comma],
        [";", m.semicolon],
        ["\t", m.tab],
        ["|", m.pipe],
      ],
    },
    {
      key: "encoding" as const,
      label: m.encoding,
      options: [
        ["auto", m.detect],
        ["utf-8", "UTF-8"],
        ["utf-16le", "UTF-16 LE"],
        ["utf-16be", "UTF-16 BE"],
        ["windows-1252", "Windows-1252"],
        ["windows-1251", "Windows-1251"],
        ["gb18030", "GB18030"],
        ["big5", "Big5"],
        ["shift_jis", "Shift JIS"],
        ["euc-kr", "EUC-KR"],
      ],
    },
  ]
  return (
    <div
      ref={root}
      className="flex flex-wrap items-center gap-3 border-b px-3 py-2"
    >
      {fields.map(({ key, label, options }) => (
        <Field
          key={key}
          className="min-w-0 flex-1 basis-32 gap-1 sm:flex-none sm:basis-auto"
        >
          <FieldLabel htmlFor={`${id}-${key}`}>{label}</FieldLabel>
          <Select
            value={value[key]}
            onValueChange={(next) => onChange({ ...value, [key]: next })}
          >
            <SelectTrigger
              className="w-full sm:w-44"
              id={`${id}-${key}`}
              size="sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent container={portal}>
              <SelectGroup>
                {options.map(([option, text]) => (
                  <SelectItem key={option} value={option!}>
                    {text}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      ))}
      <p className="basis-full text-xs text-muted-foreground sm:basis-auto">
        {m.textValues}
      </p>
    </div>
  )
}
