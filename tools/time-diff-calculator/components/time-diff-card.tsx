import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldError } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Clock3 } from "@workspace/ui/icons"

import type { TimeDiffCardProps } from "../types"

function TimeDiffCard({
  messages,
  side,
  title,
  timeZoneOptions,
  input,
  timeZone,
  offsetLabel,
  error,
  onInputChange,
  onTimeZoneChange,
  onSetNow,
}: TimeDiffCardProps) {
  const prefix = `time-diff-calculator-${side}`

  return (
    <ToolPanelCard data-testid={`time-diff-card-${side}`}>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{messages.formatHint}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-time-zone`}>
            {messages.timeZoneLabel}
          </Label>
          <select
            id={`${prefix}-time-zone`}
            value={timeZone}
            aria-label={messages.timeZoneLabel}
            onChange={(event) => {
              onTimeZoneChange(event.target.value)
            }}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
          >
            {timeZoneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            {messages.offsetLabel}: {offsetLabel}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-input`}>{messages.dateTimeLabel}</Label>
          <Input
            id={`${prefix}-input`}
            value={input}
            onChange={(event) => {
              onInputChange(event.target.value)
            }}
            aria-invalid={error}
            placeholder={messages.dateTimePlaceholder}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-sm text-muted-foreground">{messages.formatHint}</p>
          <FieldError>
            {error ? messages.invalidDateTimeLabel : null}
          </FieldError>
        </div>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between gap-3 border-t">
        <ToolCopyButton
          value={input}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-testid={`set-now-${side}`}
          onClick={onSetNow}
        >
          <Clock3 data-icon="inline-start" />
          {messages.nowLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { TimeDiffCard }
