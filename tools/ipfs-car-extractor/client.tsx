import { useEffect, useId, useRef, useState, type DragEvent } from "react"

import {
  IpfsFileError,
  listIpfsDirectory,
  openIpfsEntry,
  readIpfsFile,
  zipIpfsDirectory,
  type IpfsEntry,
  type IpfsReference,
  type ReadableStorage,
} from "@workspace/ipfs-files"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { FileArchive, LoaderCircle, Upload } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { cn } from "@workspace/ui/lib/utils"

import { openCar } from "./car"
import { CarContents } from "./contents"
import type EnglishMessages from "./messages/en.json"

export type CarView = {
  path: readonly IpfsReference[]
  entry: IpfsEntry
  children: readonly IpfsReference[]
}

type Archive = Awaited<ReturnType<typeof openCar>>
type Job = "reading" | "preparing"
type JobError = { message: string; path?: string }

export default function CarExtractor({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const active = useRef<AbortController | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [archive, setArchive] = useState<Archive | null>(null)
  const [view, setView] = useState<CarView | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<JobError | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => () => active.current?.abort(), [])

  function cancel() {
    active.current?.abort()
    active.current = null
    setJob(null)
  }

  async function run(
    job: Job,
    fallback: "invalid" | "failed",
    action: (signal: AbortSignal) => Promise<void>
  ) {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setError(null)
    setJob(job)
    try {
      await action(controller.signal)
    } catch (error) {
      if (!controller.signal.aborted) {
        const problem = error instanceof IpfsFileError ? error : null
        setError({
          message: messages[problem?.code ?? fallback],
          path: problem?.path,
        })
      }
    } finally {
      if (active.current === controller) {
        active.current = null
        setJob(null)
      }
    }
  }

  async function show(
    path: readonly IpfsReference[],
    store: ReadableStorage,
    signal: AbortSignal
  ) {
    const entry = await openIpfsEntry(path.at(-1)!.cid, store, signal)
    const children =
      entry.type === "directory" ? await listIpfsDirectory(entry, signal) : []
    signal.throwIfAborted()
    setView({ path, entry, children })
  }

  function select(next: File | undefined) {
    if (!next) return
    setFile(next)
    setArchive(null)
    setView(null)
    void run("reading", "invalid", async (signal) => {
      const car = await openCar(next, signal)
      signal.throwIfAborted()
      setArchive(car)
      const root = car.roots[0]
      if (root) {
        await show([{ name: archiveName(next), cid: root }], car.store, signal)
      } else {
        setError({ message: messages.rootsMissing })
      }
    })
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    select(event.dataTransfer.files[0])
  }

  function browse(path: readonly IpfsReference[]) {
    if (!archive) return
    void run("reading", "invalid", (signal) =>
      show(path, archive.store, signal)
    )
  }

  function download() {
    if (!archive || !view) return
    const { entry, path } = view
    const name = path.at(-1)!.name
    void run("preparing", "failed", async (signal) => {
      const folder = entry.type === "directory"
      const blob = folder
        ? await zipIpfsDirectory(entry, archive.store, signal)
        : await readIpfsFile(entry, signal)
      signal.throwIfAborted()
      downloadBlob(blob, folder ? `${name}.zip` : name)
    })
  }

  const feedback = (job || error) && (
    <div className="grid gap-2">
      {job && (
        <div className="flex flex-wrap items-center gap-2">
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            {messages[job]}
          </p>
          <Button type="button" size="sm" variant="ghost" onClick={cancel}>
            {messages.cancel}
          </Button>
        </div>
      )}
      {error && (
        <div role="alert" className="grid gap-1 text-sm text-destructive">
          <p>{error.message}</p>
          {error.path && (
            <code dir="auto" className="text-xs wrap-anywhere">
              {error.path}
            </code>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="grid min-w-0 gap-4">
      <ToolPanelCard>
        <CardHeader>
          <CardTitle>{messages.archive}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <div
            className={cn(
              "grid min-h-32 place-content-center justify-items-center gap-2 rounded-xl border border-dashed bg-muted/30 p-4 text-center",
              dragging && "border-primary bg-primary/5"
            )}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "copy"
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <FileArchive
              aria-hidden="true"
              className="size-6 text-muted-foreground"
            />
            <p dir="auto" className="text-sm wrap-anywhere">
              {file?.name ?? messages.drop}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => input.current?.click()}
            >
              <Upload data-icon="inline-start" aria-hidden="true" />
              {messages.choose}
            </Button>
            <input
              ref={input}
              type="file"
              hidden
              onChange={(event) => {
                select(event.target.files?.[0])
                event.target.value = ""
              }}
            />
          </div>
          {archive && archive.roots.length === 1 && (
            <div className="grid gap-1">
              <p className="text-sm font-medium">{messages.roots}</p>
              <code
                dir="ltr"
                className="rounded-md bg-muted p-2 text-xs wrap-anywhere"
              >
                {archive.roots[0]!.toString()}
              </code>
            </div>
          )}
          {archive && archive.roots.length > 1 && (
            <Field>
              <FieldLabel htmlFor={id}>{messages.roots}</FieldLabel>
              <select
                id={id}
                dir="ltr"
                className="h-8 min-w-0 rounded-lg border border-input bg-background px-2 font-mono text-xs"
                value={
                  view?.path[0]?.cid.toString() ?? archive.roots[0]!.toString()
                }
                onChange={(event) => {
                  const root = archive.roots[event.target.selectedIndex]!
                  browse([{ cid: root, name: archiveName(file!) }])
                }}
              >
                {archive.roots.map((root) => (
                  <option key={root.toString()} value={root.toString()}>
                    {root.toString()}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {!view && feedback}
        </ToolPanelCardContent>
      </ToolPanelCard>
      {view && (
        <CarContents
          view={view}
          messages={messages}
          language={language}
          busy={Boolean(job)}
          feedback={feedback}
          browse={browse}
          download={download}
        />
      )}
    </div>
  )
}

function archiveName(file: File) {
  return file.name.replace(/\.car$/i, "") || file.name
}
