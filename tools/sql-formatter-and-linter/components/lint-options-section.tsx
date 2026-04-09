import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import type { SqlFormatterAndLinterMessages } from "../client/types"
import { clampMaxLineLength, type SqlLintOptions } from "../core/sql-format"

type LintOptionsSectionProps = Readonly<{
  idPrefix: string
  lintOptions: SqlLintOptions
  messages: SqlFormatterAndLinterMessages
  setLintOptions: React.Dispatch<React.SetStateAction<SqlLintOptions>>
}>

function LintOptionsSection({
  idPrefix,
  lintOptions,
  messages,
  setLintOptions,
}: LintOptionsSectionProps) {
  return (
    <FieldSet>
      <FieldLegend variant="label">{messages.lintSectionLabel}</FieldLegend>
      <p className="text-sm leading-6 text-muted-foreground">
        {messages.lintSectionDescription}
      </p>

      <div className="grid gap-4 xl:grid-cols-2">
        <BooleanOptionField
          checked={lintOptions.checkSelectStar}
          id={`${idPrefix}-select-star`}
          label={messages.checkSelectStarLabel}
          onCheckedChange={(checked) => {
            setLintOptions((currentOptions) => ({
              ...currentOptions,
              checkSelectStar: checked,
            }))
          }}
        />

        <BooleanOptionField
          checked={lintOptions.checkUnsafeMutation}
          id={`${idPrefix}-unsafe-mutation`}
          label={messages.checkUnsafeMutationLabel}
          onCheckedChange={(checked) => {
            setLintOptions((currentOptions) => ({
              ...currentOptions,
              checkUnsafeMutation: checked,
            }))
          }}
        />

        <BooleanOptionField
          checked={lintOptions.requireSemicolon}
          id={`${idPrefix}-semicolon`}
          label={messages.requireSemicolonLabel}
          onCheckedChange={(checked) => {
            setLintOptions((currentOptions) => ({
              ...currentOptions,
              requireSemicolon: checked,
            }))
          }}
        />

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-max-line-length`}>
            {messages.maxLineLengthLabel}
          </FieldLabel>
          <Input
            id={`${idPrefix}-max-line-length`}
            type="number"
            min={0}
            max={300}
            value={lintOptions.maxLineLength}
            onChange={(event) => {
              setLintOptions((currentOptions) => ({
                ...currentOptions,
                maxLineLength: clampMaxLineLength(Number(event.target.value)),
              }))
            }}
          />
          <FieldDescription>
            {messages.maxLineLengthDescription}
          </FieldDescription>
        </Field>
      </div>
    </FieldSet>
  )
}

type BooleanOptionFieldProps = Readonly<{
  checked: boolean
  id: string
  label: string
  onCheckedChange: (checked: boolean) => void
}>

function BooleanOptionField({
  checked,
  id,
  label,
  onCheckedChange,
}: BooleanOptionFieldProps) {
  return (
    <Field orientation="horizontal">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(nextChecked) => {
          onCheckedChange(Boolean(nextChecked))
        }}
      />
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      </FieldContent>
    </Field>
  )
}

export { LintOptionsSection }
