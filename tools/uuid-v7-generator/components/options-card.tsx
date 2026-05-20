import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Clock3 } from "@workspace/ui/icons"

import {
  UUID_V7_MAX_COUNT,
  UUID_V7_MAX_TIMESTAMP_MS,
  UUID_V7_MIN_BATCH_COUNT,
} from "../core/uuid-v7"
import type {
  UuidV7GenerationMode,
  UuidV7Messages,
  UuidV7TimestampMode,
} from "../types"

type UuidV7OptionsCardProps = Readonly<{
  messages: UuidV7Messages
  countId: string
  customDateTimeId: string
  customUnixMillisecondsId: string
  timestampErrorId: string
  className?: string
  mode: UuidV7GenerationMode
  count: number
  timestampMode: UuidV7TimestampMode
  customDateTimeInput: string
  customUnixMillisecondsInput: string
  timestampError: string
  onModeChange: (mode: UuidV7GenerationMode) => void
  onCountChange: (value: string) => void
  onTimestampModeChange: (mode: UuidV7TimestampMode) => void
  onCustomDateTimeChange: (value: string) => void
  onCustomUnixMillisecondsChange: (value: string) => void
  onSetNow: () => void
}>

function UuidV7OptionsCard({
  messages,
  countId,
  customDateTimeId,
  customUnixMillisecondsId,
  timestampErrorId,
  className,
  mode,
  count,
  timestampMode,
  customDateTimeInput,
  customUnixMillisecondsInput,
  timestampError,
  onModeChange,
  onCountChange,
  onTimestampModeChange,
  onCustomDateTimeChange,
  onCustomUnixMillisecondsChange,
  onSetNow,
}: UuidV7OptionsCardProps) {
  const modeLabelId = `${countId}-mode-label`
  const countDescriptionId = `${countId}-description`
  const timestampModeLabelId = `${countId}-timestamp-mode-label`

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Field>
          <FieldLabel id={modeLabelId}>{messages.modeLabel}</FieldLabel>
          <FieldContent>
            <ToggleGroup
              type="single"
              value={mode}
              spacing={0}
              variant="outline"
              size="sm"
              aria-labelledby={modeLabelId}
              className="w-full [&>[data-slot=toggle-group-item]]:flex-1"
              onValueChange={(value) => {
                if (value === "single" || value === "batch") {
                  onModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="single">
                {messages.singleModeLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="batch">
                {messages.batchModeLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldContent>
        </Field>

        {mode === "batch" ? (
          <Field>
            <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
            <Input
              id={countId}
              type="number"
              inputMode="numeric"
              name="uuid-v7-count"
              autoComplete="off"
              min={UUID_V7_MIN_BATCH_COUNT}
              max={UUID_V7_MAX_COUNT}
              value={count}
              aria-describedby={countDescriptionId}
              onChange={(event) => {
                onCountChange(event.target.value)
              }}
            />
            <FieldDescription id={countDescriptionId}>
              {messages.countDescription}
            </FieldDescription>
          </Field>
        ) : null}

        <Field>
          <FieldLabel id={timestampModeLabelId}>
            {messages.timestampModeLabel}
          </FieldLabel>
          <FieldContent>
            <ToggleGroup
              type="single"
              value={timestampMode}
              spacing={0}
              variant="outline"
              size="sm"
              aria-labelledby={timestampModeLabelId}
              className="w-full [&>[data-slot=toggle-group-item]]:flex-1"
              onValueChange={(value) => {
                if (value === "now" || value === "custom") {
                  onTimestampModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="now">
                {messages.timestampNowLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="custom">
                {messages.timestampCustomLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldContent>
          <FieldDescription>
            {messages.timestampModeDescription}
          </FieldDescription>
        </Field>

        {timestampMode === "custom" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(timestampError)}>
                <FieldLabel htmlFor={customDateTimeId}>
                  {messages.customDateTimeLabel}
                </FieldLabel>
                <Input
                  id={customDateTimeId}
                  name="uuid-v7-custom-date-time"
                  type="datetime-local"
                  step="0.001"
                  autoComplete="off"
                  value={customDateTimeInput}
                  aria-invalid={Boolean(timestampError)}
                  aria-describedby={
                    timestampError ? timestampErrorId : undefined
                  }
                  onChange={(event) => {
                    onCustomDateTimeChange(event.target.value)
                  }}
                />
              </Field>

              <Field data-invalid={Boolean(timestampError)}>
                <FieldLabel htmlFor={customUnixMillisecondsId}>
                  {messages.customUnixMillisecondsLabel}
                </FieldLabel>
                <Input
                  id={customUnixMillisecondsId}
                  name="uuid-v7-custom-unix-milliseconds"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  min={0}
                  max={UUID_V7_MAX_TIMESTAMP_MS}
                  step="1"
                  value={customUnixMillisecondsInput}
                  aria-invalid={Boolean(timestampError)}
                  aria-describedby={
                    timestampError ? timestampErrorId : undefined
                  }
                  onChange={(event) => {
                    onCustomUnixMillisecondsChange(event.target.value)
                  }}
                />
              </Field>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSetNow}
            >
              <Clock3 data-icon="inline-start" />
              {messages.setNowLabel}
            </Button>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { UuidV7OptionsCard }
