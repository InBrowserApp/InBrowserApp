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

import type { RegexTesterReplacerLocalizedCatalog } from "../types"

type SourceInputCardProps = Readonly<{
  messages: RegexTesterReplacerLocalizedCatalog
  sourceText: string
  sourceTextId: string
  onClear: () => void
  onLoadSample: () => void
  onSourceTextChange: (value: string) => void
}>

function SourceInputCard({
  messages,
  sourceText,
  sourceTextId,
  onClear,
  onLoadSample,
  onSourceTextChange,
}: SourceInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.sourceTitle}</CardTitle>
        <CardDescription>{messages.sourceDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <label htmlFor={sourceTextId} className="sr-only">
          {messages.sourceTextLabel}
        </label>
        <Textarea
          id={sourceTextId}
          aria-label={messages.sourceTextLabel}
          value={sourceText}
          rows={12}
          placeholder={messages.sourceTextPlaceholder}
          onChange={(event) => {
            onSourceTextChange(event.target.value)
          }}
          className="min-h-80 resize-y font-mono text-sm"
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

export { SourceInputCard }
