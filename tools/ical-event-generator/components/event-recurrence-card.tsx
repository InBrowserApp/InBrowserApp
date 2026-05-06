import { useId, useMemo } from "react"

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { WEEKDAY_VALUES } from "../core/form-state"
import { RecurrenceNumberField } from "./recurrence-number-field"
import { RecurrenceUntilFields } from "./recurrence-until-fields"
import { buildWeekdayLabels } from "./weekday-labels"

import type {
  IcalEventFormState,
  RecurrenceEndMode,
  RecurrenceFrequency,
} from "../core/form-state"
import type { ValidationErrorKey } from "../core/ical-event"
import type { IcalEventGeneratorMessages } from "../types"

type EventRecurrenceCardProps = Readonly<{
  language: string
  messages: IcalEventGeneratorMessages
  formState: IcalEventFormState
  validationErrorKey: ValidationErrorKey | null
  onFieldChange: (
    key: keyof Pick<
      IcalEventFormState,
      | "recurrenceFrequency"
      | "recurrenceInterval"
      | "recurrenceMonthDay"
      | "recurrenceMonth"
      | "recurrenceEndMode"
      | "recurrenceCount"
      | "recurrenceUntilDate"
      | "recurrenceUntilTime"
    >,
    value: string | number
  ) => void
  onWeekdaysChange: (weekdays: readonly string[]) => void
}>

function EventRecurrenceCard({
  language,
  messages,
  formState,
  validationErrorKey,
  onFieldChange,
  onWeekdaysChange,
}: EventRecurrenceCardProps) {
  const frequencyId = useId()
  const endModeId = useId()
  const weekdayLabels = useMemo(() => buildWeekdayLabels(language), [language])
  const untilDateError =
    validationErrorKey === "invalid-until-date"
      ? messages.output.validation.invalidUntilDate
      : null
  const untilTimeError =
    validationErrorKey === "invalid-until-time"
      ? messages.output.validation.invalidUntilTime
      : null

  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{messages.recurrence.title}</CardTitle>
        <CardDescription>{messages.recurrence.description}</CardDescription>
      </CardHeader>
      <div className="px-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={frequencyId}>
              {messages.recurrence.frequencyLabel}
            </FieldLabel>
            <Select
              name="ical-recurrence-frequency"
              value={formState.recurrenceFrequency}
              onValueChange={(value) => {
                onFieldChange(
                  "recurrenceFrequency",
                  value as RecurrenceFrequency
                )
              }}
            >
              <SelectTrigger
                id={frequencyId}
                className="w-full justify-between"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {messages.recurrence.noneLabel}
                </SelectItem>
                <SelectItem value="daily">
                  {messages.recurrence.dailyLabel}
                </SelectItem>
                <SelectItem value="weekly">
                  {messages.recurrence.weeklyLabel}
                </SelectItem>
                <SelectItem value="monthly">
                  {messages.recurrence.monthlyLabel}
                </SelectItem>
                <SelectItem value="yearly">
                  {messages.recurrence.yearlyLabel}
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {formState.recurrenceFrequency !== "none" ? (
            <>
              <RecurrenceNumberField
                label={messages.recurrence.intervalLabel}
                name="ical-recurrence-interval"
                min={1}
                value={formState.recurrenceInterval}
                onValueChange={(value) => {
                  onFieldChange("recurrenceInterval", value)
                }}
              />

              {formState.recurrenceFrequency === "weekly" ? (
                <Field>
                  <FieldLabel>{messages.recurrence.weekdaysLabel}</FieldLabel>
                  <FieldContent>
                    <ToggleGroup
                      type="multiple"
                      variant="outline"
                      size="sm"
                      value={[...formState.recurrenceWeekdays]}
                      onValueChange={(value) => {
                        onWeekdaysChange(value.length > 0 ? value : ["MO"])
                      }}
                      aria-label={messages.recurrence.weekdaysLabel}
                      className="flex w-full flex-wrap"
                    >
                      {WEEKDAY_VALUES.map((weekday, index) => (
                        <ToggleGroupItem
                          key={weekday}
                          value={weekday}
                          className="min-w-10 flex-1"
                        >
                          {weekdayLabels[index]}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FieldContent>
                </Field>
              ) : null}

              {formState.recurrenceFrequency === "monthly" ||
              formState.recurrenceFrequency === "yearly" ? (
                <RecurrenceNumberField
                  label={messages.recurrence.monthDayLabel}
                  name="ical-recurrence-month-day"
                  min={1}
                  max={31}
                  value={formState.recurrenceMonthDay}
                  onValueChange={(value) => {
                    onFieldChange("recurrenceMonthDay", value)
                  }}
                />
              ) : null}

              {formState.recurrenceFrequency === "yearly" ? (
                <RecurrenceNumberField
                  label={messages.recurrence.monthLabel}
                  name="ical-recurrence-month"
                  min={1}
                  max={12}
                  value={formState.recurrenceMonth}
                  onValueChange={(value) => {
                    onFieldChange("recurrenceMonth", value)
                  }}
                />
              ) : null}

              <Field>
                <FieldLabel htmlFor={endModeId}>
                  {messages.recurrence.endsLabel}
                </FieldLabel>
                <Select
                  name="ical-recurrence-end-mode"
                  value={formState.recurrenceEndMode}
                  onValueChange={(value) => {
                    onFieldChange(
                      "recurrenceEndMode",
                      value as RecurrenceEndMode
                    )
                  }}
                >
                  <SelectTrigger
                    id={endModeId}
                    className="w-full justify-between"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">
                      {messages.recurrence.neverLabel}
                    </SelectItem>
                    <SelectItem value="count">
                      {messages.recurrence.afterCountLabel}
                    </SelectItem>
                    <SelectItem value="until">
                      {messages.recurrence.onDateLabel}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {formState.recurrenceEndMode === "count" ? (
                <RecurrenceNumberField
                  label={messages.recurrence.countLabel}
                  name="ical-recurrence-count"
                  min={1}
                  value={formState.recurrenceCount}
                  onValueChange={(value) => {
                    onFieldChange("recurrenceCount", value)
                  }}
                />
              ) : null}

              {formState.recurrenceEndMode === "until" ? (
                <RecurrenceUntilFields
                  messages={messages}
                  formState={formState}
                  untilDateError={untilDateError}
                  untilTimeError={untilTimeError}
                  onFieldChange={onFieldChange}
                />
              ) : null}
            </>
          ) : null}
        </FieldGroup>
      </div>
    </>
  )
}

export { EventRecurrenceCard }
