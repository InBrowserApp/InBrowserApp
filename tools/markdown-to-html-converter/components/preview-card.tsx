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
import { Switch } from "@workspace/ui/components/ui/switch"
import { Printer, Sparkles } from "@workspace/ui/icons"

import type { MarkdownToHtmlMessages } from "../client/types"
import { HtmlPreviewFrame } from "./html-preview-frame"

type PreviewCardProps = Readonly<{
  messages: MarkdownToHtmlMessages
  html: string
  previewDocument: string
  sanitize: boolean
  onSanitizeChange: (value: boolean) => void
  onPrint: () => void
}>

function PreviewCard({
  messages,
  html,
  previewDocument,
  sanitize,
  onSanitizeChange,
  onPrint,
}: PreviewCardProps) {
  const hasOutput = html.trim().length > 0

  return (
    <ToolPanelCard className="border border-border/70 bg-gradient-to-b from-card via-card to-muted/30">
      <CardHeader className="gap-4 border-b xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-center">
        <div className="flex flex-col gap-1.5">
          <CardTitle>{messages.previewLabel}</CardTitle>
          <CardDescription>{messages.previewDescription}</CardDescription>
        </div>

        <div className="rounded-[1.25rem] border border-border/70 bg-background/85 p-3 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                <span>{messages.sanitizeLabel}</span>
                <Badge variant="outline">HTML</Badge>
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

      <ToolPanelCardContent className="gap-4">
        {hasOutput ? (
          <HtmlPreviewFrame
            title={messages.previewLabel}
            documentHtml={previewDocument}
          />
        ) : (
          <Empty className="min-h-[22rem] rounded-[1.5rem] border border-dashed border-border/80 bg-background/75">
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
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onPrint}
          disabled={!hasOutput}
        >
          <Printer data-icon="inline-start" />
          {messages.printHtmlLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { PreviewCard }
