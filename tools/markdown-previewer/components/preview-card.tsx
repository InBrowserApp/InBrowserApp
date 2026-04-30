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
import { getArticleClassName, getScrollerClassName } from "./preview-styles"

import type { MarkdownPreviewerMessages } from "../types"
import type { PreviewBadge, PreviewTheme, TocItem } from "../types"

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
    | "previewTitle"
    | "printLabel"
    | "sanitizeHtmlLabel"
    | "showOutlineLabel"
    | "slateThemeLabel"
    | "themeLabel"
  >
  hasMarkdown: boolean
  previewTheme: PreviewTheme
  sanitizeHtml: boolean
  showOutline: boolean
  renderedHtml: string
  exportHtml: string
  badges: readonly PreviewBadge[]
  tocItems: readonly TocItem[]
  downloadUrl: string | null
  downloadFileName: string
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
  previewTheme,
  sanitizeHtml,
  showOutline,
  renderedHtml,
  exportHtml,
  badges,
  tocItems,
  downloadUrl,
  downloadFileName,
  onPreviewThemeChange,
  onSanitizeHtmlChange,
  onShowOutlineChange,
  onPrint,
}: PreviewCardProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)

  function scrollToHeading(id: string) {
    const selector = `[id="${id.replace(/"/g, '\\"')}"]`
    const scroller = scrollerRef.current
    const heading = previewRef.current?.querySelector<HTMLElement>(selector)

    if (!scroller || !heading) {
      return
    }

    const scrollerRect = scroller.getBoundingClientRect()
    const headingRect = heading.getBoundingClientRect()
    const targetTop = headingRect.top - scrollerRect.top + scroller.scrollTop

    scroller.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: getScrollBehavior(),
    })
  }

  return (
    <ToolPanelCard className="min-w-0 !gap-0 !py-0">
      <PreviewCardHeader
        messages={messages}
        badges={badges}
        previewTheme={previewTheme}
        sanitizeHtml={sanitizeHtml}
        showOutline={showOutline}
        onPreviewThemeChange={onPreviewThemeChange}
        onSanitizeHtmlChange={onSanitizeHtmlChange}
        onShowOutlineChange={onShowOutlineChange}
      />

      <ToolPanelCardContent className="p-0">
        {hasMarkdown ? (
          <div
            className={cn(
              "grid min-w-0",
              showOutline ? "xl:grid-cols-[minmax(0,1fr)_16rem]" : "grid-cols-1"
            )}
          >
            <div
              ref={scrollerRef}
              role="region"
              aria-label={messages.previewTitle}
              className={getScrollerClassName(previewTheme)}
            >
              <div ref={previewRef} className="max-w-full min-w-0">
                <article
                  className={getArticleClassName(previewTheme)}
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
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
          <Empty className="m-4 border-border/70 bg-muted/20 sm:m-5">
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
