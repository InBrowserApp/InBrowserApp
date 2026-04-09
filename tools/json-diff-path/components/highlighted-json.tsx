import hljs from "highlight.js/lib/core"
import json from "highlight.js/lib/languages/json"

if (!hljs.getLanguage("json")) {
  hljs.registerLanguage("json", json)
}

type HighlightedJsonProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  value: string
}>

function HighlightedJson({
  ariaLabel,
  emptyDescription,
  value,
}: HighlightedJsonProps) {
  if (value.trim() === "") {
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
