import { useId } from "react"

import { MAX_ISO_DATE, MIN_ISO_DATE } from "@workspace/calendar-date"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

import type { DateAgeMessages } from "./messages"

type FieldProps = Readonly<{
  label: string
  value: string
  onChange?: (value: string) => void
  error?: string
  max?: string
  type?: "date" | "days"
}>

export function CalendarField({
  label,
  value,
  onChange,
  error,
  max = MAX_ISO_DATE,
  type = "date",
}: FieldProps) {
  const id = useId()
  const errorId = id + "-error"
  const isDate = type === "date"

  return (
    <div className="grid min-w-0 content-start gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className="h-11 scheme-light dark:scheme-dark"
        dir="ltr"
        type={isDate ? "date" : "text"}
        inputMode={isDate ? undefined : "numeric"}
        min={isDate ? MIN_ISO_DATE : undefined}
        max={isDate ? max : undefined}
        autoComplete="off"
        value={value}
        readOnly={!onChange}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

type ResultProps = Readonly<{
  label: string
  value: string | number | null
  lang: string
  unavailable?: string
  messages: DateAgeMessages
}>

export function CalendarResult({
  label,
  value,
  lang,
  unavailable,
  messages,
}: ResultProps) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString(lang) : value

  return (
    <div
      role="group"
      aria-label={label}
      className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <output aria-label={label} className="mt-1 block">
          {unavailable || (
            <bdi dir="ltr" className="text-2xl font-semibold tabular-nums">
              {displayValue ?? "—"}
            </bdi>
          )}
        </output>
      </div>
      <ToolCopyButton
        size="sm"
        variant="ghost"
        value={value === null ? "" : String(value)}
        copyLabel={messages.copyLabel}
        copiedLabel={messages.copiedLabel}
      />
    </div>
  )
}
