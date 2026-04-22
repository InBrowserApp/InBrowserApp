import { useRef } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, Eye, EyeOff, FileText, Moon, Sun } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { getArticleClassName, getSurfaceClassName } from "./preview-styles"

import type { MarkdownPreviewerMessages } from "../types"
import type { PreviewBadge, PreviewMode, PreviewTheme, TocItem } from "../types"

type PreviewCardProps = Readonly<{
  messages: Pick<
    MarkdownPreviewerMessages,
    | "copiedLabel"
    | "copyHtmlLabel"
    | "downloadHtmlLabel"
    | "outlineDescription"
    | "outlineEmptyDescription"
    | "outlineEmptyTitle"
    | "outlineTitle"
    | "paperThemeLabel"
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
      behavior: "smooth",
    })
  }

  return (
    <ToolPanelCard>
      <CardHeader className="gap-4 border-b">
        <div className="space-y-2">
          <CardTitle>{messages.previewTitle}</CardTitle>
          <CardDescription>{messages.previewDescription}</CardDescription>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={previewMode === "split" ? "secondary" : "outline"}
              onClick={() => {
                onPreviewModeChange("split")
              }}
            >
              <Eye data-icon="inline-start" />
              {messages.splitViewLabel}
            </Button>

            <Button
              type="button"
              size="sm"
              variant={previewMode === "preview" ? "secondary" : "outline"}
              onClick={() => {
                onPreviewModeChange("preview")
              }}
            >
              <EyeOff data-icon="inline-start" />
              {messages.previewOnlyLabel}
            </Button>

            <Button
              type="button"
              size="sm"
              variant={previewTheme === "paper" ? "secondary" : "outline"}
              onClick={() => {
                onPreviewThemeChange("paper")
              }}
            >
              <Sun data-icon="inline-start" />
              {messages.paperThemeLabel}
            </Button>

            <Button
              type="button"
              size="sm"
              variant={previewTheme === "slate" ? "secondary" : "outline"}
              onClick={() => {
                onPreviewThemeChange("slate")
              }}
            >
              <Moon data-icon="inline-start" />
              {messages.slateThemeLabel}
            </Button>
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={sanitizeHtml}
                onCheckedChange={onSanitizeHtmlChange}
                aria-label={messages.sanitizeHtmlLabel}
              />
              <span>{messages.sanitizeHtmlLabel}</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={showOutline}
                onCheckedChange={onShowOutlineChange}
                aria-label={messages.showOutlineLabel}
              />
              <span>{messages.showOutlineLabel}</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge
                key={badge.key}
                variant="secondary"
                className="gap-2 rounded-full px-3 py-1"
              >
                <span>{badge.label}</span>
                <span className="font-medium text-foreground">
                  {badge.value}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <ToolPanelCardContent className="p-6">
        {hasMarkdown ? (
          <div
            className={cn(
              "grid gap-4",
              showOutline ? "xl:grid-cols-[minmax(0,1fr)_17rem]" : "grid-cols-1"
            )}
          >
            <div className={getSurfaceClassName(previewTheme)}>
              <ScrollArea className="h-[36rem]">
                <div ref={previewRef}>
                  <article
                    className={getArticleClassName(previewTheme)}
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                </div>
              </ScrollArea>
            </div>

            {showOutline ? (
              <div className="rounded-[24px] border bg-muted/20">
                <div className="border-b px-5 py-4">
                  <h2 className="font-heading text-base font-semibold">
                    {messages.outlineTitle}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {messages.outlineDescription}
                  </p>
                </div>

                {tocItems.length > 0 ? (
                  <ScrollArea className="h-[36rem] px-3 py-3">
                    <div className="space-y-1">
                      {tocItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          style={{
                            paddingInlineStart: `${item.level * 0.8}rem`,
                          }}
                          onClick={() => {
                            scrollToHeading(item.id)
                          }}
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="p-4">
                    <Empty className="border-border/70 bg-transparent">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <FileText />
                        </EmptyMedia>
                        <EmptyTitle>{messages.outlineEmptyTitle}</EmptyTitle>
                        <EmptyDescription>
                          {messages.outlineEmptyDescription}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </div>
                )}
              </div>
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

      <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t px-6 py-4">
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
          {messages.printLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { PreviewCard }
