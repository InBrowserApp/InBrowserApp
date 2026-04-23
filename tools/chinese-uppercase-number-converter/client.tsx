import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
  FieldDescription,
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
  parseNumberInput,
  parseUppercaseInput,
  type NumberParseResult,
  type UppercaseParseResult,
  type UppercaseVariant,
} from "./core/conversion"

type ChineseUppercaseNumberConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  styleTitle: string
  simplifiedLabel: string
  traditionalLabel: string
  numberLabel: string
  numberPlaceholder: string
  numberValid: string
  numberInvalidFormat: string
  numberTooManyDecimals: string
  numberOutOfRange: string
  uppercaseLabel: string
  uppercasePlaceholder: string
  uppercaseValid: string
  uppercaseInvalidCharacters: string
  uppercaseInvalidFormat: string
  uppercaseOutOfRange: string
  copyNumberLabel: string
  copyUppercaseLabel: string
  copiedLabel: string
  resetLabel: string
}>

type ChineseUppercaseNumberConverterClientProps = Readonly<{
  messages: ChineseUppercaseNumberConverterMessages
}>

const STORAGE_KEYS = {
  variant: "tools:chinese-uppercase-number-converter:variant",
  number: "tools:chinese-uppercase-number-converter:number",
} as const

const DEFAULT_VARIANT: UppercaseVariant = "simplified"
const DEFAULT_NUMBER = "1234.56"

function ChineseUppercaseNumberConverterClient({
  messages,
}: ChineseUppercaseNumberConverterClientProps) {
  const numberInputId = useId()
  const uppercaseInputId = useId()

  const [variant, setVariant] = useState<UppercaseVariant>(DEFAULT_VARIANT)
  const [numberInput, setNumberInput] = useState(DEFAULT_NUMBER)
  const [uppercaseInput, setUppercaseInput] = useState(
    () => convertNumberToUppercase(DEFAULT_NUMBER, DEFAULT_VARIANT).value
  )

  const numberState = parseNumberInput(numberInput)
  const uppercaseState = parseUppercaseInput(uppercaseInput)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedVariant = window.localStorage.getItem(STORAGE_KEYS.variant)
    const storedNumber = window.localStorage.getItem(STORAGE_KEYS.number)
    const nextVariant = isUppercaseVariant(storedVariant)
      ? storedVariant
      : DEFAULT_VARIANT
    const nextNumber = storedNumber ?? DEFAULT_NUMBER
    const nextUppercase = convertNumberToUppercase(nextNumber, nextVariant)

    setVariant(nextVariant)
    setNumberInput(nextNumber)
    setUppercaseInput(nextUppercase.isValid ? nextUppercase.value : "")
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.variant, variant)
  }, [variant])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.number, numberInput)
  }, [numberInput])

  function handleNumberChange(nextValue: string) {
    const result = convertNumberToUppercase(nextValue, variant)

    setNumberInput(result.isValid ? result.normalized : nextValue)
    setUppercaseInput(result.isValid ? result.value : "")
  }

  function handleUppercaseChange(nextValue: string) {
    const result = convertUppercaseToNumber(nextValue)

    setUppercaseInput(result.isValid ? result.normalized : nextValue)
    setNumberInput(result.isValid ? result.value : "")
  }

  function handleVariantChange(nextValue: string) {
    if (!isUppercaseVariant(nextValue)) {
      return
    }

    setVariant(nextValue)

    const result = convertNumberToUppercase(numberInput, nextValue)
    setUppercaseInput(result.isValid ? result.value : "")
  }

  function handleReset() {
    setVariant(DEFAULT_VARIANT)
    setNumberInput(DEFAULT_NUMBER)
    setUppercaseInput(
      convertNumberToUppercase(DEFAULT_NUMBER, DEFAULT_VARIANT).value
    )
  }

  return (
    <div className="grid gap-6">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.styleTitle}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent>
          <ToggleGroup
            type="single"
            value={variant}
            onValueChange={handleVariantChange}
            variant="outline"
            className="flex w-full flex-wrap"
          >
            <ToggleGroupItem value="simplified">
              {messages.simplifiedLabel}
            </ToggleGroupItem>
            <ToggleGroupItem value="traditional">
              {messages.traditionalLabel}
            </ToggleGroupItem>
          </ToggleGroup>
        </ToolPanelCardContent>
      </ToolPanelCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ToolPanelCard className="w-full">
          <CardHeader className="border-b">
            <CardTitle>{messages.numberLabel}</CardTitle>
            <CardDescription>{messages.numberPlaceholder}</CardDescription>
          </CardHeader>
          <ToolPanelCardContent className="gap-4">
            <Field
              data-invalid={getNumberError(numberState) ? true : undefined}
            >
              <FieldLabel htmlFor={numberInputId}>
                {messages.numberLabel}
              </FieldLabel>
              <Input
                id={numberInputId}
                value={numberInput}
                inputMode="decimal"
                placeholder={messages.numberPlaceholder}
                aria-invalid={getNumberError(numberState) ? true : undefined}
                spellCheck={false}
                onChange={(event) => {
                  handleNumberChange(event.target.value)
                }}
              />
              {numberState.isValid ? (
                <FieldDescription>{messages.numberValid}</FieldDescription>
              ) : null}
              <FieldError>{getNumberError(numberState, messages)}</FieldError>
            </Field>
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="justify-between gap-3 border-t">
            <ToolCopyButton
              value={numberInput}
              copyLabel={messages.copyNumberLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.resetLabel}
            </Button>
          </ToolPanelCardFooter>
        </ToolPanelCard>

        <ToolPanelCard className="w-full">
          <CardHeader className="border-b">
            <CardTitle>{messages.uppercaseLabel}</CardTitle>
            <CardDescription>{messages.uppercasePlaceholder}</CardDescription>
          </CardHeader>
          <ToolPanelCardContent className="gap-4">
            <Field
              className="flex flex-1 flex-col"
              data-invalid={
                getUppercaseError(uppercaseState) ? true : undefined
              }
            >
              <FieldLabel htmlFor={uppercaseInputId}>
                {messages.uppercaseLabel}
              </FieldLabel>
              <Textarea
                id={uppercaseInputId}
                value={uppercaseInput}
                aria-label={messages.uppercaseLabel}
                aria-invalid={
                  getUppercaseError(uppercaseState) ? true : undefined
                }
                placeholder={messages.uppercasePlaceholder}
                spellCheck={false}
                className="min-h-48 resize-y font-mono text-sm"
                onChange={(event) => {
                  handleUppercaseChange(event.target.value)
                }}
              />
              {uppercaseState.isValid ? (
                <FieldDescription>{messages.uppercaseValid}</FieldDescription>
              ) : null}
              <FieldError>
                {getUppercaseError(uppercaseState, messages)}
              </FieldError>
            </Field>
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="justify-end border-t">
            <ToolCopyButton
              value={uppercaseInput}
              copyLabel={messages.copyUppercaseLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </ToolPanelCardFooter>
        </ToolPanelCard>
      </div>
    </div>
  )
}

function getNumberError(
  state: NumberParseResult,
  messages?: ChineseUppercaseNumberConverterMessages
) {
  if (state.isEmpty || state.isValid || !messages) {
    return null
  }

  switch (state.error) {
    case "invalidFormat":
      return messages.numberInvalidFormat
    case "tooManyDecimals":
      return messages.numberTooManyDecimals
    case "outOfRange":
      return messages.numberOutOfRange
    default:
      return null
  }
}

function getUppercaseError(
  state: UppercaseParseResult,
  messages?: ChineseUppercaseNumberConverterMessages
) {
  if (state.isEmpty || state.isValid || !messages) {
    return null
  }

  switch (state.error) {
    case "invalidCharacters":
      return messages.uppercaseInvalidCharacters
    case "invalidFormat":
      return messages.uppercaseInvalidFormat
    case "outOfRange":
      return messages.uppercaseOutOfRange
    default:
      return null
  }
}

function isUppercaseVariant(value: string | null): value is UppercaseVariant {
  return value === "simplified" || value === "traditional"
}

export default ChineseUppercaseNumberConverterClient
