import hljs from "highlight.js/lib/core"
import json from "highlight.js/lib/languages/json"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { FileJson2 } from "@workspace/ui/icons"

if (!hljs.getLanguage("json")) {
  hljs.registerLanguage("json", json)
}

type HighlightedJsonProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  emptyTitle: string
  value: string
}>

function HighlightedJson({
  ariaLabel,
  emptyDescription,
  emptyTitle,
  value,
}: HighlightedJsonProps) {
  if (value.trim() === "") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="flex min-h-80 flex-1 items-stretch"
      >
        <Empty className="min-h-80 border border-dashed border-border/80 bg-muted/20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileJson2 />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  const highlightedJson = hljs.highlight(value, {
    language: "json",
  }).value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="json-highlight-surface min-h-80"
    >
      <pre className="json-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
      </pre>
    </div>
  )
}

export { HighlightedJson }
