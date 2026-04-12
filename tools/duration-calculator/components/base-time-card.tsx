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

import type { BaseTimeCardProps } from "../client/types"

function BaseTimeCard({
  messages,
  timeZoneOptions,
  baseInput,
  baseTimeZone,
  baseOffsetLabel,
  baseError,
  onBaseInputChange,
  onBaseTimeZoneChange,
  onSetNow,
}: BaseTimeCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.baseTimeLabel}</CardTitle>
        <CardDescription>{messages.formatHint}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div className="grid gap-2">
          <Label htmlFor="duration-calculator-time-zone">
            {messages.timeZoneLabel}
          </Label>
          <select
            id="duration-calculator-time-zone"
            value={baseTimeZone}
            aria-label={messages.timeZoneLabel}
            onChange={(event) => {
              onBaseTimeZoneChange(event.target.value)
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
            {messages.offsetLabel}: {baseOffsetLabel}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="duration-calculator-base-input">
            {messages.dateTimeLabel}
          </Label>
          <Input
            id="duration-calculator-base-input"
            value={baseInput}
            onChange={(event) => {
              onBaseInputChange(event.target.value)
            }}
            aria-invalid={baseError}
            placeholder={messages.dateTimePlaceholder}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-sm text-muted-foreground">{messages.formatHint}</p>
          <FieldError>
            {baseError ? messages.invalidDateTimeLabel : null}
          </FieldError>
        </div>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between gap-3 border-t">
        <ToolCopyButton
          value={baseInput}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />
        <Button type="button" variant="ghost" size="sm" onClick={onSetNow}>
          {messages.nowLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { BaseTimeCard }
