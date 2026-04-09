import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/ui/field"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import type { SqlFormatterAndLinterMessages } from "../client/types"
import {
  SQL_CASE_STYLES,
  clampExpressionWidth,
  clampLinesBetweenQueries,
  clampTabWidth,
  type SqlFormatOptions,
} from "../core/sql-format"
import { dialectLabels, sqlDialects } from "../core/sql-dialects"

type FormatOptionsSectionProps = Readonly<{
  formatOptions: SqlFormatOptions
  idPrefix: string
  messages: SqlFormatterAndLinterMessages
  setFormatOptions: React.Dispatch<React.SetStateAction<SqlFormatOptions>>
}>

function FormatOptionsSection({
  formatOptions,
  idPrefix,
  messages,
  setFormatOptions,
}: FormatOptionsSectionProps) {
  const caseLabels = {
    preserve: messages.preserveCaseLabel,
    upper: messages.upperCaseLabel,
    lower: messages.lowerCaseLabel,
  } as const

  return (
    <FieldSet>
      <FieldLegend variant="label">{messages.formatSectionLabel}</FieldLegend>
      <p className="text-sm leading-6 text-muted-foreground">
        {messages.formatSectionDescription}
      </p>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Field>
          <FieldLabel>{messages.dialectLabel}</FieldLabel>
          <Select
            value={formatOptions.dialect}
            onValueChange={(value) => {
              setFormatOptions((currentOptions) => ({
                ...currentOptions,
                dialect: value as SqlFormatOptions["dialect"],
              }))
            }}
          >
            <SelectTrigger
              aria-label={messages.dialectLabel}
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sqlDialects.map((dialect) => (
                  <SelectItem key={dialect} value={dialect}>
                    {dialectLabels[dialect]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-tab-width`}>
            {messages.tabWidthLabel}
          </FieldLabel>
          <Input
            id={`${idPrefix}-tab-width`}
            type="number"
            min={1}
            max={8}
            value={formatOptions.tabWidth}
            onChange={(event) => {
              setFormatOptions((currentOptions) => ({
                ...currentOptions,
                tabWidth: clampTabWidth(Number(event.target.value)),
              }))
            }}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-lines-between`}>
            {messages.linesBetweenQueriesLabel}
          </FieldLabel>
          <Input
            id={`${idPrefix}-lines-between`}
            type="number"
            min={1}
            max={5}
            value={formatOptions.linesBetweenQueries}
            onChange={(event) => {
              setFormatOptions((currentOptions) => ({
                ...currentOptions,
                linesBetweenQueries: clampLinesBetweenQueries(
                  Number(event.target.value)
                ),
              }))
            }}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-expression-width`}>
            {messages.expressionWidthLabel}
          </FieldLabel>
          <Input
            id={`${idPrefix}-expression-width`}
            type="number"
            min={20}
            max={240}
            value={formatOptions.expressionWidth}
            onChange={(event) => {
              setFormatOptions((currentOptions) => ({
                ...currentOptions,
                expressionWidth: clampExpressionWidth(
                  Number(event.target.value)
                ),
              }))
            }}
          />
        </Field>

        <CaseStyleField
          ariaLabel={messages.keywordCaseLabel}
          label={messages.keywordCaseLabel}
          value={formatOptions.keywordCase}
          caseLabels={caseLabels}
          onValueChange={(value) => {
            setFormatOptions((currentOptions) => ({
              ...currentOptions,
              keywordCase: value,
            }))
          }}
        />

        <CaseStyleField
          ariaLabel={messages.dataTypeCaseLabel}
          label={messages.dataTypeCaseLabel}
          value={formatOptions.dataTypeCase}
          caseLabels={caseLabels}
          onValueChange={(value) => {
            setFormatOptions((currentOptions) => ({
              ...currentOptions,
              dataTypeCase: value,
            }))
          }}
        />

        <CaseStyleField
          ariaLabel={messages.functionCaseLabel}
          label={messages.functionCaseLabel}
          value={formatOptions.functionCase}
          caseLabels={caseLabels}
          onValueChange={(value) => {
            setFormatOptions((currentOptions) => ({
              ...currentOptions,
              functionCase: value,
            }))
          }}
        />
      </div>

      <Field orientation="horizontal">
        <Checkbox
          id={`${idPrefix}-use-tabs`}
          checked={formatOptions.useTabs}
          onCheckedChange={(checked) => {
            setFormatOptions((currentOptions) => ({
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
  )
}

type CaseStyleFieldProps = Readonly<{
  ariaLabel: string
  caseLabels: Record<SqlFormatOptions["keywordCase"], string>
  label: string
  value: SqlFormatOptions["keywordCase"]
  onValueChange: (value: SqlFormatOptions["keywordCase"]) => void
}>

function CaseStyleField({
  ariaLabel,
  caseLabels,
  label,
  value,
  onValueChange,
}: CaseStyleFieldProps) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          onValueChange(nextValue as SqlFormatOptions["keywordCase"])
        }}
      >
        <SelectTrigger aria-label={ariaLabel} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {SQL_CASE_STYLES.map((caseStyle) => (
              <SelectItem key={caseStyle} value={caseStyle}>
                {caseLabels[caseStyle]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export { FormatOptionsSection }
