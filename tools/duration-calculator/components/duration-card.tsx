import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldError } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

import type { DurationCardProps } from "../client/types"
import type { DurationParts } from "../core/duration"

const PART_FIELDS = [
  ["days", "daysLabel"],
  ["hours", "hoursLabel"],
  ["minutes", "minutesLabel"],
  ["seconds", "secondsLabel"],
  ["milliseconds", "millisecondsLabel"],
] as const satisfies readonly [
  keyof DurationParts,
  keyof DurationCardProps["messages"],
][]

function DurationCard({
  messages,
  durationIsoInput,
  durationParts,
  normalizedDurationIso,
  durationIsoInvalid,
  onDurationIsoInputChange,
  onDurationPartChange,
}: DurationCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.durationLabel}</CardTitle>
        <CardDescription>{messages.durationHint}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="duration-calculator-iso-input">
            {messages.durationIsoLabel}
          </Label>
          <Input
            id="duration-calculator-iso-input"
            value={durationIsoInput}
            onChange={(event) => {
              onDurationIsoInputChange(event.target.value)
            }}
            aria-invalid={durationIsoInvalid}
            placeholder={messages.durationPlaceholder}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-sm text-muted-foreground">
            {messages.durationHint}
          </p>
          <FieldError>
            {durationIsoInvalid ? messages.invalidDurationLabel : null}
          </FieldError>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {PART_FIELDS.map(([key, labelKey]) => (
            <div key={key} className="grid gap-2">
              <Label htmlFor={`duration-calculator-${key}`}>
                {messages[labelKey]}
              </Label>
              <Input
                id={`duration-calculator-${key}`}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={String(durationParts[key])}
                onChange={(event) => {
                  onDurationPartChange(key, event.target.value)
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end border-t">
        <ToolCopyButton
          value={normalizedDurationIso}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />
      </CardFooter>
    </Card>
  )
}

export { DurationCard }
