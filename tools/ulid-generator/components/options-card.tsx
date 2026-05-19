import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Clock3 } from "@workspace/ui/icons"

import {
  ULID_MAX_COUNT,
  ULID_MAX_TIMESTAMP_MS,
  ULID_MIN_BATCH_COUNT,
} from "../core/ulid"
import type { UlidMessages } from "../types"

type GenerationMode = "single" | "batch"
type TimestampMode = "now" | "custom"

type UlidOptionsCardProps = Readonly<{
  messages: UlidMessages
  generationModeId: string
  countId: string
  customDateTimeId: string
  customUnixMillisecondsId: string
  monotonicBatchId: string
  generationMode: GenerationMode
  count: number
  timestampMode: TimestampMode
  customDateTimeInput: string
  customUnixMillisecondsInput: string
  monotonicBatch: boolean
  onGenerationModeChange: (value: GenerationMode) => void
  onCountChange: (value: string) => void
  onTimestampModeChange: (value: TimestampMode) => void
  onCustomDateTimeChange: (value: string) => void
  onCustomUnixMillisecondsChange: (value: string) => void
  onMonotonicBatchChange: (checked: boolean) => void
  onSetNow: () => void
}>

function UlidOptionsCard({
  messages,
  generationModeId,
  countId,
  customDateTimeId,
  customUnixMillisecondsId,
  monotonicBatchId,
  generationMode,
  count,
  timestampMode,
  customDateTimeInput,
  customUnixMillisecondsInput,
  monotonicBatch,
  onGenerationModeChange,
  onCountChange,
  onTimestampModeChange,
  onCustomDateTimeChange,
  onCustomUnixMillisecondsChange,
  onMonotonicBatchChange,
  onSetNow,
}: UlidOptionsCardProps) {
  const isBatchMode = generationMode === "batch"

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel id={generationModeId}>
              {messages.generationModeLabel}
            </FieldLabel>
            <ToggleGroup
              type="single"
              value={generationMode}
              aria-labelledby={generationModeId}
              spacing={0}
              variant="outline"
              className="w-full"
              onValueChange={(value) => {
                if (value === "single" || value === "batch") {
                  onGenerationModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="single" className="flex-1">
                {messages.generationSingleLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="batch" className="flex-1">
                {messages.generationBatchLabel}
              </ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>
              {messages.generationModeDescription}
            </FieldDescription>
          </Field>

          {isBatchMode ? (
            <Field>
              <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
              <Input
                id={countId}
                name="ulid-count"
                type="number"
                inputMode="numeric"
                autoComplete="off"
                min={ULID_MIN_BATCH_COUNT}
                max={ULID_MAX_COUNT}
                value={count}
                onChange={(event) => {
                  onCountChange(event.target.value)
                }}
              />
              <FieldDescription>{messages.countDescription}</FieldDescription>
            </Field>
          ) : null}

          <Field>
            <FieldLabel>{messages.timestampModeLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              value={timestampMode}
              aria-label={messages.timestampModeLabel}
              spacing={0}
              variant="outline"
              className="w-full"
              onValueChange={(value) => {
                if (value === "now" || value === "custom") {
                  onTimestampModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="now" className="flex-1">
                {messages.timestampNowLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="custom" className="flex-1">
                {messages.timestampCustomLabel}
              </ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>
              {messages.timestampModeDescription}
            </FieldDescription>
          </Field>

          {timestampMode === "custom" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={customDateTimeId}>
                  {messages.customDateTimeLabel}
                </FieldLabel>
                <Input
                  id={customDateTimeId}
                  name="ulid-custom-date-time"
                  type="datetime-local"
                  step="0.001"
                  autoComplete="off"
                  value={customDateTimeInput}
                  onChange={(event) => {
                    onCustomDateTimeChange(event.target.value)
                  }}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor={customUnixMillisecondsId}>
                  {messages.customUnixMillisecondsLabel}
                </FieldLabel>
                <Input
                  id={customUnixMillisecondsId}
                  name="ulid-custom-unix-milliseconds"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  min={0}
                  max={ULID_MAX_TIMESTAMP_MS}
                  step="1"
                  value={customUnixMillisecondsInput}
                  onChange={(event) => {
                    onCustomUnixMillisecondsChange(event.target.value)
                  }}
                />
              </Field>
            </div>
          ) : null}

          {timestampMode === "custom" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSetNow}
            >
              <Clock3 data-icon="inline-start" />
              {messages.setNowLabel}
            </Button>
          ) : null}

          {isBatchMode ? (
            <Field orientation="horizontal">
              <Checkbox
                id={monotonicBatchId}
                checked={monotonicBatch}
                onCheckedChange={(checked) => {
                  onMonotonicBatchChange(checked === true)
                }}
              />
              <FieldContent>
                <FieldLabel htmlFor={monotonicBatchId}>
                  {messages.monotonicBatchLabel}
                </FieldLabel>
                <FieldDescription>
                  {messages.monotonicBatchDescription}
                </FieldDescription>
              </FieldContent>
            </Field>
          ) : null}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { UlidOptionsCard }
