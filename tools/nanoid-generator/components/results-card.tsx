import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
import { Download, RefreshCcw } from "@workspace/ui/icons"

import type { NanoidMessages } from "../types"

type NanoidResultsCardProps = Readonly<{
  downloadFilename: string
  downloadUrl: string | null
  messages: NanoidMessages
  output: string
  onRegenerate: () => void
}>

function NanoidResultsCard({
  downloadFilename,
  downloadUrl,
  messages,
  output,
  onRegenerate,
}: NanoidResultsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          aria-label={messages.resultsTitle}
          value={output}
          readOnly
          rows={14}
          placeholder={messages.resultsPlaceholder}
          className="min-h-80 resize-y font-mono text-sm"
        />
      </CardContent>
      <CardFooter className="justify-between gap-3 border-t">
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
      </CardFooter>
    </Card>
  )
}

export { NanoidResultsCard }
