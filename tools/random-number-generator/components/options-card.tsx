import type { ChangeEvent } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import type {
  NumberType,
  PresetOption,
  RandomNumberGeneratorMessages,
} from "../types"

type OptionsCardProps = Readonly<{
  messages: RandomNumberGeneratorMessages
  minId: string
  maxId: string
  countId: string
  decimalPlacesId: string
  minValue: number | null
  maxValue: number | null
  count: number | null
  allowRepeat: boolean
  numberType: NumberType
  decimalPlaces: number | null
  inputStep: number
  rangeError: string
  countError: string
  onMinValueChange: (value: string) => void
  onMaxValueChange: (value: string) => void
  onCountChange: (value: string) => void
  onAllowRepeatChange: (checked: boolean) => void
  onNumberTypeChange: (value: NumberType) => void
  onDecimalPlacesChange: (value: string) => void
  onPresetChange: (preset: PresetOption) => void
}>

function OptionsCard({
  messages,
  minId,
  maxId,
  countId,
  decimalPlacesId,
  minValue,
  maxValue,
  count,
  allowRepeat,
  numberType,
  decimalPlaces,
  inputStep,
  rangeError,
  countError,
  onMinValueChange,
  onMaxValueChange,
  onCountChange,
  onAllowRepeatChange,
  onNumberTypeChange,
  onDecimalPlacesChange,
  onPresetChange,
}: OptionsCardProps) {
  const activeError = rangeError || countError

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldSet>
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
              {messages.presetsLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onPresetChange("dice")
                }}
              >
                {messages.presetDiceLabel}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onPresetChange("ten")
                }}
              >
                {messages.presetTenLabel}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onPresetChange("hundred")
                }}
              >
                {messages.presetHundredLabel}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onPresetChange("lotto")
                }}
              >
                {messages.presetLottoLabel}
              </Button>
            </div>
          </div>

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={minId}>{messages.minLabel}</FieldLabel>
              <Input
                id={minId}
                type="number"
                inputMode="decimal"
                value={minValue ?? ""}
                step={inputStep}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onMinValueChange(event.target.value)
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={maxId}>{messages.maxLabel}</FieldLabel>
              <Input
                id={maxId}
                type="number"
                inputMode="decimal"
                value={maxValue ?? ""}
                step={inputStep}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onMaxValueChange(event.target.value)
                }}
              />
            </Field>
          </FieldGroup>

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
              <Input
                id={countId}
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                step={1}
                value={count ?? ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onCountChange(event.target.value)
                }}
              />
            </Field>

            <Field
              orientation="horizontal"
              className="justify-between rounded-lg border p-3"
            >
              <FieldLabel htmlFor={`${countId}-repeat`}>
                {messages.allowRepeatLabel}
              </FieldLabel>
              <Switch
                id={`${countId}-repeat`}
                checked={allowRepeat}
                onCheckedChange={onAllowRepeatChange}
              />
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>{messages.numberTypeLabel}</FieldLabel>
            <FieldContent>
              <ToggleGroup
                type="single"
                value={numberType}
                variant="outline"
                onValueChange={(value: string) => {
                  if (value === "integer" || value === "decimal") {
                    onNumberTypeChange(value)
                  }
                }}
              >
                <ToggleGroupItem value="integer">
                  {messages.integerLabel}
                </ToggleGroupItem>
                <ToggleGroupItem value="decimal">
                  {messages.decimalLabel}
                </ToggleGroupItem>
              </ToggleGroup>
            </FieldContent>
          </Field>

          {numberType === "decimal" ? (
            <Field>
              <FieldLabel htmlFor={decimalPlacesId}>
                {messages.decimalPlacesLabel}
              </FieldLabel>
              <Input
                id={decimalPlacesId}
                type="number"
                inputMode="numeric"
                min={0}
                max={6}
                step={1}
                value={decimalPlaces ?? ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onDecimalPlacesChange(event.target.value)
                }}
              />
            </Field>
          ) : null}
        </FieldSet>

        {activeError ? (
          <Alert variant="destructive">
            <AlertDescription>{activeError}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
