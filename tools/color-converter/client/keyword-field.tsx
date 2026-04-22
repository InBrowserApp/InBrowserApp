import { useEffect, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import { CSS_KEYWORDS } from "../core/color"

type KeywordFieldProps = Readonly<{
  copyLabel: string
  copiedLabel: string
  description: string
  invalidMessage: string
  label: string
  onCommit: (value: string) => boolean
  value: string
}>

export function KeywordField({
  copyLabel,
  copiedLabel,
  description,
  invalidMessage,
  label,
  onCommit,
  value,
}: KeywordFieldProps) {
  const [draft, setDraft] = useState(value)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    setDraft(value)
    setInvalid(false)
  }, [value])

  function commit() {
    if (draft === value) {
      setInvalid(false)
      return
    }
    setInvalid(!onCommit(draft))
  }

  return (
    <Field
      className="gap-3 rounded-xl border bg-muted/20 p-4"
      data-invalid={invalid || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <FieldLabel htmlFor="keyword-input">{label}</FieldLabel>
          <FieldDescription>{description}</FieldDescription>
        </div>
        <ToolCopyButton
          copiedLabel={copiedLabel}
          copyLabel={copyLabel}
          value={value}
        />
      </div>
      <Input
        aria-invalid={invalid || undefined}
        autoComplete="off"
        data-testid="keyword-input"
        id="keyword-input"
        list="color-converter-keywords"
        onBlur={commit}
        onChange={(event) => {
          setDraft(event.target.value)
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            commit()
          }
        }}
        spellCheck={false}
        value={draft}
      />
      <datalist id="color-converter-keywords">
        {CSS_KEYWORDS.map((keyword) => (
          <option key={keyword} value={keyword} />
        ))}
      </datalist>
      {invalid ? <FieldError>{invalidMessage}</FieldError> : null}
    </Field>
  )
}
