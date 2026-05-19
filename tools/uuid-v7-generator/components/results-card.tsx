import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { Download, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import type { UuidV7Messages } from "../types"

type UuidV7ResultsCardProps = Readonly<{
  downloadFilename: string
  downloadUrl: string | null
  generatedAtLabel: string
  generatedAtMs: number | null
  messages: UuidV7Messages
  output: string
  count: number
  isBatchMode: boolean
  timestampError: string
  onRegenerate: () => void
}>

function UuidV7ResultsCard({
  downloadFilename,
  downloadUrl,
  generatedAtLabel,
  generatedAtMs,
  messages,
  output,
  count,
  isBatchMode,
  timestampError,
  onRegenerate,
}: UuidV7ResultsCardProps) {
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

        <div
          aria-label={
            isBatchMode ? messages.batchSummaryLabel : messages.resultsTitle
          }
          role="group"
          className="grid gap-3 rounded-md border bg-muted/30 p-3 sm:grid-cols-3"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              {messages.versionLabel}
            </span>
            <Badge variant="secondary">UUID v7</Badge>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              {messages.generatedCountLabel}
            </span>
            <span className="font-mono text-sm">{count}</span>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              {messages.timestampMillisecondsLabel}
            </span>
            <span className="truncate font-mono text-sm">
              {generatedAtMs ?? messages.unavailableLabel}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {messages.timestampLabel}
          </span>
          <span className="truncate font-mono text-sm">{generatedAtLabel}</span>
        </div>

        <Textarea
          aria-label={messages.resultsTitle}
          value={output}
          readOnly
          rows={isBatchMode ? 12 : 5}
          placeholder={messages.resultsPlaceholder}
          spellCheck={false}
          className={cn(
            "max-h-[min(32rem,60vh)] resize-y overflow-y-auto font-mono text-sm",
            isBatchMode ? "min-h-80" : "min-h-36"
          )}
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

export { UuidV7ResultsCard }
