import { useEffect, useRef, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileArchive, ImageUp } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { readImages } from "./images"
import { ImagePicker } from "./image-picker"
import { PageList } from "./page-list"
import type { Page } from "./page-list"
import type { Messages } from "./types"

type State =
  | { status: "reading" }
  | { status: "packing"; page: number }
  | { status: "ready"; archive: Blob; focusDownload: boolean }
  | { status: "error" }

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const addButton = useRef<HTMLButtonElement>(null)
  const createButton = useRef<HTMLButtonElement>(null)
  const active = useRef<AbortController | null>(null)
  const nextId = useRef(0)
  const [pages, setPages] = useState<Page[]>([])
  const [state, setState] = useState<State | null>(null)
  const [skipped, setSkipped] = useState(0)
  const [dragging, setDragging] = useState(false)
  const busy = state?.status === "reading" || state?.status === "packing"
  const number = new Intl.NumberFormat(lang)
  const total = number.format(pages.length)

  useEffect(
    () => () => {
      active.current?.abort()
      active.current = null
    },
    []
  )

  async function add(files: FileList | null) {
    if (active.current || !files?.length) return
    const previous =
      state?.status === "ready" ? { ...state, focusDownload: false } : null
    const run = new AbortController()
    active.current = run
    setState({ status: "reading" })
    try {
      const batch = await readImages(Array.from(files))
      if (active.current !== run) return
      const added = batch.images.map((image) => ({
        ...image,
        id: nextId.current++,
      }))
      setPages((old) => [...old, ...added])
      setSkipped(batch.skipped)
      setState(added.length ? null : previous)
    } finally {
      if (active.current === run) active.current = null
    }
  }

  function move(id: number, target: number, control?: HTMLButtonElement) {
    if (active.current) return
    const source = pages.findIndex((page) => page.id === id)
    if (source === target || source < 0 || target < 0 || target >= pages.length)
      return
    const updated = pages.slice()
    const [item] = updated.splice(source, 1)
    updated.splice(target, 0, item!)
    const row = control?.closest("li")
    const focused = control && document.activeElement === control
    setPages(updated)
    setState(null)
    if (focused) {
      requestAnimationFrame(() => {
        const target =
          control.isConnected && !control.disabled
            ? control
            : row?.querySelector<HTMLButtonElement>("button:not(:disabled)")
        target?.focus()
      })
    }
  }

  function remove(id: number, control: HTMLButtonElement) {
    if (active.current) return
    const row = control.closest("li")
    const neighbor = row?.nextElementSibling ?? row?.previousElementSibling
    const focused = document.activeElement === control
    setPages(pages.filter((page) => page.id !== id))
    setState(null)
    if (focused)
      requestAnimationFrame(() => {
        const next = neighbor?.querySelector<HTMLButtonElement>(
          "button:not(:disabled)"
        )
        ;(next ?? addButton.current)?.focus({ preventScroll: true })
      })
  }

  async function create() {
    if (active.current || !pages.length) return
    const focusDownload = document.activeElement === createButton.current
    const run = new AbortController()
    active.current = run
    const { signal } = run
    setState({ status: "packing", page: 1 })
    try {
      const { createArchive } = await import("./convert")
      signal.throwIfAborted()
      const archive = await createArchive(pages, signal, (page) => {
        setState({ status: "packing", page })
      })
      if (active.current === run)
        setState({ status: "ready", archive, focusDownload })
    } catch {
      if (!signal.aborted) {
        setState({ status: "error" })
        if (focusDownload)
          requestAnimationFrame(() => {
            if (document.activeElement === document.body)
              createButton.current?.focus()
          })
      }
    } finally {
      if (active.current === run) active.current = null
    }
  }

  function cancel() {
    active.current?.abort()
    active.current = null
    setState(null)
    requestAnimationFrame(() =>
      createButton.current?.focus({ preventScroll: true })
    )
  }

  const pickers = (
    <ImagePicker
      addButton={addButton}
      hasPages={pages.length > 0}
      disabled={busy}
      onFiles={add}
      messages={m}
    />
  )

  return (
    <section
      data-tool="images-to-cbz-converter"
      className={cn(
        "grid min-w-0 gap-3 rounded-xl",
        dragging && "ring-2 ring-primary ring-offset-2"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = busy ? "none" : "copy"
        setDragging(!busy)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        void add(event.dataTransfer.files)
      }}
    >
      {pages.length ? (
        <Card>
          <CardHeader className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>{m.pages.replace("{total}", total)}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{m.reorder}</p>
            </div>
            {pickers}
          </CardHeader>
          <CardContent>
            <PageList
              pages={pages}
              disabled={busy}
              messages={m}
              onMove={move}
              onRemove={remove}
            />
          </CardContent>
          <CardFooter className="flex-wrap justify-between gap-3">
            <p className="text-xs text-muted-foreground">{m.privacy}</p>
            <div className="flex flex-wrap items-center gap-2">
              {state?.status === "packing" ? (
                <Button type="button" variant="outline" onClick={cancel}>
                  {m.cancel}
                </Button>
              ) : null}
              {state?.status === "ready" ? (
                <DocumentDownload
                  file={state.archive}
                  filename="comic.cbz"
                  label={m.download}
                  focusOnReady={state.focusDownload}
                />
              ) : (
                <Button
                  ref={createButton}
                  type="button"
                  disabled={busy}
                  onClick={() => void create()}
                >
                  <FileArchive data-icon="inline-start" aria-hidden="true" />
                  {m.create}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Empty className="min-h-60 border bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageUp aria-hidden="true" />
            </EmptyMedia>
            {pickers}
          </EmptyHeader>
          <EmptyTitle>{m.drop}</EmptyTitle>
          <EmptyDescription>{m.formats}</EmptyDescription>
          <p className="text-sm text-muted-foreground">{m.privacy}</p>
        </Empty>
      )}
      {busy ? (
        <p role="status" className="flex items-center gap-2 text-sm">
          <Spinner className="shrink-0" />
          {state.status === "reading"
            ? m.reading
            : m.packing
                .replace("{page}", number.format(state.page))
                .replace("{total}", total)}
        </p>
      ) : null}
      {skipped > 0 ? (
        <p role="status" className="text-sm text-muted-foreground">
          {m.skipped.replace("{count}", number.format(skipped))} · {m.formats}
        </p>
      ) : null}
      {state?.status === "error" ? (
        <Alert variant="destructive">
          <AlertDescription>{m.failed}</AlertDescription>
        </Alert>
      ) : null}
    </section>
  )
}
