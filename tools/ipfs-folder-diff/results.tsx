import { useId, useMemo, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ChevronDown,
  Download,
  Minus,
  FilePenLine,
  Plus,
} from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

import type { ChangeKind, FolderDiff } from "./core/folder-diff"
import type EnglishMessages from "./messages/en.json"

const filters = ["all", "added", "removed", "changed"] as const
const icons = { added: Plus, removed: Minus, changed: FilePenLine }
const pageSize = 40

export default function FolderDiffResults({
  result,
  language,
  messages,
}: {
  result: FolderDiff
  language: string
  messages: typeof EnglishMessages
}) {
  const headingId = useId()
  const [kind, setKind] = useState<"all" | ChangeKind>("all")
  const [query, setQuery] = useState("")
  const [visible, setVisible] = useState(pageSize)
  const { changes, unchecked } = result
  const counts = useMemo(() => {
    const totals = { all: changes.length, added: 0, removed: 0, changed: 0 }
    for (const change of changes) totals[change.kind]++
    return totals
  }, [changes])
  const needle = query.trim().toLocaleLowerCase(language)
  const filtered = useMemo(
    () =>
      changes.filter(
        (change) =>
          (kind === "all" || change.kind === kind) &&
          (!needle || change.path.toLocaleLowerCase(language).includes(needle))
      ),
    [changes, kind, language, needle]
  )

  return (
    <ToolPanelCard role="region" aria-labelledby={headingId}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>
          <h2 id={headingId}>{messages.results}</h2>
        </CardTitle>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            downloadBlob(
              new Blob([JSON.stringify(result, null, 2)], {
                type: "application/json",
              }),
              "ipfs-folder-diff.json"
            )
          }
        >
          <Download data-icon="inline-start" aria-hidden="true" />
          {messages.download}
        </Button>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        {unchecked.length > 0 && (
          <div
            role="status"
            className="grid gap-2 rounded-lg border bg-muted/30 p-3 text-sm"
          >
            <p>{messages.partial}</p>
            <ul className="grid max-h-32 list-disc gap-1 overflow-auto ps-5 text-muted-foreground">
              {unchecked.map((path) => (
                <li key={path} className="wrap-anywhere">
                  <bdi>{path || messages.root}</bdi>
                </li>
              ))}
            </ul>
          </div>
        )}
        {changes.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  type="button"
                  size="sm"
                  variant={kind === filter ? "default" : "outline"}
                  aria-pressed={kind === filter}
                  onClick={() => {
                    setKind(filter)
                    setVisible(pageSize)
                  }}
                >
                  {messages[filter]}
                  <span className="tabular-nums">
                    {counts[filter].toLocaleString(language)}
                  </span>
                </Button>
              ))}
              <Input
                type="search"
                className="sm:ms-auto sm:w-56"
                placeholder={messages.filter}
                aria-label={messages.filter}
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
                {filtered.slice(0, visible).map((change) => {
                  const Icon = icons[change.kind]
                  return (
                    <li key={change.path}>
                      <details className="group">
                        <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 p-2.5 text-sm hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-3 sm:p-3 [&::-webkit-details-marker]:hidden">
                          <span className="flex w-fit items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                            <Icon
                              aria-hidden="true"
                              className="size-3.5 shrink-0"
                            />
                            {messages[change.kind]}
                          </span>
                          <bdi className="col-span-2 row-start-2 font-mono wrap-anywhere sm:col-span-1 sm:col-start-2 sm:row-start-1">
                            {change.path}
                          </bdi>
                          <ChevronDown
                            aria-hidden="true"
                            className="col-start-2 row-start-1 size-4 text-muted-foreground group-open:rotate-180 sm:col-start-3"
                          />
                        </summary>
                        <dl className="grid gap-2 border-t bg-muted/20 p-3">
                          {(["before", "after"] as const).map((side) => {
                            const cid = change[side]
                            const label = messages[`${side}Cid`]
                            return (
                              cid && (
                                <div key={side} className="grid gap-1">
                                  <dt className="text-xs font-medium text-muted-foreground">
                                    {label}
                                  </dt>
                                  <dd className="flex items-start justify-between gap-2">
                                    <code
                                      dir="ltr"
                                      className="text-xs wrap-anywhere"
                                    >
                                      {cid}
                                    </code>
                                    <ToolCopyButton
                                      value={cid}
                                      copyLabel={messages.copy}
                                      copiedLabel={messages.copied}
                                      ariaLabel={`${messages.copy} · ${label}`}
                                    />
                                  </dd>
                                </div>
                              )
                            )
                          })}
                        </dl>
                      </details>
                    </li>
                  )
                })}
              </ul>
            )}
            {filtered.length > visible && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisible(visible + pageSize)}
                className="self-start"
              >
                {messages.more}
              </Button>
            )}
          </>
        ) : (
          unchecked.length === 0 && (
            <p
              role="status"
              className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground"
            >
              {messages.noChanges}
            </p>
          )
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
