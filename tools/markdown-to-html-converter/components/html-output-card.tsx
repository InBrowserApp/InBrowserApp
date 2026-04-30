import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Switch } from "@workspace/ui/components/ui/switch"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Download } from "@workspace/ui/icons"

import type { MetricsProps, MarkdownToHtmlMessages } from "../client/types"
import { HighlightedHtml } from "./highlighted-html"

type HtmlOutputCardProps = Readonly<{
  messages: MarkdownToHtmlMessages
  html: string
  downloadUrl: string | null
  sanitize: boolean
  onSanitizeChange: (value: boolean) => void
}> &
  MetricsProps

function HtmlOutputCard({
  messages,
  html,
  metrics,
  downloadUrl,
  sanitize,
  onSanitizeChange,
}: HtmlOutputCardProps) {
  const hasOutput = html.trim().length > 0

  return (
    <ToolPanelCard className="border border-border/70 bg-card">
      <CardHeader className="gap-4 border-b xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-center">
        <div className="flex flex-col gap-1.5">
          <CardTitle>{messages.outputLabel}</CardTitle>

          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline">
              {messages.charactersLabel} {metrics.characters}
            </Badge>
            <Badge variant="outline">
              {messages.linesLabel} {metrics.lines}
            </Badge>
            <Badge variant="outline">HTML</Badge>
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-border/70 bg-muted/30 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {messages.sanitizeLabel}
              </div>
              <p className="text-sm leading-5 text-muted-foreground">
                {messages.sanitizeDescription}
              </p>
            </div>

            <Switch
              checked={sanitize}
              onCheckedChange={onSanitizeChange}
              aria-label={messages.sanitizeLabel}
            />
          </div>
        </div>
      </CardHeader>

      <ToolPanelCardContent>
        <HighlightedHtml
          ariaLabel={messages.outputLabel}
          emptyTitle={messages.emptyTitle}
          emptyDescription={messages.emptyDescription}
          value={html}
        />
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={html}
          copyLabel={messages.copyHtmlLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!hasOutput}
          variant="ghost"
        />

        {downloadUrl ? (
          <Button asChild size="sm" variant="ghost">
            <a href={downloadUrl} download="markdown.html">
              <Download data-icon="inline-start" />
              {messages.downloadHtmlLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" variant="ghost" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadHtmlLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { HtmlOutputCard }
