import hljs from "highlight.js/lib/core"
import xml from "highlight.js/lib/languages/xml"

if (!hljs.getLanguage("xml")) {
  hljs.registerLanguage("xml", xml)
}

type HighlightedHtmlProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  emptyTitle: string
  value: string
}>

function HighlightedHtml({
  ariaLabel,
  emptyDescription,
  emptyTitle,
  value,
}: HighlightedHtmlProps) {
  if (value.trim() === "") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="html-highlight-surface flex min-h-[28rem] w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <div className="html-highlight-empty">
          <p className="font-mono text-sm text-muted-foreground">
            {emptyTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {emptyDescription}
          </p>
        </div>
      </div>
    )
  }

  const highlightedHtml = hljs.highlight(value, {
    language: "xml",
  }).value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="html-highlight-surface min-h-[28rem] w-full rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      <pre className="html-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  )
}

export { HighlightedHtml }
