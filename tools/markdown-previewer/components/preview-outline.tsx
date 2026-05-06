import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { FileText } from "@workspace/ui/icons"

import type { MarkdownPreviewerMessages, TocItem } from "../types"

const OUTLINE_BASE_INDENT_REM = 0.25
const OUTLINE_DEPTH_INDENT_REM = 0.85

type PreviewOutlineProps = Readonly<{
  messages: Pick<
    MarkdownPreviewerMessages,
    | "outlineDescription"
    | "outlineEmptyDescription"
    | "outlineEmptyTitle"
    | "outlineTitle"
  >
  tocItems: readonly TocItem[]
  onHeadingClick: (id: string) => void
}>

function PreviewOutline({
  messages,
  tocItems,
  onHeadingClick,
}: PreviewOutlineProps) {
  return (
    <aside className="min-w-0 border-t px-4 py-4 sm:px-6 xl:border-s xl:border-t-0 xl:px-0 xl:py-0 xl:ps-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-base font-semibold">
          {messages.outlineTitle}
        </h2>
        <p className="text-sm text-muted-foreground">
          {messages.outlineDescription}
        </p>
      </div>

      {tocItems.length > 0 ? (
        <div className="mt-3 max-h-72 overflow-x-hidden overflow-y-auto pe-2 [scrollbar-color:rgb(100_116_139/0.45)_transparent] [scrollbar-width:thin] xl:h-[34rem] xl:max-h-none">
          <div className="flex flex-col gap-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="w-full rounded-md px-2.5 py-2 text-start text-sm break-words whitespace-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                style={{
                  paddingInlineStart: `${
                    OUTLINE_BASE_INDENT_REM +
                    Math.max(item.level - 1, 0) * OUTLINE_DEPTH_INDENT_REM
                  }rem`,
                }}
                onClick={() => {
                  onHeadingClick(item.id)
                }}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3">
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
    </aside>
  )
}

export { PreviewOutline }
