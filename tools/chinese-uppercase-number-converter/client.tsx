import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { RefreshCcw } from "@workspace/ui/icons"

import {
  convertNumberToUppercase,
  convertUppercaseToNumber,
  type UppercaseVariant,
} from "./core/conversion"
import type englishMessages from "./messages/en.json"

export type ChineseUppercaseNumberConverterMessages = typeof englishMessages

type ChineseUppercaseNumberConverterClientProps = Readonly<{
  lang: string
  messages: ChineseUppercaseNumberConverterMessages
}>

type ConversionInput = { field: "number" | "uppercase"; value: string }

const STORAGE_KEYS = {
  variant: "tools:chinese-uppercase-number-converter:variant",
  number: "tools:chinese-uppercase-number-converter:number",
} as const

const DEFAULT_INPUT = { field: "number", value: "1234.56" } as const

function ChineseUppercaseNumberConverterClient({
  lang,
  messages,
}: ChineseUppercaseNumberConverterClientProps) {
  const numberInputId = useId()
  const uppercaseInputId = useId()
  const defaultVariant = lang === "zh-TW" ? "traditional" : "simplified"

  const [variant, setVariant] = useState<UppercaseVariant>(defaultVariant)
  const [input, setInput] = useState<ConversionInput>(DEFAULT_INPUT)
  const isNumberInput = input.field === "number"
  const result = isNumberInput
    ? convertNumberToUppercase(input.value, variant)
    : convertUppercaseToNumber(input.value)
  const numberValue = isNumberInput ? input.value : result.value
  const uppercaseValue = isNumberInput ? result.value : input.value
  const errorMessages = {
    invalidFormat: isNumberInput
      ? messages.numberInvalidFormat
      : messages.uppercaseInvalidFormat,
    outOfRange: isNumberInput
      ? messages.numberOutOfRange
      : messages.uppercaseOutOfRange,
    tooManyDecimals: messages.numberTooManyDecimals,
    invalidCharacters: messages.uppercaseInvalidCharacters,
  }
  const error = result.error && errorMessages[result.error]
  const numberError = isNumberInput ? error : null
  const uppercaseError = isNumberInput ? null : error
  const numberErrorId = `${numberInputId}-error`
  const uppercaseErrorId = `${uppercaseInputId}-error`

  useEffect(() => {
    const storedVariant = window.localStorage.getItem(STORAGE_KEYS.variant)
    const storedNumber = window.localStorage.getItem(STORAGE_KEYS.number)

    setVariant(
      isUppercaseVariant(storedVariant) ? storedVariant : defaultVariant
    )
    setInput({ field: "number", value: storedNumber ?? DEFAULT_INPUT.value })
  }, [defaultVariant])

  function handleInputChange(field: ConversionInput["field"], value: string) {
    setInput({ field, value })
    const number =
      field === "number" ? value : convertUppercaseToNumber(value).value
    window.localStorage.setItem(STORAGE_KEYS.number, number)
  }

  function handleVariantChange(nextVariant: string) {
    if (!isUppercaseVariant(nextVariant)) return

    setVariant(nextVariant)
    window.localStorage.setItem(STORAGE_KEYS.variant, nextVariant)

    if (!isNumberInput && result.isValid) {
      setInput({ field: "number", value: numberValue })
    }
  }

  function handleReset() {
    window.localStorage.removeItem(STORAGE_KEYS.variant)
    window.localStorage.removeItem(STORAGE_KEYS.number)
    setVariant(defaultVariant)
    setInput(DEFAULT_INPUT)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanelCard size="sm">
        <ToolPanelCardContent>
          <Field data-invalid={numberError ? true : undefined}>
            <FieldLabel htmlFor={numberInputId}>
              {messages.numberLabel}
            </FieldLabel>
            <Input
              id={numberInputId}
              value={numberValue}
              inputMode="decimal"
              placeholder={messages.numberPlaceholder}
              aria-invalid={numberError ? true : undefined}
              aria-describedby={numberError ? numberErrorId : undefined}
              spellCheck={false}
              onChange={(event) => {
                handleInputChange("number", event.target.value)
              }}
            />
            <FieldError id={numberErrorId}>{numberError}</FieldError>
          </Field>
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="flex-wrap justify-between gap-2 py-2">
          <ToolCopyButton
            value={isNumberInput ? result.normalized : numberValue}
            copyLabel={messages.copyNumberLabel}
            copiedLabel={messages.copiedLabel}
            disabled={!result.isValid}
            variant="ghost"
          />
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.resetLabel}
          </Button>
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <ToolPanelCard size="sm">
        <ToolPanelCardContent>
          <Field data-invalid={uppercaseError ? true : undefined}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <FieldLabel htmlFor={uppercaseInputId}>
                {messages.uppercaseLabel}
              </FieldLabel>
              <ToggleGroup
                type="single"
                aria-label={messages.styleTitle}
                value={variant}
                onValueChange={handleVariantChange}
                variant="outline"
                size="sm"
                className="max-w-full flex-wrap"
              >
                <ToggleGroupItem value="simplified">
                  {messages.simplifiedLabel}
                </ToggleGroupItem>
                <ToggleGroupItem value="traditional">
                  {messages.traditionalLabel}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Textarea
              id={uppercaseInputId}
              value={uppercaseValue}
              aria-invalid={uppercaseError ? true : undefined}
              aria-describedby={uppercaseError ? uppercaseErrorId : undefined}
              placeholder={messages.uppercasePlaceholder}
              spellCheck={false}
              className="resize-y font-mono"
              onChange={(event) => {
                handleInputChange("uppercase", event.target.value)
              }}
            />
            <FieldError id={uppercaseErrorId}>{uppercaseError}</FieldError>
          </Field>
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="justify-end py-2">
          <ToolCopyButton
            value={uppercaseValue}
            copyLabel={messages.copyUppercaseLabel}
            copiedLabel={messages.copiedLabel}
            disabled={!result.isValid}
            variant="ghost"
          />
        </ToolPanelCardFooter>
      </ToolPanelCard>
    </div>
  )
}

function isUppercaseVariant(value: string | null): value is UppercaseVariant {
  return value === "simplified" || value === "traditional"
}

export default ChineseUppercaseNumberConverterClient
