import hljs from "highlight.js/lib/core"
import json from "highlight.js/lib/languages/json"

import { TriangleAlert } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

if (!hljs.getLanguage("json")) {
  hljs.registerLanguage("json", json)
}

type HighlightedJsonProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  errorDescription: string
  errorTitle: string
  state: "empty" | "error" | "success"
  value: string
}>

function HighlightedJson({
  ariaLabel,
  emptyDescription,
  errorDescription,
  errorTitle,
  state,
  value,
}: HighlightedJsonProps) {
  if (state === "empty") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="json-highlight-surface flex min-h-80 w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <div className="json-highlight-empty flex min-h-80 items-center">
          <p className="text-sm leading-6 text-muted-foreground">
            {emptyDescription}
          </p>
        </div>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className={cn(
          "json-highlight-surface flex min-h-80 w-full flex-1 items-stretch rounded-lg border bg-transparent px-2.5 py-2",
          "border-destructive/50"
        )}
      >
        <div
          role="alert"
          className="json-highlight-error flex min-h-80 items-start gap-3"
        >
          <TriangleAlert className="mt-0.5 shrink-0 text-destructive" />
          <div className="flex flex-col gap-1">
            <p className="font-heading text-sm font-medium text-destructive">
              {errorTitle}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {errorDescription}
            </p>
          </div>
        </div>
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
      className="json-highlight-surface min-h-80 w-full rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      <pre className="json-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
      </pre>
    </div>
  )
}

export { HighlightedJson }
