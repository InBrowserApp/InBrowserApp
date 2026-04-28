import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Switch } from "@workspace/ui/components/ui/switch"
import { cn } from "@workspace/ui/lib/utils"

import type { BusinessDayCountResult } from "../core/business-days"
import type { BusinessDaysCalculatorMessages } from "../types"

type RangeCardProps = Readonly<{
  messages: BusinessDaysCalculatorMessages
  startDate: string
  endDate: string
  includeEndpoints: boolean
  result: BusinessDayCountResult | null
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onIncludeEndpointsChange: (value: boolean) => void
}>

type ResultStatProps = Readonly<{
  label: string
  value: string
  copyLabel: string
  copiedLabel: string
  tone?: "default" | "muted"
  testId: string
}>

const toneClasses = {
  default: "border-primary/20 bg-primary/5",
  muted: "border-border/70 bg-muted/30",
} as const

function ResultStat({
  label,
  value,
  copyLabel,
  copiedLabel,
  tone = "muted",
  testId,
}: ResultStatProps) {
  return (
    <div className={cn("rounded-xl border p-4", toneClasses[tone])}>
      <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p
          className="text-3xl font-semibold tracking-tight text-foreground"
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
  )
}

function RangeCard({
  messages,
  startDate,
  endDate,
  includeEndpoints,
  result,
  onStartDateChange,
  onEndDateChange,
  onIncludeEndpointsChange,
}: RangeCardProps) {
  const businessDays = result ? String(result.businessDays) : ""
  const totalDays = result ? String(result.totalDays) : ""
  const weekendDays = result ? String(result.weekendDays) : ""
  const holidayDays = result ? String(result.holidayDays) : ""

  return (
    <ToolPanelCard data-testid="business-days-count-card">
      <CardHeader className="border-b">
        <CardTitle>{messages.countTitle}</CardTitle>
        {result?.isReversed ? (
          <CardDescription className="text-amber-700 dark:text-amber-300">
            {messages.rangeSwappedLabel}
          </CardDescription>
        ) : null}
      </CardHeader>

      <ToolPanelCardContent className="gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="business-days-start">
              {messages.startDateLabel}
            </Label>
            <Input
              id="business-days-start"
              type="date"
              value={startDate}
              onChange={(event) => {
                onStartDateChange(event.target.value)
              }}
              data-testid="start-date-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="business-days-end">{messages.endDateLabel}</Label>
            <Input
              id="business-days-end"
              type="date"
              value={endDate}
              onChange={(event) => {
                onEndDateChange(event.target.value)
              }}
              data-testid="end-date-input"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium">
          <Switch
            checked={includeEndpoints}
            onCheckedChange={onIncludeEndpointsChange}
            aria-label={messages.includeEndpointsLabel}
          />
          <span>{messages.includeEndpointsLabel}</span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <ResultStat
            label={messages.businessDaysLabel}
            value={businessDays}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            tone="default"
            testId="business-days-result"
          />
          <ResultStat
            label={messages.totalDaysLabel}
            value={totalDays}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            testId="total-days-result"
          />
          <ResultStat
            label={messages.weekendDaysCountLabel}
            value={weekendDays}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            testId="weekend-days-result"
          />
          <ResultStat
            label={messages.holidayDaysCountLabel}
            value={holidayDays}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            testId="holiday-days-result"
          />
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { RangeCard }
