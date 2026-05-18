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
import { Clock3, Download, RefreshCcw } from "@workspace/ui/icons"

import type { UuidV6Messages } from "../types"

type UuidV6ResultsCardProps = Readonly<{
  messages: UuidV6Messages
  output: string
  generatedAtText: string | null
  downloadFilename: string
  downloadUrl: string | null
  onRegenerate: () => void
}>

function UuidV6ResultsCard({
  messages,
  output,
  generatedAtText,
  downloadFilename,
  downloadUrl,
  onRegenerate,
}: UuidV6ResultsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Textarea
          aria-label={messages.resultsTitle}
          value={output}
          readOnly
          rows={14}
          placeholder={messages.resultsPlaceholder}
          className="max-h-[min(32rem,60vh)] min-h-80 resize-y overflow-y-auto font-mono text-sm"
        />

        <p className="flex min-h-5 items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="size-4 shrink-0" aria-hidden="true" />
          {generatedAtText ?? "-"}
        </p>
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

export { UuidV6ResultsCard }
