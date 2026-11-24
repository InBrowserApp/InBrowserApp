import { useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  FolderInput,
  LoaderCircle,
  ScanLine,
  Sparkles,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { Workspace } from "./workspace"
import type { Messages, Series } from "./types"
import type { openFiles } from "./dicom"

type Skipped = Awaited<ReturnType<typeof openFiles>>["skipped"]
type ImportStatus =
  | { status: "loading" }
  | { status: "ready" | "failed"; skipped: Skipped }

export default function Client({
  messages,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const picker = useRef<HTMLInputElement>(null)
  const load = useRef<AbortController>(null)
  const [library, setLibrary] = useState<{
    series: Series[]
    revision: number
  }>()
  const [attempt, setAttempt] = useState<ImportStatus>()
  const [dragging, setDragging] = useState(false)
  const number = new Intl.NumberFormat(lang)
  const skipped = attempt?.status === "loading" ? [] : (attempt?.skipped ?? [])

  async function open(files?: File[]) {
    load.current?.abort()
    const controller = new AbortController()
    load.current = controller
    setAttempt({ status: "loading" })
    try {
      const result = files
        ? await import("./dicom").then(({ openFiles }) =>
            openFiles(files, lang, controller.signal)
          )
        : {
            series: (await import("./example")).example(messages.exampleName),
            skipped: [],
          }
      if (controller.signal.aborted) return
      setAttempt({
        status: result.series.length ? "ready" : "failed",
        skipped: result.skipped,
      })
      if (result.series.length) {
        setLibrary((previous) => ({
          series: result.series,
          revision: (previous?.revision ?? 0) + 1,
        }))
      }
    } catch {
      if (!controller.signal.aborted)
        setAttempt({ status: "failed", skipped: [] })
    }
  }

  return (
    <div
      className={cn(
        "grid min-w-0 gap-3 rounded-xl",
        dragging && "ring-2 ring-ring ring-offset-4 ring-offset-background"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        setDragging(false)
        const files = Array.from(event.dataTransfer.files)
        if (!files.length) return
        event.preventDefault()
        void open(files)
      }}
    >
      <input
        ref={picker}
        hidden
        type="file"
        multiple
        aria-label={messages.open}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? [])
          event.currentTarget.value = ""
          if (files.length) void open(files)
        }}
      />
      <div
        className={cn(
          "grid gap-4",
          library
            ? "justify-items-start"
            : "min-h-64 content-center justify-items-center rounded-xl border border-dashed border-input bg-muted/25 px-5 py-8 text-center"
        )}
      >
        {!library && (
          <>
            <span className="grid size-12 place-items-center rounded-xl border bg-background text-foreground shadow-xs">
              <ScanLine className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="text-lg font-medium">{messages.drop}</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {messages.formats}
              </p>
            </div>
          </>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => picker.current?.click()}>
            <FolderInput aria-hidden="true" />
            {messages.open}
          </Button>
          {!library && (
            <Button variant="outline" onClick={() => void open()}>
              <Sparkles aria-hidden="true" />
              {messages.example}
            </Button>
          )}
        </div>
      </div>
      {attempt?.status === "loading" && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          {messages.loading}
        </p>
      )}
      {attempt?.status === "failed" && (
        <p role="alert" className="text-sm text-destructive">
          {messages.unreadable}
        </p>
      )}
      {skipped.length > 0 && (
        <details className="rounded-lg border bg-card px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium">
            {messages.skipped.replace("{count}", number.format(skipped.length))}
          </summary>
          <ul className="mt-2 max-h-40 space-y-2 overflow-auto text-muted-foreground">
            {skipped.map(({ name, unsupported }, index) => (
              <li key={index} className="wrap-anywhere">
                <bdi className="font-medium text-foreground">{name}</bdi>
                <span className="block">
                  {unsupported
                    ? messages.unsupportedFile
                    : messages.invalidFile}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
      {library && (
        <Workspace
          key={library.revision}
          series={library.series}
          messages={messages}
          number={number}
        />
      )}
    </div>
  )
}
