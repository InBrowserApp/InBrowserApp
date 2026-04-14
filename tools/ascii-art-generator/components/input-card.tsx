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
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputLabel}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
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
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample}>
          <FileText data-icon="inline-start" />
          {messages.loadSample}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <RefreshCcw data-icon="inline-start" />
          {messages.clearText}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { InputCard }
