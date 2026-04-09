import { useId, type ChangeEvent, type RefObject } from "react"

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
import { Field, FieldGroup } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw, Sparkles } from "@workspace/ui/icons"

import type { SqlFormatterAndLinterMessages } from "../client/constants"
import { SQL_FILE_ACCEPT } from "../core/sql-dialects"

type SqlInputCardProps = Readonly<{
  fileInputRef: RefObject<HTMLInputElement | null>
  hasInputError: boolean
  messages: SqlFormatterAndLinterMessages
  sourceSql: string
  onClear: () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSourceSqlChange: (value: string) => void
  onUseSample: () => void
}>

function SqlInputCard({
  fileInputRef,
  hasInputError,
  messages,
  sourceSql,
  onClear,
  onFileChange,
  onSourceSqlChange,
  onUseSample,
}: SqlInputCardProps) {
  const sourceSqlId = useId()

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.sourceSqlLabel}</CardTitle>
        <CardDescription>{messages.sourceSqlDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <FieldGroup className="flex-1">
          <Field className="flex-1" data-invalid={hasInputError || undefined}>
            <Textarea
              id={sourceSqlId}
              aria-label={messages.sourceSqlLabel}
              aria-invalid={hasInputError}
              spellCheck={false}
              value={sourceSql}
              onChange={(event) => {
                onSourceSqlChange(event.target.value)
              }}
              placeholder={messages.sourceSqlPlaceholder}
              className="[field-sizing:fixed] h-[18em] resize-none font-mono text-sm"
            />
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onUseSample}>
          <Sparkles data-icon="inline-start" />
          {messages.useSampleLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <RefreshCcw data-icon="inline-start" />
          {messages.clearLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            fileInputRef.current?.click()
          }}
        >
          <FileText data-icon="inline-start" />
          {messages.importFromFileLabel}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={SQL_FILE_ACCEPT}
          aria-label={messages.importFromFileLabel}
          className="sr-only"
          onChange={onFileChange}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { SqlInputCard }
