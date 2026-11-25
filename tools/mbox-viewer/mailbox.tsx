import { useEffect, useMemo, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  ChevronLeft,
  ChevronRight,
  List,
  Mail,
  Search,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { MailSummary } from "@workspace/email/mbox"
import type { Failure } from "@workspace/email"
import { ReadMessage } from "./read-message"
import type { Messages } from "./client"
import type { Reply, Request } from "./worker"

type Selection = { id: number; result: Extract<Reply, { id: number }> | null }
const pageSize = 50

export function Mailbox({
  file,
  lang,
  messages: m,
}: {
  file: File
  lang: string
  messages: Messages
}) {
  const worker = useRef<Worker | null>(null)
  const lastRow = useRef<HTMLButtonElement>(null)
  const back = useRef<HTMLButtonElement>(null)
  const [entries, setEntries] = useState<MailSummary[] | null>(null)
  const [error, setError] = useState<Failure | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)
  const list = useRef<HTMLUListElement>(null)
  useEffect(() => {
    let instance: Worker
    try {
      instance = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
    } catch {
      setError("invalid")
      return
    }
    worker.current = instance
    instance.onmessage = ({ data }: MessageEvent<Reply>) => {
      if ("id" in data) {
        setSelection((current) =>
          current?.id === data.id ? { id: data.id, result: data } : current
        )
      } else if ("messages" in data) {
        setEntries(data.messages)
        if (window.matchMedia("(min-width: 48rem)").matches) {
          setSelection({ id: 0, result: null })
          instance.postMessage({ id: 0 } satisfies Request)
        }
      } else {
        setError(data.error)
      }
    }
    instance.onerror = instance.onmessageerror = () => setError("invalid")
    instance.postMessage({ file } satisfies Request)
    return () => instance.terminate()
  }, [file])

  const rows = useMemo(
    () =>
      (entries ?? []).map((entry, id) => ({
        ...entry,
        id,
        search: [entry.subject || m.subjectFallback, entry.from, entry.to]
          .join("\n")
          .toLocaleLowerCase(lang),
      })),
    [entries, lang, m.subjectFallback]
  )
  const filtered = useMemo(() => {
    const terms = query.toLocaleLowerCase(lang).trim().split(/\s+/)
    return rows.filter((row) =>
      terms.every((term) => row.search.includes(term))
    )
  }, [query, rows, lang])
  const date = useMemo(
    () => new Intl.DateTimeFormat(lang, { dateStyle: "medium" }),
    [lang]
  )
  const number = useMemo(() => new Intl.NumberFormat(lang), [lang])
  const start = page * pageSize
  const end = Math.min(start + pageSize, filtered.length)

  function movePage(next: number) {
    setPage(next)
    if (list.current) list.current.scrollTop = 0
  }
  function select(id: number, row: HTMLButtonElement) {
    lastRow.current = row
    if (id !== selection?.id) {
      setSelection({ id, result: null })
      worker.current?.postMessage({ id } satisfies Request)
    }
    requestAnimationFrame(() => back.current?.focus())
  }
  function returnToList() {
    setSelection(null)
    requestAnimationFrame(() => lastRow.current?.focus())
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription role="alert">
            {error === "resourceLimit" ? m.resourceLimit : m.invalid}
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  if (!entries) return <Loading>{m.indexing}</Loading>
  return (
    <div className="flex min-h-0 flex-1">
      <div
        className={cn(
          "min-w-0 flex-1 flex-col md:flex md:max-w-[42%] md:grow-0 md:basis-[21rem] md:border-e",
          selection ? "hidden" : "flex"
        )}
      >
        <div className="border-b p-3">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              aria-label={m.search}
              placeholder={m.search}
              className="ps-9"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                movePage(0)
              }}
            />
          </div>
        </div>
        {filtered.length ? (
          <ul
            ref={list}
            aria-label={m.messageList}
            className="flex-1 overflow-auto"
          >
            {filtered.slice(start, end).map((row) => {
              const parsed = Date.parse(row.date)
              return (
                <li key={row.id} className="border-b last:border-b-0">
                  <button
                    type="button"
                    aria-current={selection?.id === row.id || undefined}
                    onClick={(event) => select(row.id, event.currentTarget)}
                    className="block w-full border-s-2 border-transparent px-3 py-3 text-start hover:bg-muted/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring aria-[current=true]:border-s-primary aria-[current=true]:bg-muted"
                  >
                    <span
                      dir="auto"
                      className="block truncate text-sm font-medium"
                    >
                      {row.subject || m.subjectFallback}
                    </span>
                    <span className="mt-1 flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                      <bdi className="min-w-0 truncate">{row.from}</bdi>
                      {Number.isFinite(parsed) && (
                        <time
                          className="shrink-0"
                          dateTime={new Date(parsed).toISOString()}
                        >
                          {date.format(parsed)}
                        </time>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p
            role="status"
            className="flex-1 px-4 py-8 text-center text-sm text-muted-foreground"
          >
            {m.noResults}
          </p>
        )}
        {filtered.length > 0 && (
          <div className="flex min-h-12 shrink-0 items-center justify-between gap-1 border-t px-3 py-1 text-xs text-muted-foreground">
            <span role="status">
              {m.range.replace(/\{(start|end|total)\}/g, (_, key: string) =>
                number.format(
                  key === "start"
                    ? start + 1
                    : key === "end"
                      ? end
                      : filtered.length
                )
              )}
            </span>
            {filtered.length > pageSize && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={m.previous}
                  title={m.previous}
                  disabled={!page}
                  onClick={() => movePage(page - 1)}
                >
                  <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={m.next}
                  title={m.next}
                  disabled={end === filtered.length}
                  onClick={() => movePage(page + 1)}
                >
                  <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 flex-col",
          selection ? "flex" : "hidden md:flex"
        )}
      >
        {selection ? (
          <>
            <div className="shrink-0 border-b p-2 md:hidden">
              <Button
                ref={back}
                variant="ghost"
                size="sm"
                onClick={returnToList}
              >
                <List aria-hidden="true" data-icon="inline-start" />
                {m.back}
              </Button>
            </div>
            {selection.result ? (
              "email" in selection.result ? (
                <ReadMessage
                  key={selection.id}
                  email={selection.result.email}
                  lang={lang}
                  messages={m}
                />
              ) : (
                <div className="p-4">
                  <Alert variant="destructive">
                    <AlertDescription role="alert">
                      {selection.result.error === "protected"
                        ? m.protected
                        : m.messageError}
                    </AlertDescription>
                  </Alert>
                </div>
              )
            ) : (
              <Loading>{m.loading}</Loading>
            )}
          </>
        ) : (
          <div className="m-auto flex flex-col items-center gap-3 p-6 text-center text-sm text-muted-foreground">
            <Mail aria-hidden="true" className="size-7" />
            {m.choose}
          </div>
        )}
      </div>
    </div>
  )
}

function Loading({ children }: { children: string }) {
  return (
    <p
      role="status"
      className="m-auto flex items-center gap-2 p-6 text-sm text-muted-foreground"
    >
      <Spinner />
      {children}
    </p>
  )
}
