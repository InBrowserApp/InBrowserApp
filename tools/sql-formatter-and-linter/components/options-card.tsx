import { useId, type Dispatch, type SetStateAction } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldGroup, FieldSeparator } from "@workspace/ui/components/ui/field"

import type { SqlFormatterAndLinterMessages } from "../client/constants"
import type { SqlFormatOptions, SqlLintOptions } from "../core/sql-format"
import { FormatOptionsSection } from "./format-options-section"
import { LintOptionsSection } from "./lint-options-section"

type OptionsCardProps = Readonly<{
  formatOptions: SqlFormatOptions
  lintOptions: SqlLintOptions
  messages: SqlFormatterAndLinterMessages
  setFormatOptions: Dispatch<SetStateAction<SqlFormatOptions>>
  setLintOptions: Dispatch<SetStateAction<SqlLintOptions>>
}>

function OptionsCard({
  formatOptions,
  lintOptions,
  messages,
  setFormatOptions,
  setLintOptions,
}: OptionsCardProps) {
  const idPrefix = useId()

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsLabel}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <FormatOptionsSection
            formatOptions={formatOptions}
            idPrefix={idPrefix}
            messages={messages}
            setFormatOptions={setFormatOptions}
          />

          <FieldSeparator />

          <LintOptionsSection
            idPrefix={idPrefix}
            lintOptions={lintOptions}
            messages={messages}
            setLintOptions={setLintOptions}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
