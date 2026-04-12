import { useId } from "react"

import { Checkbox } from "@workspace/ui/components/ui/checkbox"
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
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import type {
  PrettierCodeFormatterMessages,
  PrettierFormatOptionsSetter,
} from "../client/types"
import {
  PRETTIER_LANGUAGE_KEYS,
  PRETTIER_TRAILING_COMMA_VALUES,
  clampPrettierPrintWidth,
  clampPrettierTabWidth,
  getPrettierLanguageConfig,
  type PrettierFormatOptions,
} from "../core/prettier-languages"

type OptionsCardProps = Readonly<{
  messages: PrettierCodeFormatterMessages
  options: PrettierFormatOptions
  setOptions: PrettierFormatOptionsSetter
}>

function OptionsCard({ messages, options, setOptions }: OptionsCardProps) {
  const idPrefix = useId()
  const selectedLanguage = getPrettierLanguageConfig(options.language)

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsLabel}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <div className="grid gap-4 lg:grid-cols-3">
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-language`}>
                {messages.languageLabel}
              </FieldLabel>
              <Select
                value={options.language}
                onValueChange={(value) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    language: value as PrettierFormatOptions["language"],
                  }))
                }}
              >
                <SelectTrigger
                  id={`${idPrefix}-language`}
                  aria-label={messages.languageLabel}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PRETTIER_LANGUAGE_KEYS.map((language) => (
                      <SelectItem key={language} value={language}>
                        {getPrettierLanguageConfig(language).label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor={`${idPrefix}-print-width`}>
                {messages.printWidthLabel}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id={`${idPrefix}-print-width`}
                  type="number"
                  inputMode="numeric"
                  min={40}
                  max={200}
                  value={String(options.printWidth)}
                  onChange={(event) => {
                    setOptions((currentOptions) => ({
                      ...currentOptions,
                      printWidth: clampPrettierPrintWidth(event.target.value),
                    }))
                  }}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor={`${idPrefix}-tab-width`}>
                {messages.tabWidthLabel}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id={`${idPrefix}-tab-width`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={8}
                  value={String(options.tabWidth)}
                  onChange={(event) => {
                    setOptions((currentOptions) => ({
                      ...currentOptions,
                      tabWidth: clampPrettierTabWidth(event.target.value),
                    }))
                  }}
                />
              </InputGroup>
            </Field>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <FieldSet>
              <FieldLegend>{messages.indentationLegend}</FieldLegend>

              <Field orientation="horizontal">
                <Checkbox
                  id={`${idPrefix}-use-tabs`}
                  checked={options.useTabs}
                  onCheckedChange={(checked) => {
                    setOptions((currentOptions) => ({
                      ...currentOptions,
                      useTabs: Boolean(checked),
                    }))
                  }}
                />
                <FieldContent>
                  <FieldLabel htmlFor={`${idPrefix}-use-tabs`}>
                    {messages.useTabsLabel}
                  </FieldLabel>
                </FieldContent>
              </Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend>{messages.styleLegend}</FieldLegend>

              {selectedLanguage.supportsSemi ? (
                <Field orientation="horizontal">
                  <Checkbox
                    id={`${idPrefix}-semi`}
                    checked={options.semi}
                    onCheckedChange={(checked) => {
                      setOptions((currentOptions) => ({
                        ...currentOptions,
                        semi: Boolean(checked),
                      }))
                    }}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={`${idPrefix}-semi`}>
                      {messages.semicolonsLabel}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              ) : null}

              {selectedLanguage.supportsSingleQuote ? (
                <Field orientation="horizontal">
                  <Checkbox
                    id={`${idPrefix}-single-quote`}
                    checked={options.singleQuote}
                    onCheckedChange={(checked) => {
                      setOptions((currentOptions) => ({
                        ...currentOptions,
                        singleQuote: Boolean(checked),
                      }))
                    }}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={`${idPrefix}-single-quote`}>
                      {messages.singleQuotesLabel}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              ) : null}

              {selectedLanguage.supportsTrailingComma ? (
                <Field>
                  <FieldLabel htmlFor={`${idPrefix}-trailing-comma`}>
                    {messages.trailingCommaLabel}
                  </FieldLabel>
                  <Select
                    value={options.trailingComma}
                    onValueChange={(value) => {
                      setOptions((currentOptions) => ({
                        ...currentOptions,
                        trailingComma:
                          value as PrettierFormatOptions["trailingComma"],
                      }))
                    }}
                  >
                    <SelectTrigger
                      id={`${idPrefix}-trailing-comma`}
                      aria-label={messages.trailingCommaLabel}
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {PRETTIER_TRAILING_COMMA_VALUES.map(
                          (trailingCommaValue) => (
                            <SelectItem
                              key={trailingCommaValue}
                              value={trailingCommaValue}
                            >
                              {
                                {
                                  none: messages.trailingCommaNoneLabel,
                                  es5: messages.trailingCommaEs5Label,
                                  all: messages.trailingCommaAllLabel,
                                }[trailingCommaValue]
                              }
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              ) : null}
            </FieldSet>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
