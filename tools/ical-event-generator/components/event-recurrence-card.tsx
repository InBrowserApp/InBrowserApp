import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
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

import type {
  IcalEventFormState,
  RecurrenceEndMode,
  RecurrenceFrequency,
} from "../core/form-state"
import type { IcalEventGeneratorMessages } from "../types"

const WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const

type EventRecurrenceCardProps = Readonly<{
  messages: IcalEventGeneratorMessages
  formState: IcalEventFormState
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
  messages,
  formState,
  onFieldChange,
  onWeekdaysChange,
}: EventRecurrenceCardProps) {
  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{messages.recurrence.title}</CardTitle>
        <CardDescription>{messages.recurrence.description}</CardDescription>
      </CardHeader>
      <div className="px-4">
        <FieldGroup>
          <Field>
            <FieldLabel>{messages.recurrence.frequencyLabel}</FieldLabel>
            <Select
              value={formState.recurrenceFrequency}
              onValueChange={(value) => {
                onFieldChange(
                  "recurrenceFrequency",
                  value as RecurrenceFrequency
                )
              }}
            >
              <SelectTrigger className="w-full justify-between">
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
              <Field>
                <FieldLabel>{messages.recurrence.intervalLabel}</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={String(formState.recurrenceInterval)}
                  onChange={(event) => {
                    onFieldChange(
                      "recurrenceInterval",
                      Number(event.target.value || 1)
                    )
                  }}
                />
              </Field>

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
                      className="flex w-full flex-wrap"
                    >
                      {WEEKDAY_VALUES.map((weekday, index) => (
                        <ToggleGroupItem key={weekday} value={weekday}>
                          {WEEKDAY_LABELS[index]}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FieldContent>
                </Field>
              ) : null}

              {formState.recurrenceFrequency === "monthly" ||
              formState.recurrenceFrequency === "yearly" ? (
                <Field>
                  <FieldLabel>{messages.recurrence.monthDayLabel}</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    step={1}
                    value={String(formState.recurrenceMonthDay)}
                    onChange={(event) => {
                      onFieldChange(
                        "recurrenceMonthDay",
                        Number(event.target.value || 1)
                      )
                    }}
                  />
                </Field>
              ) : null}

              {formState.recurrenceFrequency === "yearly" ? (
                <Field>
                  <FieldLabel>{messages.recurrence.monthLabel}</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    step={1}
                    value={String(formState.recurrenceMonth)}
                    onChange={(event) => {
                      onFieldChange(
                        "recurrenceMonth",
                        Number(event.target.value || 1)
                      )
                    }}
                  />
                </Field>
              ) : null}

              <Field>
                <FieldLabel>{messages.recurrence.endsLabel}</FieldLabel>
                <Select
                  value={formState.recurrenceEndMode}
                  onValueChange={(value) => {
                    onFieldChange(
                      "recurrenceEndMode",
                      value as RecurrenceEndMode
                    )
                  }}
                >
                  <SelectTrigger className="w-full justify-between">
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
                <Field>
                  <FieldLabel>{messages.recurrence.countLabel}</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={String(formState.recurrenceCount)}
                    onChange={(event) => {
                      onFieldChange(
                        "recurrenceCount",
                        Number(event.target.value || 1)
                      )
                    }}
                  />
                </Field>
              ) : null}

              {formState.recurrenceEndMode === "until" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>
                      {messages.recurrence.untilDateLabel}
                    </FieldLabel>
                    <Input
                      type="date"
                      value={formState.recurrenceUntilDate}
                      onChange={(event) => {
                        onFieldChange("recurrenceUntilDate", event.target.value)
                      }}
                    />
                  </Field>

                  {!formState.isAllDay ? (
                    <Field>
                      <FieldLabel>
                        {messages.recurrence.untilTimeLabel}
                      </FieldLabel>
                      <Input
                        type="time"
                        value={formState.recurrenceUntilTime}
                        onChange={(event) => {
                          onFieldChange(
                            "recurrenceUntilTime",
                            event.target.value
                          )
                        }}
                      />
                    </Field>
                  ) : (
                    <Field>
                      <FieldDescription className="rounded-lg border bg-muted/30 px-3 py-2.5">
                        {messages.schedule.allDayHint}
                      </FieldDescription>
                    </Field>
                  )}
                </div>
              ) : null}
            </>
          ) : null}
        </FieldGroup>
      </div>
    </>
  )
}

export { EventRecurrenceCard }
