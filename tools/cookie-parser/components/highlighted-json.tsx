import hljs from "highlight.js/lib/core"
import json from "highlight.js/lib/languages/json"

import { cn } from "@workspace/ui/lib/utils"

if (!hljs.getLanguage("json")) {
  hljs.registerLanguage("json", json)
}

type HighlightedJsonProps = Readonly<{
  ariaLabel: string
  className?: string
  emptyDescription: string
  value: string
}>

function HighlightedJson({
  ariaLabel,
  className,
  emptyDescription,
  value,
}: HighlightedJsonProps) {
  if (value.trim() === "") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className={cn(
          "json-highlight-surface flex min-h-72 w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2",
          className
        )}
      >
        <div className="json-highlight-empty flex min-h-72 items-center">
          <p className="text-sm leading-6 text-muted-foreground">
            {emptyDescription}
          </p>
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
      className={cn(
        "json-highlight-surface min-h-72 w-full rounded-lg border border-input bg-transparent px-2.5 py-2",
        className
      )}
    >
      <pre className="json-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
      </pre>
    </div>
  )
}

export { HighlightedJson }
