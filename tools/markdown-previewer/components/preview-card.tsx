import { useRef } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, FileText, Printer } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { PreviewCardHeader } from "./preview-card-header"
import { PreviewOutline } from "./preview-outline"
import { getArticleClassName, getSurfaceClassName } from "./preview-styles"

import type { MarkdownPreviewerMessages } from "../types"
import type { PreviewBadge, PreviewMode, PreviewTheme, TocItem } from "../types"

type PreviewCardProps = Readonly<{
  messages: Pick<
    MarkdownPreviewerMessages,
    | "cleanThemeLabel"
    | "copiedLabel"
    | "copyHtmlLabel"
    | "downloadHtmlLabel"
    | "outlineDescription"
    | "outlineEmptyDescription"
    | "outlineEmptyTitle"
    | "outlineTitle"
    | "previewDescription"
    | "previewEmptyDescription"
    | "previewEmptyTitle"
    | "previewOnlyLabel"
    | "previewTitle"
    | "printLabel"
    | "sanitizeHtmlLabel"
    | "showOutlineLabel"
    | "slateThemeLabel"
    | "splitViewLabel"
    | "themeLabel"
  >
  hasMarkdown: boolean
  previewMode: PreviewMode
  previewTheme: PreviewTheme
  sanitizeHtml: boolean
  showOutline: boolean
  renderedHtml: string
  exportHtml: string
  badges: readonly PreviewBadge[]
  tocItems: readonly TocItem[]
  downloadUrl: string | null
  downloadFileName: string
  onPreviewModeChange: (value: PreviewMode) => void
  onPreviewThemeChange: (value: PreviewTheme) => void
  onSanitizeHtmlChange: (value: boolean) => void
  onShowOutlineChange: (value: boolean) => void
  onPrint: () => void
}>

function getScrollBehavior(): ScrollBehavior {
  if (typeof window.matchMedia !== "function") {
    return "smooth"
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth"
}

function PreviewCard({
  messages,
  hasMarkdown,
  previewMode,
  previewTheme,
  sanitizeHtml,
  showOutline,
  renderedHtml,
  exportHtml,
  badges,
  tocItems,
  downloadUrl,
  downloadFileName,
  onPreviewModeChange,
  onPreviewThemeChange,
  onSanitizeHtmlChange,
  onShowOutlineChange,
  onPrint,
}: PreviewCardProps) {
  const previewRef = useRef<HTMLDivElement | null>(null)

  function scrollToHeading(id: string) {
    const selector = `[id="${id.replace(/"/g, '\\"')}"]`
    const heading = previewRef.current?.querySelector<HTMLElement>(selector)

    heading?.scrollIntoView({
      block: "start",
      behavior: getScrollBehavior(),
    })
  }

  return (
    <ToolPanelCard className="min-w-0 !gap-0 !py-0">
      <PreviewCardHeader
        messages={messages}
        badges={badges}
        previewMode={previewMode}
        previewTheme={previewTheme}
        sanitizeHtml={sanitizeHtml}
        showOutline={showOutline}
        onPreviewModeChange={onPreviewModeChange}
        onPreviewThemeChange={onPreviewThemeChange}
        onSanitizeHtmlChange={onSanitizeHtmlChange}
        onShowOutlineChange={onShowOutlineChange}
      />

      <ToolPanelCardContent className="p-4 sm:p-5">
        {hasMarkdown ? (
          <div
            className={cn(
              "grid min-w-0 gap-4",
              showOutline ? "xl:grid-cols-[minmax(0,1fr)_16rem]" : "grid-cols-1"
            )}
          >
            <div className={getSurfaceClassName(previewTheme)}>
              <div className="h-[30rem] max-w-full overflow-x-hidden overflow-y-auto sm:h-[34rem]">
                <div ref={previewRef} className="max-w-full min-w-0">
                  <article
                    className={getArticleClassName(previewTheme)}
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                </div>
              </div>
            </div>

            {showOutline ? (
              <PreviewOutline
                messages={messages}
                tocItems={tocItems}
                onHeadingClick={scrollToHeading}
              />
            ) : null}
          </div>
        ) : (
          <Empty className="border-border/70 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.previewEmptyTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.previewEmptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-2 border-t px-5 py-3 sm:justify-end sm:px-6">
        <ToolCopyButton
          value={exportHtml}
          copyLabel={messages.copyHtmlLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!hasMarkdown}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFileName}>
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
          onClick={onPrint}
          disabled={!hasMarkdown}
        >
          <Printer data-icon="inline-start" />
          {messages.printLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { PreviewCard }
