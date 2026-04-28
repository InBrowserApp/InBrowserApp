import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Switch } from "@workspace/ui/components/ui/switch"
import { cn } from "@workspace/ui/lib/utils"

import type { BusinessDaysCalculatorMessages } from "../types"

type OffsetCardProps = Readonly<{
  messages: BusinessDaysCalculatorMessages
  baseDate: string
  dayOffset: string
  includeStart: boolean
  hasWorkingDays: boolean
  addDate: string
  subtractDate: string
  onBaseDateChange: (value: string) => void
  onDayOffsetChange: (value: string) => void
  onIncludeStartChange: (value: boolean) => void
}>

type ResultDateCardProps = Readonly<{
  title: string
  label: string
  value: string
  copyLabel: string
  copiedLabel: string
  tone: "default" | "muted"
  testId: string
}>

const toneClasses = {
  default: "border-primary/20 bg-primary/5",
  muted: "border-border/70 bg-muted/30",
} as const

function ResultDateCard({
  title,
  label,
  value,
  copyLabel,
  copiedLabel,
  tone,
  testId,
}: ResultDateCardProps) {
  return (
    <div className={cn("rounded-xl border p-4", toneClasses[tone])}>
      <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {title}
      </p>
      <div className="mt-3 grid gap-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="flex items-center justify-between gap-3">
          <p
            className="text-xl font-semibold tracking-tight text-foreground"
            data-testid={testId}
          >
            {value || "—"}
          </p>
          <ToolCopyButton
            value={value}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            variant="ghost"
            disabled={value.length === 0}
          />
        </div>
      </div>
    </div>
  )
}

function OffsetCard({
  messages,
  baseDate,
  dayOffset,
  includeStart,
  hasWorkingDays,
  addDate,
  subtractDate,
  onBaseDateChange,
  onDayOffsetChange,
  onIncludeStartChange,
}: OffsetCardProps) {
  return (
    <ToolPanelCard data-testid="business-days-offset-card">
      <CardHeader className="border-b">
        <CardTitle>{messages.offsetTitle}</CardTitle>
      </CardHeader>

      <ToolPanelCardContent className="gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="business-days-base">{messages.baseDateLabel}</Label>
            <Input
              id="business-days-base"
              type="date"
              value={baseDate}
              onChange={(event) => {
                onBaseDateChange(event.target.value)
              }}
              data-testid="base-date-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="business-days-offset">
              {messages.businessDaysOffsetLabel}
            </Label>
            <Input
              id="business-days-offset"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={dayOffset}
              onChange={(event) => {
                onDayOffsetChange(event.target.value)
              }}
              data-testid="business-days-offset-input"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium">
          <Switch
            checked={includeStart}
            onCheckedChange={onIncludeStartChange}
            aria-label={messages.includeStartLabel}
          />
          <span>{messages.includeStartLabel}</span>
        </label>

        {!hasWorkingDays ? (
          <p className="text-sm text-destructive">
            {messages.noWorkingDaysLabel}
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <ResultDateCard
            title={messages.addLabel}
            label={messages.resultDateLabel}
            value={addDate}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            tone="default"
            testId="add-date-result"
          />
          <ResultDateCard
            title={messages.subtractLabel}
            label={messages.resultDateLabel}
            value={subtractDate}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            tone="muted"
            testId="subtract-date-result"
          />
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { OffsetCard }
