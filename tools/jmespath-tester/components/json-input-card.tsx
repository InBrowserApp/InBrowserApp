import type { ChangeEvent, RefObject } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw } from "@workspace/ui/icons"

import type { JmespathTesterMessages } from "../client/types"

type JsonInputCardProps = Readonly<{
  fileInputRef: RefObject<HTMLInputElement | null>
  jsonErrorMessage: string
  jsonText: string
  messages: JmespathTesterMessages
  onClearAll: () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFormatJson: () => void
  onJsonChange: (value: string) => void
  onUseSample: () => void
}>

function JsonInputCard({
  fileInputRef,
  jsonErrorMessage,
  jsonText,
  messages,
  onClearAll,
  onFileChange,
  onFormatJson,
  onJsonChange,
  onUseSample,
}: JsonInputCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.jsonLabel}</CardTitle>
        <CardDescription>{messages.jsonDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <FieldGroup className="flex-1">
          <Field data-invalid={jsonErrorMessage.length > 0 || undefined}>
            <Textarea
              value={jsonText}
              aria-label={messages.jsonLabel}
              aria-invalid={jsonErrorMessage.length > 0}
              spellCheck={false}
              onChange={(event) => {
                onJsonChange(event.target.value)
              }}
              className="min-h-80 flex-1 resize-y font-mono text-sm"
              placeholder={messages.jsonPlaceholder}
            />
            <FieldError>{jsonErrorMessage}</FieldError>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onUseSample}>
          {messages.useSampleLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClearAll}>
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
        <Button type="button" variant="ghost" size="sm" onClick={onFormatJson}>
          {messages.formatJsonLabel}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.txt,application/json,text/plain"
          aria-label={messages.importFromFileLabel}
          className="sr-only"
          onChange={onFileChange}
        />
      </CardFooter>
    </Card>
  )
}

export { JsonInputCard }
