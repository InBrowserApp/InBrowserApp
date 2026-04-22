import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  FieldError,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { cn } from "@workspace/ui/lib/utils"

import type { WeekdayIndex } from "../core/business-days"
import type { BusinessDaysCalculatorMessages } from "../types"

type RulesCardProps = Readonly<{
  messages: BusinessDaysCalculatorMessages
  weekdayMode: "weekend" | "working"
  selectedDays: ReadonlyArray<WeekdayIndex>
  holidayInput: string
  holidayInvalidCount: number
  hasWorkingDays: boolean
  workingDayCount: number
  holidayCount: number
  onWeekdayModeChange: (value: "weekend" | "working") => void
  onSelectedDaysChange: (values: WeekdayIndex[]) => void
  onHolidayInputChange: (value: string) => void
}>

const weekdayLabelKeys = [
  "weekdaySunShort",
  "weekdayMonShort",
  "weekdayTueShort",
  "weekdayWedShort",
  "weekdayThuShort",
  "weekdayFriShort",
  "weekdaySatShort",
] as const

function formatTemplate(template: string, value: number) {
  return template.replace("{count}", String(value))
}

function RulesCard({
  messages,
  weekdayMode,
  selectedDays,
  holidayInput,
  holidayInvalidCount,
  hasWorkingDays,
  workingDayCount,
  holidayCount,
  onWeekdayModeChange,
  onSelectedDaysChange,
  onHolidayInputChange,
}: RulesCardProps) {
  const selectionHint =
    weekdayMode === "weekend" ? messages.weekendHint : messages.workingHint

  return (
    <ToolPanelCard data-testid="business-days-rules-card">
      <CardHeader className="grid-cols-1 gap-3 border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-1">
        <div>
          <CardTitle>{messages.rulesTitle}</CardTitle>
          <CardDescription>{selectionHint}</CardDescription>
        </div>
        <CardAction className="col-start-1 row-start-auto flex flex-wrap justify-start gap-2 justify-self-start sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:justify-end sm:justify-self-end">
          <Badge variant="outline">
            {workingDayCount}/7 {messages.workingDaysLabel}
          </Badge>
          <Badge variant="outline">
            {holidayCount} {messages.holidaysLabel}
          </Badge>
        </CardAction>
      </CardHeader>

      <ToolPanelCardContent className="gap-6">
        <FieldSet>
          <FieldTitle>{messages.selectionModeLabel}</FieldTitle>
          <ToggleGroup
            type="single"
            className="grid w-full grid-cols-2 rounded-xl bg-muted/40 p-1"
            value={weekdayMode}
            onValueChange={(value) => {
              if (value === "weekend" || value === "working") {
                onWeekdayModeChange(value)
              }
            }}
          >
            <ToggleGroupItem
              value="weekend"
              aria-label={messages.weekendDaysLabel}
              className="w-full rounded-lg border-0 bg-transparent px-3 shadow-none hover:bg-background/70 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
            >
              {messages.weekendDaysLabel}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="working"
              aria-label={messages.workingDaysLabel}
              className="w-full rounded-lg border-0 bg-transparent px-3 shadow-none hover:bg-background/70 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
            >
              {messages.workingDaysLabel}
            </ToggleGroupItem>
          </ToggleGroup>
        </FieldSet>

        <FieldSet>
          <FieldTitle>
            {weekdayMode === "weekend"
              ? messages.weekendDaysLabel
              : messages.workingDaysLabel}
          </FieldTitle>
          <div className="rounded-2xl border border-border/70 bg-border/50 p-px shadow-sm">
            <ToggleGroup
              type="multiple"
              className="grid w-full grid-cols-7 gap-px overflow-hidden rounded-[calc(var(--radius-xl)-1px)] bg-border/50"
              value={selectedDays.map(String)}
              onValueChange={(values) => {
                const nextValues = values
                  .map((value) => Number(value))
                  .filter(
                    (value) =>
                      Number.isInteger(value) && value >= 0 && value <= 6
                  )

                onSelectedDaysChange(nextValues as WeekdayIndex[])
              }}
            >
              {weekdayLabelKeys.map((key, index) => (
                <ToggleGroupItem
                  key={key}
                  value={String(index)}
                  aria-label={messages[key]}
                  className={cn(
                    "h-11 w-full rounded-none border-0 bg-background px-0 text-[0.78rem] font-medium shadow-none hover:bg-muted/70 sm:text-sm",
                    "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-none"
                  )}
                  data-testid={`weekday-toggle-${index}`}
                >
                  {messages[key]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <FieldError>
            {hasWorkingDays ? null : messages.noWorkingDaysLabel}
          </FieldError>
        </FieldSet>

        <FieldSet>
          <Label htmlFor="business-days-holidays">
            {messages.holidaysLabel}
          </Label>
          <Textarea
            id="business-days-holidays"
            value={holidayInput}
            onChange={(event) => {
              onHolidayInputChange(event.target.value)
            }}
            placeholder={messages.holidayPlaceholder}
            className="min-h-28"
            spellCheck={false}
            data-testid="holiday-input"
          />
          <p className="text-sm text-muted-foreground">
            {messages.holidayHint}
          </p>
          <p className="text-sm text-muted-foreground">
            {messages.holidayNote}
          </p>
          <FieldError>
            {holidayInvalidCount > 0
              ? formatTemplate(
                  messages.invalidHolidaysLabel,
                  holidayInvalidCount
                )
              : null}
          </FieldError>
        </FieldSet>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { RulesCard }
