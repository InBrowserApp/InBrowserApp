import hljs from "highlight.js/lib/core"
import markdown from "highlight.js/lib/languages/markdown"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

if (!hljs.getLanguage("markdown")) {
  hljs.registerLanguage("markdown", markdown)
}

type HighlightedMarkdownProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  errorDescription: string
  errorTitle: string
  state: "empty" | "error" | "success"
  value: string
}>

function HighlightedMarkdown({
  ariaLabel,
  emptyDescription,
  errorDescription,
  errorTitle,
  state,
  value,
}: HighlightedMarkdownProps) {
  if (state === "empty") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="markdown-highlight-surface flex min-h-96 w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <div className="markdown-highlight-empty flex min-h-96 items-center">
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
        className="markdown-highlight-surface flex min-h-96 w-full items-start rounded-lg border border-destructive/50 bg-transparent px-2.5 py-2"
      >
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{errorDescription}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const highlightedMarkdown = hljs.highlight(value, {
    language: "markdown",
  }).value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="markdown-highlight-surface min-h-96 w-full rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      <pre className="markdown-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedMarkdown }} />
      </pre>
    </div>
  )
}

export { HighlightedMarkdown }
