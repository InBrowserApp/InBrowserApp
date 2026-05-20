import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Clock3, TriangleAlert } from "@workspace/ui/icons"

import { UUID_CLOCK_SEQUENCE_MAX, UUID_V6_MAX_COUNT } from "../core/uuid-v6"
import { ModeToggleGroup } from "./mode-toggle-group"
import type { UuidV6Messages } from "../types"
import type { ModeToggleOption } from "./mode-toggle-group"

type TimestampMode = "now" | "custom"
type RandomOrCustomMode = "random" | "custom"

type UuidV6OptionsCardProps = Readonly<{
  messages: UuidV6Messages
  countId: string
  customDateTimeId: string
  customUnixMillisecondsId: string
  customNodeId: string
  customClockSequenceId: string
  count: number
  timestampMode: TimestampMode
  customDateTimeInput: string
  customUnixMillisecondsInput: string
  nodeMode: RandomOrCustomMode
  customNodeInput: string
  clockSequenceMode: RandomOrCustomMode
  customClockSequenceInput: string
  timestampError: string
  nodeError: string
  clockSequenceError: string
  onCountChange: (value: string) => void
  onTimestampModeChange: (value: TimestampMode) => void
  onCustomDateTimeChange: (value: string) => void
  onCustomUnixMillisecondsChange: (value: string) => void
  onSetNow: () => void
  onNodeModeChange: (value: RandomOrCustomMode) => void
  onCustomNodeChange: (value: string) => void
  onClockSequenceModeChange: (value: RandomOrCustomMode) => void
  onCustomClockSequenceChange: (value: string) => void
}>

function UuidV6OptionsCard({
  messages,
  countId,
  customDateTimeId,
  customUnixMillisecondsId,
  customNodeId,
  customClockSequenceId,
  count,
  timestampMode,
  customDateTimeInput,
  customUnixMillisecondsInput,
  nodeMode,
  customNodeInput,
  clockSequenceMode,
  customClockSequenceInput,
  timestampError,
  nodeError,
  clockSequenceError,
  onCountChange,
  onTimestampModeChange,
  onCustomDateTimeChange,
  onCustomUnixMillisecondsChange,
  onSetNow,
  onNodeModeChange,
  onCustomNodeChange,
  onClockSequenceModeChange,
  onCustomClockSequenceChange,
}: UuidV6OptionsCardProps) {
  const hasError = Boolean(timestampError || nodeError || clockSequenceError)
  const timestampOptions = [
    { value: "now", label: messages.timestampNowLabel },
    { value: "custom", label: messages.timestampCustomLabel },
  ] satisfies readonly ModeToggleOption<TimestampMode>[]
  const randomOrCustomNodeOptions = [
    { value: "random", label: messages.nodeRandomLabel },
    { value: "custom", label: messages.nodeCustomLabel },
  ] satisfies readonly ModeToggleOption<RandomOrCustomMode>[]
  const randomOrCustomClockOptions = [
    { value: "random", label: messages.clockSequenceRandomLabel },
    { value: "custom", label: messages.clockSequenceCustomLabel },
  ] satisfies readonly ModeToggleOption<RandomOrCustomMode>[]

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
            <Field>
              <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
              <Input
                id={countId}
                type="number"
                inputMode="numeric"
                name="uuid-v6-count"
                autoComplete="off"
                min={1}
                max={UUID_V6_MAX_COUNT}
                value={count}
                onChange={(event) => {
                  onCountChange(event.target.value)
                }}
              />
            </Field>

            <Field>
              <FieldLabel>{messages.timestampModeLabel}</FieldLabel>
              <ModeToggleGroup
                aria-label={messages.timestampModeLabel}
                value={timestampMode}
                options={timestampOptions}
                onValueChange={onTimestampModeChange}
              />
            </Field>
          </div>

          {timestampMode === "custom" ? (
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(timestampError)}>
                  <FieldLabel htmlFor={customDateTimeId}>
                    {messages.customDateTimeLabel}
                  </FieldLabel>
                  <Input
                    id={customDateTimeId}
                    type="datetime-local"
                    step="1"
                    name="uuid-v6-custom-date-time"
                    autoComplete="off"
                    value={customDateTimeInput}
                    aria-invalid={Boolean(timestampError)}
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
                    type="number"
                    inputMode="numeric"
                    step="1"
                    name="uuid-v6-custom-unix-milliseconds"
                    autoComplete="off"
                    value={customUnixMillisecondsInput}
                    aria-invalid={Boolean(timestampError)}
                    onChange={(event) => {
                      onCustomUnixMillisecondsChange(event.target.value)
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
                <FieldError>{timestampError}</FieldError>
              </div>
            </FieldGroup>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Field data-invalid={Boolean(nodeError)}>
              <FieldLabel>{messages.nodeModeLabel}</FieldLabel>
              <ModeToggleGroup
                aria-label={messages.nodeModeLabel}
                value={nodeMode}
                options={randomOrCustomNodeOptions}
                onValueChange={onNodeModeChange}
              />
              {nodeMode === "custom" ? (
                <>
                  <FieldLabel htmlFor={customNodeId}>
                    {messages.customNodeLabel}
                  </FieldLabel>
                  <Input
                    id={customNodeId}
                    name="uuid-v6-custom-node"
                    autoComplete="off"
                    spellCheck={false}
                    value={customNodeInput}
                    aria-invalid={Boolean(nodeError)}
                    placeholder="02:00:00:00:00:01"
                    onChange={(event) => {
                      onCustomNodeChange(event.target.value)
                    }}
                  />
                  <FieldDescription>
                    {messages.customNodeDescription}
                  </FieldDescription>
                  <FieldError>{nodeError}</FieldError>
                </>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(clockSequenceError)}>
              <FieldLabel>{messages.clockSequenceModeLabel}</FieldLabel>
              <ModeToggleGroup
                aria-label={messages.clockSequenceModeLabel}
                value={clockSequenceMode}
                options={randomOrCustomClockOptions}
                onValueChange={onClockSequenceModeChange}
              />
              {clockSequenceMode === "custom" ? (
                <>
                  <FieldLabel htmlFor={customClockSequenceId}>
                    {messages.customClockSequenceLabel}
                  </FieldLabel>
                  <Input
                    id={customClockSequenceId}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={UUID_CLOCK_SEQUENCE_MAX}
                    step="1"
                    name="uuid-v6-custom-clock-sequence"
                    autoComplete="off"
                    value={customClockSequenceInput}
                    aria-invalid={Boolean(clockSequenceError)}
                    onChange={(event) => {
                      onCustomClockSequenceChange(event.target.value)
                    }}
                  />
                  <FieldDescription>
                    {messages.customClockSequenceDescription}
                  </FieldDescription>
                  <FieldError>{clockSequenceError}</FieldError>
                </>
              ) : null}
            </Field>
          </div>

          {hasError ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>
                {timestampError || nodeError || clockSequenceError}
              </AlertDescription>
            </Alert>
          ) : null}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { UuidV6OptionsCard }
