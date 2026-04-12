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
      className="json-schema-highlight-surface h-80 w-full rounded-lg border border-input bg-transparent"
    >
      <ScrollArea className="h-full w-full">
        <pre className="json-schema-highlight hljs px-2.5 py-2">
          <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
        </pre>
      </ScrollArea>
    </div>
  )
}

export { HighlightedJson }
