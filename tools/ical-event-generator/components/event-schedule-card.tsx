import { useId } from "react"

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
import { Switch } from "@workspace/ui/components/ui/switch"

import type { IcalEventGeneratorMessages } from "../types"
import type { IcalEventFormState, OutputMode } from "../core/form-state"

type EventScheduleCardProps = Readonly<{
  messages: IcalEventGeneratorMessages
  formState: IcalEventFormState
  timeZoneOptions: readonly { label: string; value: string }[]
  onFieldChange: (
    key: keyof Pick<
      IcalEventFormState,
      | "startDate"
      | "startTime"
      | "endDate"
      | "endTime"
      | "timeZone"
      | "isAllDay"
      | "outputMode"
    >,
    value: string | boolean
  ) => void
}>

function EventScheduleCard({
  messages,
  formState,
  timeZoneOptions,
  onFieldChange,
}: EventScheduleCardProps) {
  const startDateId = useId()
  const startTimeId = useId()
  const endDateId = useId()
  const endTimeId = useId()

  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{messages.schedule.title}</CardTitle>
        <CardDescription>{messages.schedule.description}</CardDescription>
      </CardHeader>
      <div className="px-4">
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="all-day-switch">
              {messages.schedule.allDayLabel}
            </FieldLabel>
            <FieldContent>
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
                <FieldDescription>
                  {messages.schedule.allDayHint}
                </FieldDescription>
                <Switch
                  id="all-day-switch"
                  checked={formState.isAllDay}
                  onCheckedChange={(checked) => {
                    onFieldChange("isAllDay", checked)
                  }}
                />
              </div>
            </FieldContent>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={startDateId}>
                {messages.schedule.startDateLabel}
              </FieldLabel>
              <Input
                id={startDateId}
                type="date"
                value={formState.startDate}
                onChange={(event) => {
                  onFieldChange("startDate", event.target.value)
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={endDateId}>
                {messages.schedule.endDateLabel}
              </FieldLabel>
              <Input
                id={endDateId}
                type="date"
                value={formState.endDate}
                onChange={(event) => {
                  onFieldChange("endDate", event.target.value)
                }}
              />
            </Field>
          </div>

          {!formState.isAllDay ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={startTimeId}>
                  {messages.schedule.startTimeLabel}
                </FieldLabel>
                <Input
                  id={startTimeId}
                  type="time"
                  value={formState.startTime}
                  onChange={(event) => {
                    onFieldChange("startTime", event.target.value)
                  }}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor={endTimeId}>
                  {messages.schedule.endTimeLabel}
                </FieldLabel>
                <Input
                  id={endTimeId}
                  type="time"
                  value={formState.endTime}
                  onChange={(event) => {
                    onFieldChange("endTime", event.target.value)
                  }}
                />
              </Field>
            </div>
          ) : null}

          <Field>
            <FieldLabel>{messages.schedule.timeZoneLabel}</FieldLabel>
            <Select
              value={formState.timeZone}
              onValueChange={(value) => {
                onFieldChange("timeZone", value)
              }}
            >
              <SelectTrigger className="w-full justify-between">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {timeZoneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>{messages.schedule.outputModeLabel}</FieldLabel>
            <Select
              value={formState.outputMode}
              onValueChange={(value) => {
                onFieldChange("outputMode", value as OutputMode)
              }}
            >
              <SelectTrigger className="w-full justify-between">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">
                  {messages.schedule.outputUtcLabel}
                </SelectItem>
                <SelectItem value="tzid">
                  {messages.schedule.outputTzidLabel}
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </div>
    </>
  )
}

export { EventScheduleCard }
