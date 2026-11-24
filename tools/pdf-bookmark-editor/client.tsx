import { useRef, useState } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Download,
  FileText,
  FolderInput,
  LoaderCircle,
  Upload,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { BookmarkPanel } from "./bookmark-panel"
import {
  deleteBookmark,
  insertBookmark,
  moveBookmark,
  type Bookmark,
} from "./core/bookmarks"
import type { PdfBookmarks } from "./core/pdf-bookmarks"
import type { Messages } from "./messages"
import { PdfPreview } from "./preview"

type Session = { file: File; pdf: PdfBookmarks }

export default function PdfBookmarkEditor({
  messages,
}: {
  messages: Messages
}) {
  const picker = useRef<HTMLInputElement>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [opening, setOpening] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [sessionId, setSessionId] = useState(0)

  async function open(file: File) {
    setOpenError(false)
    setOpening(true)
    try {
      const { readPdfBookmarks } = await import("./core/pdf-bookmarks")
      const pdf = await readPdfBookmarks(await file.arrayBuffer())
      if (!pdf.pageCount) throw new Error("PDF has no pages")
      setSession({ file, pdf })
      setSessionId((id) => id + 1)
    } catch {
      setOpenError(true)
    } finally {
      setOpening(false)
    }
  }

  function openPicker() {
    picker.current?.click()
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={picker}
        type="file"
        accept="application/pdf,.pdf"
        aria-label={messages.openPdf}
        hidden
        disabled={opening}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) void open(file)
          event.currentTarget.value = ""
        }}
      />
      {openError && (
        <Alert variant="destructive">
          <AlertDescription>{messages.openError}</AlertDescription>
        </Alert>
      )}
      {session ? (
        <Editor
          key={sessionId}
          session={session}
          messages={messages}
          opening={opening}
          onOpen={openPicker}
        />
      ) : (
        <button
          type="button"
          disabled={opening}
          onClick={openPicker}
          onDragOver={(event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = "copy"
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const file = event.dataTransfer.files[0]
            if (file && !opening) void open(file)
          }}
          className={cn(
            "flex min-h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/35 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait",
            dragging && "border-primary bg-primary/5"
          )}
        >
          <span className="grid size-12 place-items-center rounded-xl border bg-background text-foreground">
            {opening ? (
              <LoaderCircle
                className="size-5 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Upload className="size-5" aria-hidden="true" />
            )}
          </span>
          <span className="text-base font-medium">
            {opening ? messages.openingPdf : messages.dropPdf}
          </span>
          <span className="text-sm text-muted-foreground">
            {messages.localOnly}
          </span>
        </button>
      )}
    </div>
  )
}

function Editor({
  session: { file, pdf },
  messages,
  opening,
  onOpen,
}: {
  session: Session
  messages: Messages
  opening: boolean
  onOpen: () => void
}) {
  const [bookmarks, setBookmarks] = useState(pdf.bookmarks)
  const [selectedId, setSelectedId] = useState<number | undefined>(
    bookmarks[0]?.id
  )
  const [previewPage, setPreviewPage] = useState(bookmarks[0]?.page ?? 1)
  const [undo, setUndo] = useState<{
    bookmarks: Bookmark[]
    selected: Bookmark
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const nextId = useRef(bookmarks.length)

  const selectedIndex = bookmarks.findIndex(
    (bookmark) => bookmark.id === selectedId
  )
  const selected = bookmarks[selectedIndex]

  function select(bookmark?: Bookmark) {
    setSelectedId(bookmark?.id)
    if (bookmark?.page != null) setPreviewPage(bookmark.page)
  }

  function replace(next: Bookmark[]) {
    setBookmarks(next)
    setUndo(null)
  }

  function update(changes: Partial<Pick<Bookmark, "title" | "page">>) {
    replace(
      bookmarks.map((bookmark) =>
        bookmark.id === selectedId ? { ...bookmark, ...changes } : bookmark
      )
    )
  }

  function add() {
    const bookmark: Bookmark = {
      id: nextId.current++,
      depth: selected?.depth ?? 0,
      title: messages.pageBookmark.replace("{page}", String(previewPage)),
      page: previewPage,
    }
    replace(insertBookmark(bookmarks, selectedIndex, bookmark))
    select(bookmark)
  }

  function remove() {
    const next = deleteBookmark(bookmarks, selectedIndex)
    setUndo({ bookmarks, selected: bookmarks[selectedIndex]! })
    setBookmarks(next)
    select(next[selectedIndex] ?? next[selectedIndex - 1])
  }

  async function download() {
    setSaveError(false)
    setSaving(true)
    try {
      const { writePdfBookmarks } = await import("./core/pdf-bookmarks")
      const bytes = await writePdfBookmarks(pdf, bookmarks)
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${file.name.replace(/\.pdf$/i, "")}-bookmarks.pdf`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <FileText
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <bdi className="min-w-0 truncate" title={file.name}>
            {file.name}
          </bdi>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={opening || saving}
            onClick={onOpen}
          >
            {opening ? (
              <LoaderCircle
                data-icon="inline-start"
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <FolderInput data-icon="inline-start" aria-hidden="true" />
            )}
            {opening ? messages.openingPdf : messages.changePdf}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={opening || saving}
            onClick={() => void download()}
          >
            {saving ? (
              <LoaderCircle
                data-icon="inline-start"
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Download data-icon="inline-start" aria-hidden="true" />
            )}
            {saving ? messages.savingPdf : messages.downloadPdf}
          </Button>
        </div>
      </div>
      {saveError && (
        <Alert variant="destructive">
          <AlertDescription>{messages.saveError}</AlertDescription>
        </Alert>
      )}
      <div className="grid min-w-0 items-start gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <BookmarkPanel
          bookmarks={bookmarks}
          selectedIndex={selectedIndex}
          previewPage={previewPage}
          total={pdf.pageCount}
          messages={messages}
          onAdd={add}
          onSelect={select}
          onDelete={remove}
          onMove={(move) =>
            replace(moveBookmark(bookmarks, selectedIndex, move))
          }
          onTitle={(title) => update({ title })}
          onPage={(page) => {
            if (page !== selected?.page) update({ page })
            setPreviewPage(page)
          }}
          undo={
            undo &&
            (() => {
              replace(undo.bookmarks)
              select(undo.selected)
            })
          }
        />
        <PdfPreview
          file={file}
          page={previewPage}
          total={pdf.pageCount}
          onPage={setPreviewPage}
          messages={messages}
        />
      </div>
    </div>
  )
}
