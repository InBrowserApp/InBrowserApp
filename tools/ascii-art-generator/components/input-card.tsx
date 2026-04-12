import { useId } from "react"

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

import type { AsciiArtGeneratorLocalizedCatalog } from "../types"

type InputCardProps = Readonly<{
  messages: AsciiArtGeneratorLocalizedCatalog
  text: string
  onTextChange: (value: string) => void
  onLoadSample: () => void
  onClear: () => void
}>

function InputCard({
  messages,
  text,
  onTextChange,
  onLoadSample,
  onClear,
}: InputCardProps) {
  const textareaId = useId()

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <label htmlFor={textareaId} className="sr-only">
          {messages.inputTitle}
        </label>
        <Textarea
          id={textareaId}
          aria-label={messages.inputTitle}
          value={text}
          rows={7}
          placeholder={messages.inputPlaceholder}
          spellCheck={false}
          onChange={(event) => {
            onTextChange(event.target.value)
          }}
          className="min-h-56 resize-y text-sm"
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
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
