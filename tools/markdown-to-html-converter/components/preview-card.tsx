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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Printer, Sparkles } from "@workspace/ui/icons"

import type { MarkdownToHtmlMessages } from "../client/types"
import { HtmlPreviewFrame } from "./html-preview-frame"

type PreviewCardProps = Readonly<{
  messages: MarkdownToHtmlMessages
  html: string
  previewDocument: string
  onPrint: () => void
}>

function PreviewCard({
  messages,
  html,
  previewDocument,
  onPrint,
}: PreviewCardProps) {
  const hasOutput = html.trim().length > 0

  return (
    <ToolPanelCard className="border border-border/70 bg-card">
      <CardHeader className="gap-4 border-b">
        <div className="flex flex-col gap-1.5">
          <CardTitle>{messages.previewLabel}</CardTitle>
          <CardDescription>{messages.previewDescription}</CardDescription>
        </div>
      </CardHeader>

      <ToolPanelCardContent
        className={hasOutput ? "px-0 group-data-[size=sm]/card:px-0" : "gap-4"}
      >
        {hasOutput ? (
          <HtmlPreviewFrame
            title={messages.previewLabel}
            documentHtml={previewDocument}
          />
        ) : (
          <Empty className="min-h-[22rem] rounded-[1.5rem] border border-dashed border-border/80 bg-muted/20">
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
