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
  FieldError,
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
import type { ValidationErrorKey } from "../core/ical-event"

type EventScheduleCardProps = Readonly<{
  messages: IcalEventGeneratorMessages
  formState: IcalEventFormState
  validationErrorKey: ValidationErrorKey | null
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

function getScheduleErrorMessage(
  messages: IcalEventGeneratorMessages,
  formState: IcalEventFormState,
  field: "startDate" | "startTime" | "endDate" | "endTime",
  errorKey: ValidationErrorKey | null
) {
  switch (field) {
    case "startDate":
      return errorKey === "invalid-start-date"
        ? messages.output.validation.invalidStartDate
        : null
    case "startTime":
      return errorKey === "invalid-start-time"
        ? messages.output.validation.invalidStartTime
        : null
    case "endDate":
      if (errorKey === "invalid-end-date") {
        return messages.output.validation.invalidEndDate
      }

      return errorKey === "end-before-start" && formState.isAllDay
        ? messages.output.validation.endBeforeStart
        : null
    case "endTime":
      if (errorKey === "invalid-end-time") {
        return messages.output.validation.invalidEndTime
      }

      return errorKey === "end-before-start" && !formState.isAllDay
        ? messages.output.validation.endBeforeStart
        : null
  }
}

function EventScheduleCard({
  messages,
  formState,
  validationErrorKey,
  timeZoneOptions,
  onFieldChange,
}: EventScheduleCardProps) {
  const startDateId = useId()
  const startTimeId = useId()
  const endDateId = useId()
  const endTimeId = useId()
  const timeZoneId = useId()
  const outputModeId = useId()
  const startDateErrorId = useId()
  const startTimeErrorId = useId()
  const endDateErrorId = useId()
  const endTimeErrorId = useId()
  const startDateError = getScheduleErrorMessage(
    messages,
    formState,
    "startDate",
    validationErrorKey
  )
  const startTimeError = getScheduleErrorMessage(
    messages,
    formState,
    "startTime",
    validationErrorKey
  )
  const endDateError = getScheduleErrorMessage(
    messages,
    formState,
    "endDate",
    validationErrorKey
  )
  const endTimeError = getScheduleErrorMessage(
    messages,
    formState,
    "endTime",
    validationErrorKey
  )

  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{messages.schedule.title}</CardTitle>
        <CardDescription>{messages.schedule.description}</CardDescription>
      </CardHeader>
      <div className="px-4">
        <FieldGroup>
          <Field orientation="responsive">
            <FieldLabel htmlFor="all-day-switch">
              {messages.schedule.allDayLabel}
            </FieldLabel>
            <FieldContent>
              <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <FieldDescription>
                  {messages.schedule.allDayHint}
                </FieldDescription>
                <Switch
                  id="all-day-switch"
                  className="self-end sm:self-auto"
                  checked={formState.isAllDay}
                  onCheckedChange={(checked) => {
                    onFieldChange("isAllDay", checked)
                  }}
                />
              </div>
            </FieldContent>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field data-invalid={Boolean(startDateError)}>
              <FieldLabel htmlFor={startDateId}>
                {messages.schedule.startDateLabel}
              </FieldLabel>
              <Input
                id={startDateId}
                type="date"
                value={formState.startDate}
                aria-describedby={startDateError ? startDateErrorId : undefined}
                aria-invalid={Boolean(startDateError)}
                autoComplete="off"
                name="ical-start-date"
                onChange={(event) => {
                  onFieldChange("startDate", event.target.value)
                }}
              />
              <FieldError id={startDateErrorId}>{startDateError}</FieldError>
            </Field>

            <Field data-invalid={Boolean(endDateError)}>
              <FieldLabel htmlFor={endDateId}>
                {messages.schedule.endDateLabel}
              </FieldLabel>
              <Input
                id={endDateId}
                type="date"
                value={formState.endDate}
                aria-describedby={endDateError ? endDateErrorId : undefined}
                aria-invalid={Boolean(endDateError)}
                autoComplete="off"
                name="ical-end-date"
                onChange={(event) => {
                  onFieldChange("endDate", event.target.value)
                }}
              />
              <FieldError id={endDateErrorId}>{endDateError}</FieldError>
            </Field>
          </div>

          {!formState.isAllDay ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field data-invalid={Boolean(startTimeError)}>
                <FieldLabel htmlFor={startTimeId}>
                  {messages.schedule.startTimeLabel}
                </FieldLabel>
                <Input
                  id={startTimeId}
                  type="time"
                  value={formState.startTime}
                  aria-describedby={
                    startTimeError ? startTimeErrorId : undefined
                  }
                  aria-invalid={Boolean(startTimeError)}
                  autoComplete="off"
                  name="ical-start-time"
                  onChange={(event) => {
                    onFieldChange("startTime", event.target.value)
                  }}
                />
                <FieldError id={startTimeErrorId}>{startTimeError}</FieldError>
              </Field>

              <Field data-invalid={Boolean(endTimeError)}>
                <FieldLabel htmlFor={endTimeId}>
                  {messages.schedule.endTimeLabel}
                </FieldLabel>
                <Input
                  id={endTimeId}
                  type="time"
                  value={formState.endTime}
                  aria-describedby={endTimeError ? endTimeErrorId : undefined}
                  aria-invalid={Boolean(endTimeError)}
                  autoComplete="off"
                  name="ical-end-time"
                  onChange={(event) => {
                    onFieldChange("endTime", event.target.value)
                  }}
                />
                <FieldError id={endTimeErrorId}>{endTimeError}</FieldError>
              </Field>
            </div>
          ) : null}

          <Field>
            <FieldLabel htmlFor={timeZoneId}>
              {messages.schedule.timeZoneLabel}
            </FieldLabel>
            <Select
              name="ical-time-zone"
              value={formState.timeZone}
              onValueChange={(value) => {
                onFieldChange("timeZone", value)
              }}
            >
              <SelectTrigger id={timeZoneId} className="w-full justify-between">
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
            <FieldLabel htmlFor={outputModeId}>
              {messages.schedule.outputModeLabel}
            </FieldLabel>
            <Select
              name="ical-output-mode"
              value={formState.outputMode}
              onValueChange={(value) => {
                onFieldChange("outputMode", value as OutputMode)
              }}
            >
              <SelectTrigger
                id={outputModeId}
                className="w-full justify-between"
              >
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
