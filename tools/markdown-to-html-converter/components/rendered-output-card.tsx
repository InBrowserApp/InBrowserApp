import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Switch } from "@workspace/ui/components/ui/switch"
import { Download, Sparkles } from "@workspace/ui/icons"

import type { MetricsProps, MarkdownToHtmlMessages } from "../client/types"
import { HtmlPreviewFrame } from "./html-preview-frame"

type RenderedOutputCardProps = Readonly<{
  messages: MarkdownToHtmlMessages
  html: string
  previewDocument: string
  sanitize: boolean
  downloadUrl: string | null
  onSanitizeChange: (value: boolean) => void
  onPrint: () => void
}> &
  MetricsProps

function RenderedOutputCard({
  messages,
  html,
  metrics,
  previewDocument,
  sanitize,
  downloadUrl,
  onSanitizeChange,
  onPrint,
}: RenderedOutputCardProps) {
  const hasOutput = html.trim().length > 0

  return (
    <Card className="border border-border/70 bg-gradient-to-b from-card via-card to-primary/5">
      <CardHeader className="gap-4 border-b xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="flex flex-col gap-1.5">
          <CardTitle>{messages.outputLabel}</CardTitle>
          <CardDescription>{messages.outputDescription}</CardDescription>

          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline">
              {messages.charactersLabel} {metrics.characters}
            </Badge>
            <Badge variant="outline">
              {messages.linesLabel} {metrics.lines}
            </Badge>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/80 p-3">
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

      <CardContent className="space-y-5">
        {hasOutput ? (
          <>
            <section className="space-y-3">
              <div className="text-sm font-medium">{messages.previewLabel}</div>
              <p className="text-sm text-muted-foreground">
                {messages.previewDescription}
              </p>
              <HtmlPreviewFrame
                title={messages.previewLabel}
                documentHtml={previewDocument}
              />
            </section>

            <section className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-medium">
                  {messages.sourceLabel}
                </div>
                <Badge variant="outline">HTML</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {messages.sourceDescription}
              </p>

              <ScrollArea className="h-72 rounded-[1.25rem] border border-border/70 bg-slate-950 text-slate-50">
                <pre className="min-h-full px-4 py-4 font-mono text-sm leading-6 whitespace-pre-wrap">
                  <code>{html}</code>
                </pre>
              </ScrollArea>
            </section>
          </>
        ) : (
          <Empty className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/75 py-14">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Sparkles />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
              <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>

      <CardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={html}
          copyLabel={messages.copyHtmlLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!hasOutput}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download="markdown.html">
              <Download data-icon="inline-start" />
              {messages.downloadHtmlLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadHtmlLabel}
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onPrint}
          disabled={!hasOutput}
        >
          {messages.printHtmlLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { RenderedOutputCard }
