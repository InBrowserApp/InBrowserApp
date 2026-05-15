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
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { RefreshCcw } from "@workspace/ui/icons"

import { UUID_V1_MAX_CLOCK_SEQUENCE, UUID_V1_MAX_COUNT } from "../core/uuid-v1"
import type { UuidV1Messages } from "../types"

type UuidV1OptionsCardProps = Readonly<{
  messages: UuidV1Messages
  countId: string
  macAddressId: string
  clockSequenceId: string
  generationMode: "single" | "batch"
  count: number
  macAddress: string
  clockSequence: number
  macAddressError: string
  onGenerationModeChange: (value: "single" | "batch") => void
  onCountChange: (value: string) => void
  onMacAddressChange: (value: string) => void
  onMacAddressBlur: () => void
  onClockSequenceChange: (value: string) => void
  onRandomMacAddress: () => void
  onRandomClockSequence: () => void
}>

function UuidV1OptionsCard({
  messages,
  countId,
  macAddressId,
  clockSequenceId,
  generationMode,
  count,
  macAddress,
  clockSequence,
  macAddressError,
  onGenerationModeChange,
  onCountChange,
  onMacAddressChange,
  onMacAddressBlur,
  onClockSequenceChange,
  onRandomMacAddress,
  onRandomClockSequence,
}: UuidV1OptionsCardProps) {
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
            <FieldLabel>{messages.modeLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={0}
              value={generationMode}
              className="w-full"
              aria-label={messages.modeLabel}
              onValueChange={(value) => {
                if (value === "single" || value === "batch") {
                  onGenerationModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="single" className="flex-1">
                {messages.singleModeLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="batch" className="flex-1">
                {messages.batchModeLabel}
              </ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>{messages.modeDescription}</FieldDescription>
          </Field>

          {isBatchMode ? (
            <Field>
              <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
              <Input
                id={countId}
                type="number"
                inputMode="numeric"
                min={2}
                max={UUID_V1_MAX_COUNT}
                value={count}
                onChange={(event) => {
                  onCountChange(event.target.value)
                }}
              />
              <FieldDescription>{messages.countDescription}</FieldDescription>
            </Field>
          ) : null}

          <Field>
            <FieldLabel htmlFor={clockSequenceId}>
              {messages.clockSequenceLabel}
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                id={clockSequenceId}
                type="number"
                inputMode="numeric"
                min={0}
                max={UUID_V1_MAX_CLOCK_SEQUENCE}
                value={clockSequence}
                onChange={(event) => {
                  onClockSequenceChange(event.target.value)
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={messages.randomClockSequenceLabel}
                title={messages.randomClockSequenceLabel}
                onClick={onRandomClockSequence}
              >
                <RefreshCcw />
              </Button>
            </div>
            <FieldDescription>
              {messages.clockSequenceDescription}
            </FieldDescription>
          </Field>

          <Field data-invalid={Boolean(macAddressError)}>
            <FieldLabel htmlFor={macAddressId}>
              {messages.macAddressLabel}
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                id={macAddressId}
                value={macAddress}
                placeholder="02:00:00:00:00:00"
                spellCheck={false}
                aria-invalid={Boolean(macAddressError)}
                onChange={(event) => {
                  onMacAddressChange(event.target.value)
                }}
                onBlur={onMacAddressBlur}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={messages.randomMacAddressLabel}
                title={messages.randomMacAddressLabel}
                onClick={onRandomMacAddress}
              >
                <RefreshCcw />
              </Button>
            </div>
            <FieldDescription>
              {messages.macAddressDescription}
            </FieldDescription>
            <FieldError>{macAddressError}</FieldError>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { UuidV1OptionsCard }
