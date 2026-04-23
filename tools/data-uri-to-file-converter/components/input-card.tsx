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
import { RefreshCcw } from "@workspace/ui/icons"

import type { DataUriToFileConverterMessages } from "../types"

type DataUriInputCardProps = Readonly<{
  messages: DataUriToFileConverterMessages
  inputId: string
  value: string
  onInputChange: (value: string) => void
  onReset: () => void
}>

function DataUriInputCard({
  messages,
  inputId,
  value,
  onInputChange,
  onReset,
}: DataUriInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputPlaceholder}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <Textarea
          id={inputId}
          name="data-uri-input"
          rows={12}
          autoComplete="off"
          spellCheck={false}
          aria-label={messages.inputTitle}
          value={value}
          onChange={(event) => {
            onInputChange(event.target.value)
          }}
          placeholder={messages.inputPlaceholder}
          className="min-h-80 resize-y font-mono text-sm break-all whitespace-pre-wrap"
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { DataUriInputCard }
