import { useId, useMemo, useState } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Check,
  ChevronDown,
  Download,
  TriangleAlert,
} from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

import type { Result } from "./core/batch"
import type EnglishMessages from "./messages/en.json"

const filters = ["all", "passed", "review"] as const
const pageSize = 40
const rowClass =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5"

export default function MetadataResults({
  results,
  language,
  messages,
}: {
  results: Result[]
  language: string
  messages: typeof EnglishMessages
}) {
  const heading = useId()
  const [filter, setFilter] = useState<(typeof filters)[number]>("all")
  const [query, setQuery] = useState("")
  const [visible, setVisible] = useState(pageSize)

  const passed = useMemo(
    () => results.filter(({ issues }) => !issues.length).length,
    [results]
  )
  const counts = {
    all: results.length,
    passed,
    review: results.length - passed,
  }
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(language)
    return results.filter(
      ({ issues, name, source }) =>
        (filter === "all" ||
          (filter === "review") === Boolean(issues.length)) &&
        [name, source].some((text) =>
          text?.toLocaleLowerCase(language).includes(needle)
        )
    )
  }, [filter, language, query, results])

  return (
    <ToolPanelCard role="region" aria-labelledby={heading}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle id={heading} role="heading" aria-level={2}>
          {messages.results}
        </CardTitle>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            downloadBlob(
              new Blob([JSON.stringify(results, null, 2)], {
                type: "application/json",
              }),
              "nft-metadata-report.json"
            )
          }
        >
          <Download data-icon="inline-start" aria-hidden="true" />
          {messages.download}
        </Button>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={status === filter ? "default" : "outline"}
              aria-pressed={status === filter}
              onClick={() => {
                setFilter(status)
                setVisible(pageSize)
              }}
            >
              {messages[status]}
              <span className="tabular-nums">
                {counts[status].toLocaleString(language)}
              </span>
            </Button>
          ))}
          <Input
            type="search"
            aria-label={messages.filter}
            placeholder={messages.filter}
            className="sm:ms-auto sm:w-56"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setVisible(pageSize)
            }}
          />
        </div>
        {filtered.length === 0 ? (
          <p role="status" className="text-sm text-muted-foreground">
            {messages.noMatches}
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {filtered
              .slice(0, visible)
              .map(({ source, name, issues }, index) => {
                const hasIssues = issues.length > 0
                const Icon = hasIssues ? TriangleAlert : Check
                const header = (
                  <>
                    <span className="grid min-w-0 gap-1">
                      {name && (
                        <bdi className="truncate text-sm font-medium">
                          {name}
                        </bdi>
                      )}
                      <bdi className="truncate font-mono text-xs text-muted-foreground">
                        {source}
                      </bdi>
                    </span>
                    <span className="flex flex-wrap items-center justify-end gap-1.5 text-xs">
                      <Icon aria-hidden="true" className="size-4 shrink-0" />
                      <span>
                        {hasIssues ? messages.review : messages.passed}
                      </span>
                      {hasIssues && (
                        <ChevronDown
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground group-open:rotate-180"
                        />
                      )}
                    </span>
                  </>
                )
                return (
                  <li key={`${index}/${source}`}>
                    {hasIssues ? (
                      <details className="group">
                        <summary
                          className={`${rowClass} cursor-pointer list-none hover:bg-muted/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden`}
                        >
                          {header}
                        </summary>
                        <ul className="grid gap-2 border-t bg-muted/20 px-3 py-2.5 text-sm">
                          {issues.map(({ code, field }) => (
                            <li
                              key={`${code}/${field}`}
                              className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                            >
                              {field && (
                                <code
                                  dir="ltr"
                                  className="rounded bg-muted px-1 font-mono text-xs"
                                >
                                  {field}
                                </code>
                              )}
                              {messages[code]}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <div className={rowClass}>{header}</div>
                    )}
                  </li>
                )
              })}
          </ul>
        )}
        {filtered.length > visible && (
          <Button
            type="button"
            variant="outline"
            className="self-start"
            onClick={() => setVisible(visible + pageSize)}
          >
            {messages.more}
          </Button>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
