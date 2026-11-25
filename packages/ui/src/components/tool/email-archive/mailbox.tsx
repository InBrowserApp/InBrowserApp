import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { MailboxStatus } from "./mailbox-status"
import { List, Mail, Search } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type {
  ArchiveMessage,
  ArchiveReply,
  ArchiveRequest,
  MailSummary,
} from "@workspace/email/archive"
import type { Failure } from "@workspace/email"
import { ReadMessage } from "./read-message"
import type { ArchiveMessages, FolderMessages } from "./copy"
import { FolderSelect } from "./folder-select"
import { MailboxPager } from "./mailbox-pager"

type Selection = { id: number; result: ArchiveMessage | null }
const pageSize = 50
const desktop = "(min-width: 48rem)"

export function Mailbox({
  file,
  createWorker,
  folderMessages,
  lang,
  messages: m,
}: {
  file: File
  createWorker: () => Worker
  folderMessages?: FolderMessages
  lang: string
  messages: ArchiveMessages
}) {
  const worker = useRef<Worker | null>(null)
  const lastRow = useRef<HTMLButtonElement>(null)
  const back = useRef<HTMLButtonElement>(null)
  const reader = useRef<HTMLDivElement>(null)
  const [entries, setEntries] = useState<MailSummary[] | null>(null)
  const [folders, setFolders] = useState<string[]>([])
  const [folder, setFolder] = useState("")
  const [error, setError] = useState<Failure | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)
  const list = useRef<HTMLUListElement>(null)
  useEffect(() => {
    let instance: Worker
    try {
      instance = createWorker()
    } catch {
      setError("invalid")
      return
    }
    worker.current = instance
    instance.onmessage = ({ data }: MessageEvent<ArchiveReply>) => {
      if ("id" in data) {
        setSelection((current) =>
          current?.id === data.id ? { id: data.id, result: data } : current
        )
      } else if ("messages" in data) {
        setEntries(data.messages)
        if (data.folders) setFolders(data.folders)
        if (data.messages.length && window.matchMedia(desktop).matches) {
          setSelection({ id: 0, result: null })
          instance.postMessage({ id: 0 } satisfies ArchiveRequest)
        }
      } else {
        setError(data.error)
      }
    }
    instance.onerror = instance.onmessageerror = () => setError("invalid")
    instance.postMessage({ file } satisfies ArchiveRequest)
    return () => instance.terminate()
  }, [createWorker, file])

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
    return rows.filter(
      (row) =>
        (folder === "" || row.folder === Number(folder)) &&
        terms.every((term) => row.search.includes(term))
    )
  }, [folder, query, rows, lang])
  const date = useMemo(
    () => new Intl.DateTimeFormat(lang, { dateStyle: "medium" }),
    [lang]
  )
  const start = page * pageSize
  const end = Math.min(start + pageSize, filtered.length)

  function movePage(next: number) {
    setPage(next)
    if (list.current) list.current.scrollTop = 0
  }
  function select(id: number, row: HTMLButtonElement, keyboard: boolean) {
    lastRow.current = row
    if (id !== selection?.id) {
      setSelection({ id, result: null })
      worker.current?.postMessage({ id } satisfies ArchiveRequest)
    }
    requestAnimationFrame(() => {
      if (!window.matchMedia(desktop).matches) back.current?.focus()
      else if (keyboard) reader.current?.focus()
    })
  }
  function returnToList() {
    setSelection(null)
    requestAnimationFrame(() => lastRow.current?.focus())
  }

  if (error)
    return (
      <MailboxStatus error>
        {error === "resourceLimit" ? m.resourceLimit : m.invalid}
      </MailboxStatus>
    )
  if (!entries) return <MailboxStatus>{m.indexing}</MailboxStatus>
  if (!entries.length && folderMessages)
    return (
      <p
        role="status"
        className="m-auto p-6 text-center text-sm text-muted-foreground"
      >
        {folderMessages.empty}
      </p>
    )
  return (
    <div className="flex min-h-0 flex-1">
      <div
        className={cn(
          "min-w-0 flex-1 flex-col md:flex md:max-w-[42%] md:grow-0 md:basis-[21rem] md:border-e",
          selection ? "hidden" : "flex"
        )}
      >
        <div className="space-y-2 border-b p-3">
          {folderMessages && folders.length > 0 && (
            <FolderSelect
              folders={folders}
              value={folder}
              messages={folderMessages}
              onChange={(next) => {
                setFolder(next)
                setSelection(null)
                movePage(0)
              }}
            />
          )}
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              aria-label={m.search}
              placeholder={m.searchPlaceholder}
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
                    onClick={(event) =>
                      select(row.id, event.currentTarget, event.detail === 0)
                    }
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
            {!query.trim() && folderMessages
              ? folderMessages.emptyFolder
              : m.noResults}
          </p>
        )}
        {filtered.length > 0 && (
          <MailboxPager
            lang={lang}
            count={filtered.length}
            page={page}
            pageSize={pageSize}
            messages={m}
            movePage={movePage}
          />
        )}
      </div>
      <div
        ref={reader}
        role={selection ? "region" : undefined}
        aria-label={selection ? m.messageBody : undefined}
        tabIndex={selection ? -1 : undefined}
        className={cn(
          "min-w-0 flex-1 flex-col",
          selection ? "flex" : "hidden md:flex"
        )}
      >
        {selection ? (
          <>
            <div className="shrink-0 border-b p-2 md:sr-only md:focus-within:not-sr-only md:focus-within:p-2">
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
                <MailboxStatus error>
                  {selection.result.error === "protected"
                    ? m.protected
                    : m.messageError}
                </MailboxStatus>
              )
            ) : (
              <MailboxStatus>{m.loading}</MailboxStatus>
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
