import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type { UuidFormat } from "../core/uuid-converter"
import type { FormatCopy } from "../types"

type FormatCardProps = Readonly<{
  format: UuidFormat
  copy: FormatCopy
  inputId: string
  invalid: boolean
  multiline: boolean
  value: string
  copiedLabel: string
  copyDisabled: boolean
  onValueChange: (format: UuidFormat, value: string) => void
}>

function FormatCard({
  copy,
  copiedLabel,
  copyDisabled,
  format,
  inputId,
  invalid,
  multiline,
  onValueChange,
  value,
}: FormatCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{copy.label}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        <Field data-invalid={invalid ? true : undefined}>
          <FieldLabel htmlFor={inputId} className="sr-only">
            {copy.label}
          </FieldLabel>
          {multiline ? (
            <Textarea
              id={inputId}
              name={format}
              rows={format === "binary" ? 5 : 3}
              autoComplete="off"
              spellCheck={false}
              aria-label={copy.label}
              aria-invalid={invalid}
              value={value}
              onChange={(event) => {
                onValueChange(format, event.target.value)
              }}
              placeholder={copy.placeholder}
              className="min-h-24 resize-y font-mono text-sm"
            />
          ) : (
            <Input
              id={inputId}
              name={format}
              autoComplete="off"
              spellCheck={false}
              aria-label={copy.label}
              aria-invalid={invalid}
              value={value}
              onChange={(event) => {
                onValueChange(format, event.target.value)
              }}
              placeholder={copy.placeholder}
              className="font-mono"
            />
          )}
          {invalid ? <FieldError>{copy.invalidMessage}</FieldError> : null}
        </Field>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end border-t">
        <ToolCopyButton
          value={value}
          copyLabel={copy.copyLabel}
          copiedLabel={copiedLabel}
          disabled={copyDisabled}
          variant="ghost"
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { FormatCard }
