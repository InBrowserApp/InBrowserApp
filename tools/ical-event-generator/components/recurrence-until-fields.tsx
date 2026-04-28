import { useId } from "react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import type { IcalEventFormState } from "../core/form-state"
import type { IcalEventGeneratorMessages } from "../types"

type RecurrenceUntilFieldsProps = Readonly<{
  messages: IcalEventGeneratorMessages
  formState: IcalEventFormState
  untilDateError: string | null
  untilTimeError: string | null
  onFieldChange: (
    key: "recurrenceUntilDate" | "recurrenceUntilTime",
    value: string
  ) => void
}>

function RecurrenceUntilFields({
  messages,
  formState,
  untilDateError,
  untilTimeError,
  onFieldChange,
}: RecurrenceUntilFieldsProps) {
  const untilDateId = useId()
  const untilTimeId = useId()
  const untilDateErrorId = useId()
  const untilTimeErrorId = useId()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field data-invalid={Boolean(untilDateError)}>
        <FieldLabel htmlFor={untilDateId}>
          {messages.recurrence.untilDateLabel}
        </FieldLabel>
        <Input
          id={untilDateId}
          type="date"
          value={formState.recurrenceUntilDate}
          aria-describedby={untilDateError ? untilDateErrorId : undefined}
          aria-invalid={Boolean(untilDateError)}
          autoComplete="off"
          name="ical-recurrence-until-date"
          onChange={(event) => {
            onFieldChange("recurrenceUntilDate", event.target.value)
          }}
        />
        <FieldError id={untilDateErrorId}>{untilDateError}</FieldError>
      </Field>

      {!formState.isAllDay ? (
        <Field data-invalid={Boolean(untilTimeError)}>
          <FieldLabel htmlFor={untilTimeId}>
            {messages.recurrence.untilTimeLabel}
          </FieldLabel>
          <Input
            id={untilTimeId}
            type="time"
            value={formState.recurrenceUntilTime}
            aria-describedby={untilTimeError ? untilTimeErrorId : undefined}
            aria-invalid={Boolean(untilTimeError)}
            autoComplete="off"
            name="ical-recurrence-until-time"
            onChange={(event) => {
              onFieldChange("recurrenceUntilTime", event.target.value)
            }}
          />
          <FieldError id={untilTimeErrorId}>{untilTimeError}</FieldError>
        </Field>
      ) : (
        <Field>
          <FieldDescription className="rounded-lg border bg-muted/30 px-3 py-2.5">
            {messages.schedule.allDayHint}
          </FieldDescription>
        </Field>
      )}
    </div>
  )
}

export { RecurrenceUntilFields }
