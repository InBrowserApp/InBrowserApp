import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Button } from "@workspace/ui/components/ui/button"
import { Clock3, TriangleAlert } from "@workspace/ui/icons"

import {
  KSUID_EPOCH_SECONDS,
  KSUID_MAX_COUNT,
  MAX_KSUID_TIMESTAMP,
} from "../core/ksuid"
import type { KsuidMessages } from "../types"

type TimestampMode = "now" | "custom"

type KsuidOptionsCardProps = Readonly<{
  messages: KsuidMessages
  countId: string
  customDateTimeId: string
  customUnixSecondsId: string
  count: number
  timestampMode: TimestampMode
  customDateTimeInput: string
  customUnixSecondsInput: string
  timestampError: string
  onCountChange: (value: string) => void
  onTimestampModeChange: (value: TimestampMode) => void
  onCustomDateTimeChange: (value: string) => void
  onCustomUnixSecondsChange: (value: string) => void
  onSetNow: () => void
}>

function KsuidOptionsCard({
  messages,
  countId,
  customDateTimeId,
  customUnixSecondsId,
  count,
  timestampMode,
  customDateTimeInput,
  customUnixSecondsInput,
  timestampError,
  onCountChange,
  onTimestampModeChange,
  onCustomDateTimeChange,
  onCustomUnixSecondsChange,
  onSetNow,
}: KsuidOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <Field>
            <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
            <Input
              id={countId}
              type="number"
              inputMode="numeric"
              min={1}
              max={KSUID_MAX_COUNT}
              value={count}
              onChange={(event) => {
                onCountChange(event.target.value)
              }}
            />
          </Field>

          <Field>
            <FieldLabel>{messages.timestampModeLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              value={timestampMode}
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
          </Field>
        </div>

        {timestampMode === "custom" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={customDateTimeId}>
                  {messages.customDateTimeLabel}
                </FieldLabel>
                <Input
                  id={customDateTimeId}
                  type="datetime-local"
                  step="1"
                  value={customDateTimeInput}
                  onChange={(event) => {
                    onCustomDateTimeChange(event.target.value)
                  }}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor={customUnixSecondsId}>
                  {messages.customUnixSecondsLabel}
                </FieldLabel>
                <Input
                  id={customUnixSecondsId}
                  type="number"
                  inputMode="numeric"
                  min={KSUID_EPOCH_SECONDS}
                  max={KSUID_EPOCH_SECONDS + MAX_KSUID_TIMESTAMP}
                  step="1"
                  value={customUnixSecondsInput}
                  onChange={(event) => {
                    onCustomUnixSecondsChange(event.target.value)
                  }}
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSetNow}
              >
                <Clock3 data-icon="inline-start" />
                {messages.setNowLabel}
              </Button>
              <FieldDescription className="m-0">
                {messages.ksuidEpochLabel}
              </FieldDescription>
            </div>

            {timestampError ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertDescription>{timestampError}</AlertDescription>
              </Alert>
            ) : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { KsuidOptionsCard }
