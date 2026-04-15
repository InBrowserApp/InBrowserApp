import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
import { Download, RefreshCcw } from "@workspace/ui/icons"

import type { Cuid2Messages } from "../types"

type Cuid2ResultsCardProps = Readonly<{
  messages: Cuid2Messages
  output: string
  downloadFilename: string
  downloadUrl: string | null
  onRegenerate: () => void
}>

function Cuid2ResultsCard({
  messages,
  output,
  downloadFilename,
  downloadUrl,
  onRegenerate,
}: Cuid2ResultsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <Textarea
          aria-label={messages.resultsTitle}
          value={output}
          readOnly
          rows={14}
          placeholder={messages.resultsPlaceholder}
          className="min-h-80 resize-y font-mono text-sm"
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between gap-3 border-t">
        <div className="flex flex-wrap items-center gap-2">
          <ToolCopyButton
            value={output}
            copyLabel={messages.copyResultsLabel}
            copiedLabel={messages.copiedLabel}
            variant="ghost"
            disabled={output.length === 0}
          />

          {downloadUrl ? (
            <Button asChild type="button" variant="ghost" size="sm">
              <a href={downloadUrl} download={downloadFilename}>
                <Download data-icon="inline-start" />
                {messages.downloadResultsLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="sm" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadResultsLabel}
            </Button>
          )}
        </div>

        <Button type="button" variant="ghost" size="sm" onClick={onRegenerate}>
          <RefreshCcw data-icon="inline-start" />
          {messages.regenerateLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { Cuid2ResultsCard }
