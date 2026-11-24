import { useEffect, useId, useState } from "react"
import type { FormEvent } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Redo2,
  Undo2,
} from "@workspace/ui/icons"
import { ByteGrid } from "./byte-grid"
import { PAGE_SIZE, pageStart, parseOffset, patchedFile } from "./core/bytes"
import { emptyHistory, overwrite, redo, undo } from "./core/history"
import type { Messages } from "./types"

type Page = { start: number; bytes: Uint8Array | null }

export function Workspace({
  file,
  messages,
  lang,
}: {
  file: File
  messages: Messages
  lang: string
}) {
  const [selection, setSelection] = useState({ offset: 0, focus: false })
  const [page, setPage] = useState<Page>()
  const [history, setHistory] = useState(emptyHistory)
  const [invalidOffset, setInvalidOffset] = useState(false)
  const jumpId = useId()
  const hintId = useId()
  const start = pageStart(selection.offset)
  const currentPage = page?.start === start ? page : undefined
  const previousChange = history.past.at(-1)
  const nextChange = history.future.at(-1)

  useEffect(() => {
    if (file.size === 0) return
    let canceled = false
    file
      .slice(start, start + PAGE_SIZE)
      .arrayBuffer()
      .then(
        (buffer) => {
          if (!canceled) setPage({ start, bytes: new Uint8Array(buffer) })
        },
        () => {
          if (!canceled) setPage({ start, bytes: null })
        }
      )
    return () => {
      canceled = true
    }
  }, [file, start])

  function select(position: number, focus = false) {
    setSelection((current) =>
      current.offset === position && !focus
        ? current
        : { offset: position, focus }
    )
  }

  function jump(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const position = parseOffset(
      String(new FormData(event.currentTarget).get("offset")),
      file.size
    )
    setInvalidOffset(position === null)
    if (position !== null) select(position, true)
  }

  function download() {
    const blob = history.edits.size ? patchedFile(file, history.edits) : file
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = file.name
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const formatter = new Intl.NumberFormat(lang)
  const pageLabel = messages.page
    .replace("{current}", formatter.format(start / PAGE_SIZE + 1))
    .replace("{total}", formatter.format(Math.ceil(file.size / PAGE_SIZE)))

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        {file.size > 0 && (
          <form
            noValidate
            className="grid w-full max-w-60 gap-1 sm:w-auto"
            onSubmit={jump}
          >
            <label htmlFor={jumpId} className="text-xs font-medium">
              {messages.jumpOffset}
            </label>
            <div className="flex items-center gap-2">
              <Input
                id={jumpId}
                name="offset"
                dir="ltr"
                autoComplete="off"
                spellCheck={false}
                placeholder="0x1A…"
                aria-invalid={invalidOffset}
                aria-describedby={invalidOffset ? hintId : undefined}
                className="h-8 w-32 font-mono"
                onChange={() => setInvalidOffset(false)}
              />
              <Button type="submit" size="sm" variant="outline">
                {messages.go}
              </Button>
            </div>
            {invalidOffset && (
              <p id={hintId} role="status" className="text-xs text-destructive">
                {messages.offsetError}
              </p>
            )}
          </form>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {file.size > 0 && (
            <>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                disabled={!previousChange}
                aria-label={messages.undo}
                title={messages.undo}
                onClick={() => {
                  if (!previousChange) return
                  setHistory(undo(history, previousChange))
                  select(previousChange.offset, true)
                }}
              >
                <Undo2 aria-hidden="true" className="rtl:scale-x-[-1]" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                disabled={!nextChange}
                aria-label={messages.redo}
                title={messages.redo}
                onClick={() => {
                  if (!nextChange) return
                  setHistory(redo(history, nextChange))
                  select(nextChange.offset, true)
                }}
              >
                <Redo2 aria-hidden="true" className="rtl:scale-x-[-1]" />
              </Button>
            </>
          )}
          <Button type="button" size="sm" onClick={download}>
            <Download aria-hidden="true" data-icon="inline-start" />
            {messages.download}
          </Button>
        </div>
      </div>

      {currentPage?.bytes ? (
        <ByteGrid
          bytes={currentPage.bytes}
          start={start}
          size={file.size}
          selection={selection}
          edits={history.edits}
          messages={messages}
          onSelect={select}
          onMove={(position) => select(position, true)}
          onOverwrite={(position, original, value) => {
            setHistory((current) =>
              overwrite(current, position, original, value)
            )
            if (position + 1 < file.size) select(position + 1, true)
          }}
        />
      ) : (
        <p
          role="status"
          className="rounded-lg border bg-muted/35 px-4 py-8 text-center text-sm text-muted-foreground"
        >
          {file.size === 0
            ? messages.emptyFile
            : currentPage
              ? messages.readError
              : messages.loading}
        </p>
      )}

      {file.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">{messages.editHint}</p>
          {file.size > PAGE_SIZE && (
            <div className="flex items-center gap-2">
              <Button
                size="icon-sm"
                variant="outline"
                type="button"
                disabled={start === 0}
                aria-label={messages.previousPage}
                title={messages.previousPage}
                onClick={() => select(start - PAGE_SIZE)}
              >
                <ChevronLeft aria-hidden="true" className="rtl:scale-x-[-1]" />
              </Button>
              <p
                role="status"
                className="px-1 text-xs text-muted-foreground tabular-nums"
              >
                {pageLabel}
              </p>
              <Button
                size="icon-sm"
                variant="outline"
                type="button"
                disabled={start + PAGE_SIZE >= file.size}
                aria-label={messages.nextPage}
                title={messages.nextPage}
                onClick={() => select(start + PAGE_SIZE)}
              >
                <ChevronRight aria-hidden="true" className="rtl:scale-x-[-1]" />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
