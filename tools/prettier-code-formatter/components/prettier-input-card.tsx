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

import type { PrettierCodeFormatterMessages } from "../client/types"

type PrettierInputCardProps = Readonly<{
  fileInputRef: RefObject<HTMLInputElement | null>
  hasInputError: boolean
  isPendingLargeFormat: boolean
  messages: PrettierCodeFormatterMessages
  sourceCode: string
  onClear: () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFormatNow: () => void
  onSourceCodeChange: (value: string) => void
  onUseSample: () => void
}>

function PrettierInputCard({
  fileInputRef,
  hasInputError,
  isPendingLargeFormat,
  messages,
  sourceCode,
  onClear,
  onFileChange,
  onFormatNow,
  onSourceCodeChange,
  onUseSample,
}: PrettierInputCardProps) {
  const sourceCodeId = useId()

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputLabel}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <FieldGroup className="flex-1">
          {isPendingLargeFormat ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {messages.formatPausedHint}
            </p>
          ) : null}

          <Field className="flex-1" data-invalid={hasInputError || undefined}>
            <Textarea
              id={sourceCodeId}
              aria-label={messages.inputLabel}
              aria-invalid={hasInputError}
              spellCheck={false}
              value={sourceCode}
              onChange={(event) => {
                onSourceCodeChange(event.target.value)
              }}
              placeholder={messages.inputPlaceholder}
              className="[field-sizing:fixed] h-[18em] resize-y font-mono text-sm"
            />
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-between gap-3 border-t">
        <div className="flex flex-wrap gap-3">
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
            accept=".js,.jsx,.mjs,.cjs,.ts,.tsx,.json,.json5,.jsonc,.html,.htm,.vue,.hbs,.handlebars,.mustache,.css,.scss,.less,.md,.markdown,.mdx,.yaml,.yml,.graphql,.gql,.txt,text/plain"
            aria-label={messages.importFromFileLabel}
            className="sr-only"
            onChange={onFileChange}
          />
        </div>

        {isPendingLargeFormat ? (
          <Button type="button" size="sm" onClick={onFormatNow}>
            <Sparkles data-icon="inline-start" />
            {messages.formatNowLabel}
          </Button>
        ) : null}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { PrettierInputCard }
