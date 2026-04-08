import hljs from "highlight.js/lib/core"
import json from "highlight.js/lib/languages/json"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@workspace/ui/components/ui/empty"
import { Search, TriangleAlert } from "@workspace/ui/icons"

if (!hljs.getLanguage("json")) {
  hljs.registerLanguage("json", json)
}

type HighlightedResultProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  errorDescription: string
  errorTitle: string
  state: "empty" | "error" | "success"
  value: string
}>

function HighlightedResult({
  ariaLabel,
  emptyDescription,
  errorDescription,
  errorTitle,
  state,
  value,
}: HighlightedResultProps) {
  if (state === "empty") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="result-highlight-surface flex min-h-80 w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <Empty className="min-h-80 border-0 p-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="result-highlight-surface flex min-h-80 w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <Alert variant="destructive" className="min-h-80 content-start">
          <TriangleAlert />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{errorDescription}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const highlightedResult = hljs.highlight(value, {
    language: "json",
  }).value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="result-highlight-surface min-h-80 w-full rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      <pre className="result-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedResult }} />
      </pre>
    </div>
  )
}

export { HighlightedResult }
