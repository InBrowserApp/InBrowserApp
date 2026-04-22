import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { FileText } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { TocItem } from "../types"

type PreviewSurfaceProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  emptyTitle: string
  html: string
  scopeClassName: string
  scopedCss: string
  showToc: boolean
  toc: readonly TocItem[]
  tocEmptyLabel: string
  tocTitle: string
}>

function PreviewSurface({
  ariaLabel,
  emptyDescription,
  emptyTitle,
  html,
  scopeClassName,
  scopedCss,
  showToc,
  toc,
  tocEmptyLabel,
  tocTitle,
}: PreviewSurfaceProps) {
  const hasContent = html.trim().length > 0

  return (
    <div
      className={cn(
        "grid min-h-0 gap-4",
        showToc && hasContent
          ? "xl:grid-cols-[minmax(0,1fr)_18rem]"
          : "grid-cols-1"
      )}
    >
      <div className="min-h-0 overflow-hidden rounded-xl border bg-background">
        <ScrollArea
          role="region"
          aria-label={ariaLabel}
          className="h-[32rem] min-h-0"
        >
          {hasContent ? (
            <>
              <style>{scopedCss}</style>
              <div className={cn(scopeClassName, "px-5 py-5")}>
                <article
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </>
          ) : (
            <Empty className="min-h-[32rem] rounded-none border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>{emptyTitle}</EmptyTitle>
                <EmptyDescription>{emptyDescription}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </ScrollArea>
      </div>

      {showToc && hasContent ? (
        <div className="min-h-0 overflow-hidden rounded-xl border bg-background">
          <div className="border-b px-4 py-3">
            <div className="text-sm font-medium">{tocTitle}</div>
          </div>
          <ScrollArea className="h-[32rem] min-h-0">
            {toc.length > 0 ? (
              <div className="flex flex-col gap-1 px-2 py-2">
                {toc.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="rounded-md px-2 py-1.5 text-left text-sm text-foreground/80 transition hover:bg-muted hover:text-foreground"
                    style={{
                      paddingInlineStart: `${Math.max(item.level - 1, 0) * 12}px`,
                    }}
                    onClick={() => {
                      document
                        .getElementById(item.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-4 text-sm text-muted-foreground">
                {tocEmptyLabel}
              </div>
            )}
          </ScrollArea>
        </div>
      ) : null}
    </div>
  )
}

export { PreviewSurface }
