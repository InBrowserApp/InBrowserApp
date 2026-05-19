import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
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
import { cn } from "@workspace/ui/lib/utils"
import {
  Clock3,
  Download,
  RefreshCcw,
  TriangleAlert,
} from "@workspace/ui/icons"

import type { UlidMessages } from "../types"

type UlidResultsCardProps = Readonly<{
  messages: UlidMessages
  output: string
  timestampError: string
  generatedAtText: string | null
  downloadFilename: string
  downloadUrl: string | null
  isBatchMode: boolean
  onRegenerate: () => void
}>

function UlidResultsCard({
  messages,
  output,
  timestampError,
  generatedAtText,
  downloadFilename,
  downloadUrl,
  isBatchMode,
  onRegenerate,
}: UlidResultsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {timestampError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{timestampError}</AlertDescription>
          </Alert>
        ) : null}

        <Textarea
          aria-label={messages.resultsTitle}
          value={output}
          readOnly
          rows={isBatchMode ? 12 : 5}
          placeholder={messages.resultsPlaceholder}
          className={cn(
            "max-h-[min(32rem,60vh)] resize-y overflow-y-auto font-mono text-sm",
            isBatchMode ? "min-h-80" : "min-h-36"
          )}
        />

        <p className="flex min-h-5 items-center gap-2 text-sm text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-4 shrink-0" />
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

export { UlidResultsCard }
