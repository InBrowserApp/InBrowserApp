import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download, FileText } from "@workspace/ui/icons"

import {
  DEFAULT_DOWNLOAD_NAME,
  DEFAULT_SCOPE_CLASS_NAME,
} from "../client/constants"
import type { MarkdownPreviewerMessages, OutputMode, TocItem } from "../types"
import { PreviewSurface } from "./preview-surface"
import { ReadOnlyHtml } from "./read-only-html"

type OutputCardProps = Readonly<{
  downloadUrl: string | null
  exportedDocument: string
  hasMarkdown: boolean
  messages: MarkdownPreviewerMessages
  onPrint: () => void
  outputMode: OutputMode
  renderedHtml: string
  scopedCss: string
  showToc: boolean
  toc: readonly TocItem[]
}>

function OutputCard({
  downloadUrl,
  exportedDocument,
  hasMarkdown,
  messages,
  onPrint,
  outputMode,
  renderedHtml,
  scopedCss,
  showToc,
  toc,
}: OutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-1">
          <CardTitle>
            {outputMode === "preview"
              ? messages.previewLabel
              : messages.htmlSourceLabel}
          </CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </div>
        <CardAction>
          <ToolCopyButton
            value={hasMarkdown ? exportedDocument : ""}
            copyLabel={messages.copyHtmlLabel}
            copiedLabel={messages.copiedLabel}
            variant="ghost"
            disabled={!hasMarkdown}
          />
        </CardAction>
      </CardHeader>

      <ToolPanelCardContent className="gap-4">
        {outputMode === "preview" ? (
          <PreviewSurface
            ariaLabel={messages.previewLabel}
            emptyDescription={messages.markdownPlaceholder}
            emptyTitle={messages.previewLabel}
            html={renderedHtml}
            scopeClassName={DEFAULT_SCOPE_CLASS_NAME}
            scopedCss={scopedCss}
            showToc={showToc}
            toc={toc}
            tocEmptyLabel={messages.tocEmptyLabel}
            tocTitle={messages.tocTitle}
          />
        ) : (
          <ReadOnlyHtml
            ariaLabel={messages.htmlSourceLabel}
            emptyDescription={messages.markdownPlaceholder}
            emptyTitle={messages.htmlSourceLabel}
            value={hasMarkdown ? exportedDocument : ""}
          />
        )}
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={DEFAULT_DOWNLOAD_NAME}>
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
          variant="outline"
          size="sm"
          disabled={!hasMarkdown}
          onClick={onPrint}
        >
          <FileText data-icon="inline-start" />
          {messages.printHtmlLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OutputCard }
