import type { ReactNode } from "react"

import hljs from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"

if (!hljs.getLanguage("typescript")) {
  hljs.registerLanguage("typescript", typescript)
}

type HighlightedTypescriptProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  errorDescription?: string
  errorDetails?: ReactNode
  errorTitle: string
  state: "empty" | "error" | "success"
  value: string
}>

function HighlightedTypescript({
  ariaLabel,
  emptyDescription,
  errorDescription,
  errorDetails,
  errorTitle,
  state,
  value,
}: HighlightedTypescriptProps) {
  if (state === "empty") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="typescript-highlight-surface flex min-h-80 w-full flex-1 items-stretch rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <div className="typescript-highlight-empty flex min-h-80 items-center">
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
        className="typescript-highlight-surface flex min-h-80 w-full rounded-lg border border-destructive/40 bg-transparent px-2.5 py-2"
      >
        <div
          role="alert"
          className="typescript-highlight-error flex min-h-80 flex-col gap-2"
        >
          <p className="font-medium text-destructive">{errorTitle}</p>
          {errorDescription ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {errorDescription}
            </p>
          ) : null}
          {errorDetails}
        </div>
      </div>
    )
  }

  const highlightedTypescript = hljs.highlight(value, {
    language: "typescript",
  }).value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="typescript-highlight-surface min-h-80 w-full rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      <pre className="typescript-highlight hljs">
        <code dangerouslySetInnerHTML={{ __html: highlightedTypescript }} />
      </pre>
    </div>
  )
}

export { HighlightedTypescript }
