import { useEffect, useRef, useState, type DragEvent } from "react"

import type { UnixFsSource } from "@workspace/ipfs-files/import"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  Download,
  FileArchive,
  FileText,
  FolderInput,
  LoaderCircle,
  Upload,
} from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { cn } from "@workspace/ui/lib/utils"

import {
  buildCar,
  DuplicatePathError,
  UnsupportedFolderPathError,
} from "./core/car"
import type EnglishMessages from "./messages/en.json"
import { dropSource, sourcesFromFiles } from "./selection"

type Job = "reading" | "hashing" | "packing"
type Selection = {
  entries: readonly UnixFsSource[]
  name: string
  count: number
}
type Result = Awaited<ReturnType<typeof buildCar>>

export default function CarBuilder({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const folderInput = useRef<HTMLInputElement>(null)
  const active = useRef<AbortController | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)

  useEffect(() => () => active.current?.abort(), [])

  function cancel() {
    active.current?.abort()
    active.current = null
    setJob(null)
  }

  function select(entries: readonly UnixFsSource[]) {
    if (entries.length === 0) return
    const roots = new Set(entries.map(({ path }) => path.split("/", 1)[0]!))
    setSelection({
      entries,
      name: roots.size === 1 ? roots.values().next().value! : "",
      count: entries.filter(({ file }) => file).length,
    })
    setResult(null)
    setError("")
  }

  async function run(stage: Job, work: (signal: AbortSignal) => Promise<void>) {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setError("")
    setJob(stage)
    try {
      await work(controller.signal)
    } catch (error) {
      if (!controller.signal.aborted) {
        setError(
          error instanceof DuplicatePathError
            ? messages.duplicate
            : error instanceof UnsupportedFolderPathError
              ? messages.unsupportedPath
              : messages.failed
        )
      }
    } finally {
      if (active.current === controller) {
        active.current = null
        setJob(null)
      }
    }
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    const read = dropSource(event.dataTransfer)
    void run("reading", async (signal) => {
      const entries = await read(signal)
      signal.throwIfAborted()
      select(entries)
    })
  }

  function build() {
    if (!selection) return
    setResult(null)
    void run("hashing", async (signal) => {
      const next = await buildCar(selection.entries, signal, () => {
        signal.throwIfAborted()
        setJob("packing")
      })
      signal.throwIfAborted()
      setResult(next)
    })
  }

  const fileCount = selection
    ? `${messages.files} · ${selection.count.toLocaleString(language)}`
    : null

  return (
    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
      <ToolPanelCard>
        <CardHeader>
          <CardTitle>{messages.input}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <div
            className={cn(
              "grid min-h-36 place-content-center justify-items-center gap-2 rounded-xl border border-dashed bg-muted/30 p-4 text-center",
              dragging && "border-primary bg-primary/5"
            )}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "copy"
              setDragging(true)
            }}
            onDragLeave={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              )
                setDragging(false)
            }}
            onDrop={drop}
          >
            <Upload
              aria-hidden="true"
              className="size-6 text-muted-foreground"
            />
            <p dir="auto" className="max-w-full text-sm wrap-anywhere">
              {selection?.name || fileCount || messages.drop}
            </p>
            {selection?.name && (
              <p className="text-xs text-muted-foreground">{fileCount}</p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => fileInput.current?.click()}
              >
                <FileText data-icon="inline-start" aria-hidden="true" />
                {messages.chooseFiles}
              </Button>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => folderInput.current?.click()}
              >
                <FolderInput data-icon="inline-start" aria-hidden="true" />
                {messages.chooseFolder}
              </Button>
            </div>
          </div>
          {[fileInput, folderInput].map((ref, index) => (
            <input
              key={index}
              ref={ref}
              hidden
              multiple
              type="file"
              {...(index === 1 && { webkitdirectory: "" })}
              onChange={(event) => {
                const files = Array.from(event.target.files ?? [])
                event.target.value = ""
                if (files.length === 0) return
                cancel()
                select(sourcesFromFiles(files))
              }}
            />
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              disabled={!selection || Boolean(job)}
              onClick={build}
            >
              <FileArchive data-icon="inline-start" aria-hidden="true" />
              {messages.build}
            </Button>
            {job && (
              <Button type="button" variant="ghost" onClick={cancel}>
                {messages.cancel}
              </Button>
            )}
          </div>
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground empty:hidden"
          >
            {job && (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
                {messages[job]}
              </>
            )}
          </p>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      <ToolPanelCard>
        <CardHeader>
          <CardTitle>{messages.result}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          {result ? (
            <>
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{messages.root}</p>
                  <ToolCopyButton
                    value={result.cid}
                    copyLabel={messages.copy}
                    copiedLabel={messages.copied}
                    ariaLabel={`${messages.copy}: ${messages.root}`}
                  />
                </div>
                <code
                  dir="ltr"
                  className="rounded-lg bg-muted p-2.5 text-sm wrap-anywhere"
                  aria-live="polite"
                >
                  {result.cid}
                </code>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat(language, {
                    style: "unit",
                    unit: "byte",
                    unitDisplay: "long",
                  }).format(result.blob.size)}
                </p>
                <Button
                  type="button"
                  onClick={() =>
                    downloadBlob(
                      result.blob,
                      `${selection?.name || "archive"}.car`
                    )
                  }
                >
                  <Download data-icon="inline-start" aria-hidden="true" />
                  {messages.download}
                </Button>
              </div>
            </>
          ) : (
            <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
              {messages.empty}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}
