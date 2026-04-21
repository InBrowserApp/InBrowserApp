import { useEffect, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

type EditableFieldProps = Readonly<{
  copyLabel: string
  copiedLabel: string
  description: string
  inputTestId: string
  invalidMessage: string
  label: string
  onCommit: (value: string) => boolean
  value: string
}>

export function EditableField({
  copyLabel,
  copiedLabel,
  description,
  inputTestId,
  invalidMessage,
  label,
  onCommit,
  value,
}: EditableFieldProps) {
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
          <FieldLabel htmlFor={inputTestId}>{label}</FieldLabel>
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
        data-testid={inputTestId}
        id={inputTestId}
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
        value={draft}
      />
      {invalid ? <FieldError>{invalidMessage}</FieldError> : null}
    </Field>
  )
}
