import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw } from "@workspace/ui/icons"

import type { AsciiArtGeneratorMessages } from "../types"

type InputCardProps = Readonly<{
  inputId: string
  messages: AsciiArtGeneratorMessages
  text: string
  onTextChange: (value: string) => void
  onLoadSample: () => void
  onClear: () => void
}>

function InputCard({
  inputId,
  messages,
  text,
  onTextChange,
  onLoadSample,
  onClear,
}: InputCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputLabel}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <label htmlFor={inputId} className="sr-only">
          {messages.inputLabel}
        </label>
        <Textarea
          id={inputId}
          aria-label={messages.inputLabel}
          value={text}
          onChange={(event) => {
            onTextChange(event.target.value)
          }}
          placeholder={messages.inputPlaceholder}
          rows={12}
          className="min-h-72 resize-y font-mono text-sm"
        />
      </CardContent>
      <CardFooter className="justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample}>
          <FileText data-icon="inline-start" />
          {messages.loadSample}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <RefreshCcw data-icon="inline-start" />
          {messages.clearText}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { InputCard }
