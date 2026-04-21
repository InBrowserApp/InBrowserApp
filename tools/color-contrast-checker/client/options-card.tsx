import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { ArrowLeftRight } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { ColorContrastMessages } from "./types"

type OptionsCardProps = Readonly<{
  backgroundInput: string
  backgroundInvalid: boolean
  backgroundPickerValue: string
  backgroundTextId: string
  foregroundInput: string
  foregroundInvalid: boolean
  foregroundPickerValue: string
  foregroundTextId: string
  messages: ColorContrastMessages
  onBackgroundInputChange: (value: string) => void
  onBackgroundPickerChange: (value: string) => void
  onBackgroundSwatchSelect: (value: string) => void
  onForegroundInputChange: (value: string) => void
  onForegroundPickerChange: (value: string) => void
  onForegroundSwatchSelect: (value: string) => void
  onSwap: () => void
  swatches: readonly string[]
}>

type ColorFieldProps = Readonly<{
  inputId: string
  inputTestId: string
  invalid: boolean
  invalidMessage: string
  label: string
  onInputChange: (value: string) => void
  onPickerChange: (value: string) => void
  onSwatchSelect: (value: string) => void
  pickerTestId: string
  pickerValue: string
  swatches: readonly string[]
  value: string
}>

function ColorField({
  inputId,
  inputTestId,
  invalid,
  invalidMessage,
  label,
  onInputChange,
  onPickerChange,
  onSwatchSelect,
  pickerTestId,
  pickerValue,
  swatches,
  value,
}: ColorFieldProps) {
  const normalizedValue = value.trim().toUpperCase()

  return (
    <Field data-invalid={invalid || undefined} className="gap-3">
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Input
          aria-invalid={invalid || undefined}
          autoCapitalize="none"
          autoCorrect="off"
          data-testid={inputTestId}
          id={inputId}
          onChange={(event) => {
            onInputChange(event.target.value)
          }}
          spellCheck={false}
          value={value}
        />
        <input
          aria-label={`${label} picker`}
          className="h-10 w-16 cursor-pointer rounded-lg border border-input bg-transparent p-1"
          data-testid={pickerTestId}
          onChange={(event) => {
            onPickerChange(event.target.value)
          }}
          type="color"
          value={pickerValue}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {swatches.map((swatch) => {
          const active = normalizedValue === swatch
          return (
            <button
              aria-label={`${label} ${swatch}`}
              className={cn(
                "size-8 rounded-lg border transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                active
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
              )}
              key={swatch}
              onClick={() => {
                onSwatchSelect(swatch)
              }}
              style={{ backgroundColor: swatch }}
              type="button"
            />
          )
        })}
      </div>
      {invalid ? <FieldError>{invalidMessage}</FieldError> : null}
    </Field>
  )
}

export function OptionsCard({
  backgroundInput,
  backgroundInvalid,
  backgroundPickerValue,
  backgroundTextId,
  foregroundInput,
  foregroundInvalid,
  foregroundPickerValue,
  foregroundTextId,
  messages,
  onBackgroundInputChange,
  onBackgroundPickerChange,
  onBackgroundSwatchSelect,
  onForegroundInputChange,
  onForegroundPickerChange,
  onForegroundSwatchSelect,
  onSwap,
  swatches,
}: OptionsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        <FieldGroup>
          <ColorField
            inputId={foregroundTextId}
            inputTestId="foreground-input"
            invalid={foregroundInvalid}
            invalidMessage={messages.invalidColorMessage}
            label={messages.foregroundLabel}
            onInputChange={onForegroundInputChange}
            onPickerChange={onForegroundPickerChange}
            onSwatchSelect={onForegroundSwatchSelect}
            pickerTestId="foreground-picker"
            pickerValue={foregroundPickerValue}
            swatches={swatches}
            value={foregroundInput}
          />

          <ColorField
            inputId={backgroundTextId}
            inputTestId="background-input"
            invalid={backgroundInvalid}
            invalidMessage={messages.invalidColorMessage}
            label={messages.backgroundLabel}
            onInputChange={onBackgroundInputChange}
            onPickerChange={onBackgroundPickerChange}
            onSwatchSelect={onBackgroundSwatchSelect}
            pickerTestId="background-picker"
            pickerValue={backgroundPickerValue}
            swatches={swatches}
            value={backgroundInput}
          />
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end border-t">
        <Button onClick={onSwap} size="sm" type="button" variant="ghost">
          <ArrowLeftRight data-icon="inline-start" />
          {messages.swapLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}
