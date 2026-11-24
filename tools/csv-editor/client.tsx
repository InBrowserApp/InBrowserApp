import { useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileText, Folder, Table2 } from "@workspace/ui/icons"
import { parseCsv, readCsv, type CsvDocument } from "./core/csv"
import { Editor } from "./components/editor"
import type { Messages } from "./messages"

const example = `Product,Category,Stock,SKU
Notebook,Stationery,24,00142
Desk lamp,Lighting,8,00325
Pencil set,Stationery,120,00153
Cable clip,Accessories,36,00268
Floor lamp,Lighting,3,00312
Desk mat,Accessories,15,00289`

type OpenTable = CsvDocument & { name: string; revision: number }

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const [table, setTable] = useState<OpenTable | null>(null)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const picker = useRef<HTMLInputElement>(null)
  const request = useRef(0)
  const dragDepth = useRef(0)

  function acceptTable(document: CsvDocument, name: string, revision: number) {
    setTable({ ...document, name, revision })
    setPasteOpen(false)
    setDraft("")
    setError("")
  }

  async function openFile(file: File) {
    const revision = ++request.current
    setLoading(true)
    setError("")
    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      if (revision === request.current) {
        acceptTable(readCsv(bytes, file.name), file.name, revision)
      }
    } catch {
      if (revision === request.current) setError(m.invalidFile)
    } finally {
      if (revision === request.current) setLoading(false)
    }
  }

  function openText(text: string, name: string) {
    const revision = ++request.current
    setLoading(false)
    try {
      acceptTable(parseCsv(text, name), name, revision)
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message === "empty"
          ? m.noData
          : m.invalidFile
      )
    }
  }

  function togglePaste() {
    setPasteOpen(!pasteOpen)
    setError("")
  }

  return (
    <section
      className="relative min-w-0 overflow-hidden rounded-xl border bg-background"
      onDragEnter={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        dragDepth.current++
        setDragging(true)
      }}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("Files")) event.preventDefault()
      }}
      onDragLeave={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (!dragDepth.current) setDragging(false)
      }}
      onDrop={(event) => {
        const file = event.dataTransfer.files[0]
        if (!file) return
        event.preventDefault()
        dragDepth.current = 0
        setDragging(false)
        void openFile(file)
      }}
    >
      <input
        ref={picker}
        type="file"
        accept=".csv,.tsv,text/csv,text/tab-separated-values"
        aria-label={m.openFile}
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) void openFile(file)
          event.currentTarget.value = ""
        }}
      />
      {table ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <Table2
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <bdi title={table.name} className="truncate">
              {table.name}
            </bdi>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => picker.current?.click()}>
              <Folder aria-hidden="true" />
              {m.replaceFile}
            </Button>
            <Button
              variant="ghost"
              aria-expanded={pasteOpen}
              onClick={togglePaste}
            >
              {m.pasteCsv}
            </Button>
          </div>
        </div>
      ) : (
        <div className="m-3 flex min-h-54 flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-muted/20 px-4 py-7 text-center sm:m-4">
          <Table2
            className="size-10 rounded-lg border bg-background p-2 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-medium">{m.dropFile}</p>
            <p className="text-sm text-muted-foreground">{m.localOnly}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => picker.current?.click()}>
              <Folder aria-hidden="true" />
              {m.openFile}
            </Button>
            <Button
              variant="outline"
              aria-expanded={pasteOpen}
              onClick={togglePaste}
            >
              {m.pasteCsv}
            </Button>
            <Button
              variant="ghost"
              onClick={() => openText(example, m.exampleFile)}
            >
              <FileText aria-hidden="true" />
              {m.tryExample}
            </Button>
          </div>
        </div>
      )}
      {pasteOpen && (
        <form
          className="space-y-2 border-b px-3 py-3 sm:px-4"
          onSubmit={(event) => {
            event.preventDefault()
            openText(draft, m.pastedFile)
          }}
        >
          <label htmlFor="csv-editor-text" className="text-sm font-medium">
            {m.pasteLabel}
          </label>
          <Textarea
            id="csv-editor-text"
            dir="auto"
            spellCheck={false}
            className="max-h-56 min-h-24 font-mono"
            value={draft}
            onChange={(event) => setDraft(event.currentTarget.value)}
          />
          <Button type="submit">{m.loadData}</Button>
        </form>
      )}
      {loading && (
        <p
          role="status"
          className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground"
        >
          <Spinner aria-hidden="true" /> {m.readingFile}
        </p>
      )}
      {error && (
        <div className="px-3 py-3 sm:px-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      {table && (
        <Editor
          key={table.revision}
          document={table}
          lang={lang}
          messages={m}
        />
      )}
      {dragging && (
        <div
          role="status"
          className="pointer-events-none absolute inset-0 z-20 grid place-items-center border-2 border-dashed border-primary bg-background/95 p-4 text-center font-medium"
        >
          {m.dropReady}
        </div>
      )}
    </section>
  )
}
