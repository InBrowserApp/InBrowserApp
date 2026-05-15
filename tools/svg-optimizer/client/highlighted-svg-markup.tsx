import hljs from "highlight.js/lib/core"
import xml from "highlight.js/lib/languages/xml"

if (!hljs.getLanguage("xml")) {
  hljs.registerLanguage("xml", xml)
}

type HighlightedSvgMarkupProps = Readonly<{
  ariaLabel: string
  value: string
}>

function HighlightedSvgMarkup({ ariaLabel, value }: HighlightedSvgMarkupProps) {
  const highlightedSvg = hljs.highlight(value, {
    language: "xml",
  }).value

  return (
    <div
      aria-label={ariaLabel}
      className="svg-markup-highlight-surface rounded-lg border border-input bg-transparent px-2.5 py-2"
      role="region"
    >
      <pre className="svg-markup-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedSvg }} />
      </pre>
    </div>
  )
}

export { HighlightedSvgMarkup }
