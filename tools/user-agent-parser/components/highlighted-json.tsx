import hljs from "highlight.js/lib/core"
import json from "highlight.js/lib/languages/json"

import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"

if (!hljs.getLanguage("json")) {
  hljs.registerLanguage("json", json)
}

type HighlightedJsonProps = Readonly<{
  ariaLabel: string
  value: string
}>

function HighlightedJson({ ariaLabel, value }: HighlightedJsonProps) {
  const highlightedJson = hljs.highlight(value, {
    language: "json",
  }).value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border/70 bg-muted/10"
    >
      <ScrollArea className="h-full w-full">
        <pre className="json-highlight hljs min-h-full p-4 text-sm leading-6 break-all whitespace-pre-wrap">
          <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
        </pre>
      </ScrollArea>
    </div>
  )
}

export { HighlightedJson }
