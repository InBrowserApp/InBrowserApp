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
import { Field, FieldError } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileJson2, FileText } from "@workspace/ui/icons"

import type { JsonSchemaGeneratorMessages } from "../client/types"

type InputCardProps = Readonly<{
  errorMessage: string
  fileInputRef: RefObject<HTMLInputElement | null>
  inputText: string
  messages: JsonSchemaGeneratorMessages
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onInputChange: (value: string) => void
  onUseSample: () => void
}>

function InputCard({
  errorMessage,
  fileInputRef,
  inputText,
  messages,
  onFileChange,
  onInputChange,
  onUseSample,
}: InputCardProps) {
  const inputId = useId()

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field
          data-invalid={Boolean(errorMessage) || undefined}
          className="min-h-0 flex-1"
        >
          <Textarea
            id={inputId}
            aria-label={messages.inputTitle}
            aria-invalid={Boolean(errorMessage)}
            spellCheck={false}
            value={inputText}
            onChange={(event) => {
              onInputChange(event.target.value)
            }}
            placeholder={messages.inputPlaceholder}
            className="min-h-80 flex-1 resize-y font-mono text-sm xl:min-h-0"
          />
          <FieldError>{errorMessage}</FieldError>
        </Field>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onUseSample}>
          <FileJson2 data-icon="inline-start" />
          {messages.useSampleLabel}
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
          accept=".json,.txt,application/json,text/plain"
          aria-label={messages.importFromFileLabel}
          className="sr-only"
          onChange={onFileChange}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { InputCard }
