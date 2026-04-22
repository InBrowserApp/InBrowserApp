import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { Download, Sparkles } from "@workspace/ui/icons"

import type { MetricsProps, MarkdownToHtmlMessages } from "../client/types"

type HtmlOutputCardProps = Readonly<{
  messages: MarkdownToHtmlMessages
  html: string
  downloadUrl: string | null
}> &
  MetricsProps

function HtmlOutputCard({
  messages,
  html,
  metrics,
  downloadUrl,
}: HtmlOutputCardProps) {
  const hasOutput = html.trim().length > 0

  return (
    <ToolPanelCard className="border border-border/70 bg-gradient-to-b from-card via-card to-primary/5">
      <CardHeader className="gap-4 border-b">
        <div className="flex flex-col gap-1.5">
          <CardTitle>{messages.outputLabel}</CardTitle>
          <CardDescription>{messages.outputDescription}</CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {messages.charactersLabel} {metrics.characters}
          </Badge>
          <Badge variant="outline">
            {messages.linesLabel} {metrics.lines}
          </Badge>
          <Badge variant="outline">HTML</Badge>
        </div>
      </CardHeader>

      <ToolPanelCardContent className="gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">{messages.sourceLabel}</div>
          <p className="text-sm text-muted-foreground">
            {messages.sourceDescription}
          </p>
        </div>

        {hasOutput ? (
          <ScrollArea className="min-h-[28rem] flex-1 rounded-[1.25rem] border border-border/70 bg-slate-950 text-slate-50">
            <pre className="min-h-full px-4 py-4 font-mono text-sm leading-6 whitespace-pre-wrap">
              <code>{html}</code>
            </pre>
          </ScrollArea>
        ) : (
          <Empty className="min-h-[28rem] flex-1 rounded-[1.5rem] border border-dashed border-border/80 bg-background/75">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Sparkles />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
              <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
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
