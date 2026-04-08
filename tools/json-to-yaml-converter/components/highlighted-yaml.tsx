import hljs from "highlight.js/lib/core"
import yaml from "highlight.js/lib/languages/yaml"

if (!hljs.getLanguage("yaml")) {
  hljs.registerLanguage("yaml", yaml)
}

type HighlightedYamlProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  emptyTitle: string
  value: string
}>

function HighlightedYaml({
  ariaLabel,
  emptyDescription,
  emptyTitle,
  value,
}: HighlightedYamlProps) {
  if (value.trim() === "") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="yaml-highlight-surface flex min-h-80 w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <div className="yaml-highlight-empty">
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

  const highlightedYaml = hljs.highlight(value, {
    language: "yaml",
  }).value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="yaml-highlight-surface min-h-80 w-full rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      <pre className="yaml-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedYaml }} />
      </pre>
    </div>
  )
}

export { HighlightedYaml }
