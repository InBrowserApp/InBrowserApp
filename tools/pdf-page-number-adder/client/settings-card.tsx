import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { LoaderCircle, Sparkles } from "@workspace/ui/icons"

import {
  MAX_FONT_SIZE,
  MAX_MARGIN_PT,
  MIN_FONT_SIZE,
  MIN_MARGIN_PT,
  clampInteger,
} from "../core/options"
import { NumberSliderField } from "./number-slider-field"
import { PositionField } from "./position-field"

import type { PageNumberFontFamily, PageNumberFormat } from "../core/types"
import type { PageNumberFormOptions, PdfPageNumberAdderMessages } from "./types"

const toggleItemClassName = "h-auto min-h-8 whitespace-normal text-center"

type SettingsCardProps = Readonly<{
  canGenerate: boolean
  disabled: boolean
  isGenerating: boolean
  messages: PdfPageNumberAdderMessages
  onGenerate: () => void
  onOptionsChange: (options: PageNumberFormOptions) => void
  onRangeInputChange: (value: string) => void
  options: PageNumberFormOptions
  rangeError: string
  rangeInput: string
}>

function SettingsCard({
  canGenerate,
  disabled,
  isGenerating,
  messages,
  onGenerate,
  onOptionsChange,
  onRangeInputChange,
  options,
  rangeError,
  rangeInput,
}: SettingsCardProps) {
  function updateOption<Key extends keyof PageNumberFormOptions>(
    key: Key,
    value: PageNumberFormOptions[Key]
  ) {
    onOptionsChange({ ...options, [key]: value })
  }

  function updateIntegerOption(
    key: "fontSize" | "marginX" | "marginY" | "startNumber",
    value: number
  ) {
    const nextValue =
      key === "fontSize"
        ? clampInteger(value, options.fontSize, MIN_FONT_SIZE, MAX_FONT_SIZE)
        : key === "startNumber"
          ? clampInteger(value, options.startNumber, 1, 999999)
          : clampInteger(value, options[key], MIN_MARGIN_PT, MAX_MARGIN_PT)

    updateOption(key, nextValue)
  }

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle>{messages.settingsTitle}</CardTitle>
        <CardDescription>{messages.settingsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field data-invalid={Boolean(rangeError) || undefined}>
            <FieldLabel htmlFor="pdf-page-number-range">
              {messages.pageRangeLabel}
            </FieldLabel>
            <FieldDescription>{messages.pageRangeDescription}</FieldDescription>
            <Input
              aria-invalid={Boolean(rangeError)}
              autoComplete="off"
              disabled={disabled}
              id="pdf-page-number-range"
              onChange={(event) => {
                onRangeInputChange(event.target.value)
              }}
              placeholder={messages.pageRangePlaceholder}
              value={rangeInput}
            />
            <FieldError>{rangeError}</FieldError>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="pdf-page-number-start">
                {messages.startNumberLabel}
              </FieldLabel>
              <Input
                autoComplete="off"
                disabled={disabled}
                id="pdf-page-number-start"
                inputMode="numeric"
                min={1}
                onChange={(event) => {
                  updateIntegerOption("startNumber", Number(event.target.value))
                }}
                type="number"
                value={options.startNumber}
              />
            </Field>

            <Field>
              <FieldLabel>{messages.formatLabel}</FieldLabel>
              <ToggleGroup
                aria-label={messages.formatLabel}
                className="grid w-full grid-cols-1 sm:grid-cols-2"
                disabled={disabled}
                onValueChange={(value) => {
                  if (value) {
                    updateOption("format", value as PageNumberFormat)
                  }
                }}
                type="single"
                value={options.format}
                variant="outline"
              >
                <ToggleGroupItem className={toggleItemClassName} value="number">
                  {messages.numberOnlyFormat}
                </ToggleGroupItem>
                <ToggleGroupItem
                  className={toggleItemClassName}
                  value="number-total"
                >
                  {messages.numberTotalFormat}
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
          </div>

          <PositionField
            disabled={disabled}
            messages={messages}
            onChange={(position) => {
              updateOption("position", position)
            }}
            value={options.position}
          />

          <Field>
            <FieldLabel>{messages.fontFamilyLabel}</FieldLabel>
            <ToggleGroup
              aria-label={messages.fontFamilyLabel}
              className="grid w-full grid-cols-1 sm:grid-cols-2"
              disabled={disabled}
              onValueChange={(value) => {
                if (value) {
                  updateOption("fontFamily", value as PageNumberFontFamily)
                }
              }}
              type="single"
              value={options.fontFamily}
              variant="outline"
            >
              <ToggleGroupItem className={toggleItemClassName} value="serif">
                {messages.serifFont}
              </ToggleGroupItem>
              <ToggleGroupItem
                className={toggleItemClassName}
                value="sans-serif"
              >
                {messages.sansSerifFont}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <NumberSliderField
            description={messages.fontSizeDescription}
            disabled={disabled}
            id="pdf-page-number-font-size"
            label={messages.fontSizeLabel}
            max={MAX_FONT_SIZE}
            min={MIN_FONT_SIZE}
            onChange={(value) => {
              updateIntegerOption("fontSize", value)
            }}
            suffix="pt"
            value={options.fontSize}
          />
          <NumberSliderField
            description={messages.marginDescription}
            disabled={disabled}
            id="pdf-page-number-margin-x"
            label={messages.horizontalMarginLabel}
            max={MAX_MARGIN_PT}
            min={MIN_MARGIN_PT}
            onChange={(value) => {
              updateIntegerOption("marginX", value)
            }}
            suffix="pt"
            value={options.marginX}
          />
          <NumberSliderField
            description={messages.marginDescription}
            disabled={disabled}
            id="pdf-page-number-margin-y"
            label={messages.verticalMarginLabel}
            max={MAX_MARGIN_PT}
            min={MIN_MARGIN_PT}
            onChange={(value) => {
              updateIntegerOption("marginY", value)
            }}
            suffix="pt"
            value={options.marginY}
          />
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          className="max-w-full text-center whitespace-normal"
          disabled={!canGenerate}
          onClick={onGenerate}
          type="button"
        >
          {isGenerating ? (
            <LoaderCircle
              className="motion-safe:animate-spin"
              data-icon="inline-start"
            />
          ) : (
            <Sparkles data-icon="inline-start" />
          )}
          {isGenerating ? messages.generatingLabel : messages.generateLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { SettingsCard }
