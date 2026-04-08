import hljs from "highlight.js/lib/core"
import yaml from "highlight.js/lib/languages/yaml"

import { TriangleAlert } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

if (!hljs.getLanguage("yaml")) {
  hljs.registerLanguage("yaml", yaml)
}

type HighlightedComposeProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  errorDescription: string
  errorTitle: string
  state: "empty" | "error" | "success"
  value: string
}>

function HighlightedCompose({
  ariaLabel,
  emptyDescription,
  errorDescription,
  errorTitle,
  state,
  value,
}: HighlightedComposeProps) {
  if (state === "empty") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="compose-highlight-surface flex min-h-80 w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <div className="compose-highlight-empty flex min-h-80 items-center">
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
          "compose-highlight-surface flex min-h-80 w-full flex-1 items-stretch rounded-lg border bg-transparent px-2.5 py-2",
          "border-destructive/50"
        )}
      >
        <div
          role="alert"
          className="compose-highlight-error flex min-h-80 items-start gap-3"
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

  const highlightedCompose = hljs.highlight(value, {
    language: "yaml",
  }).value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="compose-highlight-surface min-h-80 w-full rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      <pre className="compose-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedCompose }} />
      </pre>
    </div>
  )
}

export { HighlightedCompose }
