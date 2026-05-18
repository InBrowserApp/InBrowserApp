import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import type { UuidV4BulkMessages } from "../types"

type UuidV4BulkResultsCardProps = Readonly<{
  messages: UuidV4BulkMessages
  output: string
  generationError: string
  downloadFilename: string
  downloadUrl: string | null
  onRegenerate: () => void
}>

function UuidV4BulkResultsCard({
  messages,
  output,
  generationError,
  downloadFilename,
  downloadUrl,
  onRegenerate,
}: UuidV4BulkResultsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        {generationError ? (
          <Alert variant="destructive" aria-live="polite">
            <TriangleAlert />
            <AlertDescription>{generationError}</AlertDescription>
          </Alert>
        ) : null}

        <Textarea
          aria-label={messages.resultsTitle}
          aria-invalid={Boolean(generationError)}
          value={output}
          readOnly
          rows={16}
          placeholder={messages.resultsPlaceholder}
          className="max-h-[min(34rem,62vh)] min-h-96 resize-y overflow-y-auto font-mono text-sm"
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-col items-stretch justify-between gap-3 border-t sm:flex-row sm:items-center">
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

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="sm:shrink-0"
          onClick={onRegenerate}
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.regenerateLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { UuidV4BulkResultsCard }
