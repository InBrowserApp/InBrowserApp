import { useMemo } from "react"
import hljs from "highlight.js/lib/core"
import sql from "highlight.js/lib/languages/sql"

hljs.registerLanguage("sql", sql)

type HighlightedSqlProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  errorDescription: string
  errorTitle: string
  state: "empty" | "error" | "success"
  value: string
}>

function HighlightedSql({
  ariaLabel,
  emptyDescription,
  errorDescription,
  errorTitle,
  state,
  value,
}: HighlightedSqlProps) {
  const highlightedHtml = useMemo(() => {
    if (state !== "success") {
      return ""
    }

    return hljs.highlight(value, {
      language: "sql",
    }).value
  }, [state, value])

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      {state === "empty" ? (
        <div className="sql-highlight-empty flex h-[18em] items-center text-sm leading-6 text-muted-foreground">
          <p>{emptyDescription}</p>
        </div>
      ) : null}

      {state === "error" ? (
        <div
          role="alert"
          className="sql-highlight-error flex h-[18em] flex-col justify-center gap-2 text-sm"
        >
          <p className="font-medium text-destructive">{errorTitle}</p>
          <p className="leading-6 text-muted-foreground">{errorDescription}</p>
        </div>
      ) : null}

      {state === "success" ? (
        <div className="sql-highlight-surface h-[18em]">
          <pre className="sql-highlight">
            <code
              className="hljs language-sql"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </pre>
        </div>
      ) : null}
    </div>
  )
}

export { HighlightedSql }
