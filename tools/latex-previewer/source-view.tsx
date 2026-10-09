import { useState } from "react"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"
import { sourceSection } from "./core/source-section"
import type { Messages } from "./types"

export function SourceView({
  source,
  messages: m,
}: {
  source: string
  messages: Messages
}) {
  const [page, setPage] = useState(1)
  const section = sourceSection(source, page)
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {section.count > 1 ? (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-1">
          <span className="text-xs text-muted-foreground">
            {m.sourceSection}
          </span>
          <div className="flex items-center gap-1">
            <DocumentIconButton
              label={m.previousSourceSection}
              disabled={section.page === 1}
              onClick={() => setPage(section.page - 1)}
            >
              <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
            </DocumentIconButton>
            <DocumentNumberInput
              aria-label={m.sourceSection}
              className="w-20"
              value={section.page}
              min={1}
              max={section.count}
              onCommit={setPage}
            />
            <span className="text-xs tabular-nums" aria-live="polite">
              / {section.count}
            </span>
            <DocumentIconButton
              label={m.nextSourceSection}
              disabled={section.page === section.count}
              onClick={() => setPage(section.page + 1)}
            >
              <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
            </DocumentIconButton>
          </div>
        </div>
      ) : null}
      <Textarea
        key={section.page}
        aria-label={m.sourceLabel}
        value={section.text}
        readOnly
        wrap="off"
        spellCheck={false}
        dir="ltr"
        style={{ fieldSizing: "fixed" }}
        className="h-full min-h-0 flex-1 resize-none rounded-none border-0 font-mono text-sm"
      />
    </div>
  )
}
