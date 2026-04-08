import type { Dispatch, SetStateAction } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldGroup, FieldSeparator } from "@workspace/ui/components/ui/field"

import type { CsvToJsonConverterMessages } from "../client/types"
import {
  clampIndentSize,
  clampNonNegativeInteger,
  type CsvToJsonOptions,
  type SkipEmptyLinesMode,
} from "../core/convert-csv-to-json"
import {
  CheckboxField,
  SkipEmptyLinesField,
  TextField,
} from "./option-controls"

type OptionsCardProps = Readonly<{
  messages: CsvToJsonConverterMessages
  options: CsvToJsonOptions
  setOptions: Dispatch<SetStateAction<CsvToJsonOptions>>
}>

function OptionsCard({ messages, options, setOptions }: OptionsCardProps) {
  const skipEmptyLineOptions = [
    {
      label: messages.skipEmptyLinesNoneLabel,
      value: "none",
    },
    {
      label: messages.skipEmptyLinesTrueLabel,
      value: "true",
    },
    {
      label: messages.skipEmptyLinesGreedyLabel,
      value: "greedy",
    },
  ] as const satisfies readonly Readonly<{
    label: string
    value: SkipEmptyLinesMode
  }>[]

  function updateOption<Key extends keyof CsvToJsonOptions>(
    key: Key,
    value: CsvToJsonOptions[Key]
  ) {
    setOptions((currentOptions) => ({
      ...currentOptions,
      [key]: value,
    }))
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsLabel}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            <CheckboxField
              id="csv-no-header"
              label={messages.noHeaderLabel}
              checked={options.noHeader}
              onCheckedChange={(checked) => {
                updateOption("noHeader", checked)
              }}
            />
            <TextField
              id="csv-headers-text"
              label={messages.headersLabel}
              value={options.headersText}
              disabled={!options.noHeader}
              placeholder={messages.headersPlaceholder}
              onChange={(value) => {
                updateOption("headersText", value)
              }}
            />
            <TextField
              id="csv-delimiter"
              label={messages.delimiterLabel}
              value={options.delimiter}
              placeholder=","
              onChange={(value) => {
                updateOption("delimiter", value)
              }}
            />
            <TextField
              id="csv-newline"
              label={messages.newlineLabel}
              value={options.newline}
              placeholder="auto"
              onChange={(value) => {
                updateOption("newline", value)
              }}
            />
            <TextField
              id="csv-quote-char"
              label={messages.quoteLabel}
              value={options.quoteChar}
              placeholder={'"'}
              onChange={(value) => {
                updateOption("quoteChar", value)
              }}
            />
            <TextField
              id="csv-escape-char"
              label={messages.escapeCharLabel}
              value={options.escapeChar}
              placeholder={'"'}
              onChange={(value) => {
                updateOption("escapeChar", value)
              }}
            />
            <SkipEmptyLinesField
              label={messages.skipEmptyLinesLabel}
              value={options.skipEmptyLines}
              options={skipEmptyLineOptions}
              onValueChange={(value) => {
                updateOption("skipEmptyLines", value)
              }}
            />
            <TextField
              id="csv-indent-size"
              label={messages.indentSizeLabel}
              value={options.indentSize}
              type="number"
              min={0}
              max={8}
              description={messages.indentSizeDescription}
              onChange={(value) => {
                updateOption("indentSize", clampIndentSize(Number(value || 0)))
              }}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
            <CheckboxField
              id="csv-trim"
              label={messages.trimLabel}
              checked={options.trim}
              onCheckedChange={(checked) => {
                updateOption("trim", checked)
              }}
            />
            <CheckboxField
              id="csv-check-type"
              label={messages.checkTypeLabel}
              checked={options.checkType}
              onCheckedChange={(checked) => {
                updateOption("checkType", checked)
              }}
            />
            <CheckboxField
              id="csv-fast-mode"
              label={messages.fastModeLabel}
              checked={options.fastMode}
              onCheckedChange={(checked) => {
                updateOption("fastMode", checked)
              }}
            />
          </div>

          <FieldSeparator />

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            <TextField
              id="csv-preview"
              label={messages.previewLabel}
              value={options.preview}
              type="number"
              min={0}
              onChange={(value) => {
                updateOption(
                  "preview",
                  clampNonNegativeInteger(Number(value || 0))
                )
              }}
            />
            <TextField
              id="csv-comments"
              label={messages.commentsLabel}
              value={options.comments}
              placeholder={messages.commentsPlaceholder}
              onChange={(value) => {
                updateOption("comments", value)
              }}
            />
            <TextField
              id="csv-skip-first-lines"
              label={messages.skipFirstNLinesLabel}
              value={options.skipFirstNLines}
              type="number"
              min={0}
              onChange={(value) => {
                updateOption(
                  "skipFirstNLines",
                  clampNonNegativeInteger(Number(value || 0))
                )
              }}
            />
            <TextField
              id="csv-delimiters-to-guess"
              label={messages.delimitersToGuessLabel}
              value={options.delimitersToGuessText}
              placeholder={messages.delimitersToGuessPlaceholder}
              onChange={(value) => {
                updateOption("delimitersToGuessText", value)
              }}
            />
            <TextField
              id="csv-include-columns"
              label={messages.includeColumnsLabel}
              value={options.includeColumns}
              placeholder={messages.regexPlaceholder}
              onChange={(value) => {
                updateOption("includeColumns", value)
              }}
            />
            <TextField
              id="csv-ignore-columns"
              label={messages.ignoreColumnsLabel}
              value={options.ignoreColumns}
              placeholder={messages.regexPlaceholder}
              onChange={(value) => {
                updateOption("ignoreColumns", value)
              }}
            />
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
