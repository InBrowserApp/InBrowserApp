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
      <CardHeader className="border-b">
        <div>
          <CardTitle>{messages.rulesTitle}</CardTitle>
          <CardDescription>{selectionHint}</CardDescription>
        </div>
        <CardAction className="flex flex-wrap justify-end gap-2">
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
            >
              {messages.weekendDaysLabel}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="working"
              aria-label={messages.workingDaysLabel}
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
          <ToggleGroup
            type="multiple"
            className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7"
            value={selectedDays.map(String)}
            onValueChange={(values) => {
              const nextValues = values
                .map((value) => Number(value))
                .filter(
                  (value) => Number.isInteger(value) && value >= 0 && value <= 6
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
                  "w-full justify-center rounded-xl border border-border/70 bg-background px-3 py-2 text-sm",
                  "data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10 data-[state=on]:text-foreground"
                )}
                data-testid={`weekday-toggle-${index}`}
              >
                {messages[key]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
