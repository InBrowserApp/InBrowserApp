import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../ui/empty"
import { Spinner } from "../../ui/spinner"
import { ArrowLeftRight, Box, Folder } from "../../../icons"
import { cn } from "../../../lib/utils"
import { DocumentDownload } from "../document-download"
import { exampleFile } from "../model-viewer/load-model"
import type { MeshFormat } from "@workspace/model-mesh/mesh-file"
import type { MeshConverterMessages } from "./messages"

type Result = { data: Blob; name: string; source: string }

export default function MeshConverter({
  format,
  messages: m,
}: {
  format: MeshFormat
  messages: MeshConverterMessages
}) {
  const input = useRef<HTMLInputElement>(null)
  const worker = useRef<Worker>(null)
  const pending = useRef(0)
  const [status, setStatus] = useState<"converting" | "failed">()
  const [result, setResult] = useState<Result>()
  const [dragging, setDragging] = useState(false)
  const target = format === "stl" ? "obj" : "stl"

  useEffect(
    () => () => {
      pending.current += 1
      worker.current?.terminate()
    },
    []
  )

  async function convert(supplied?: File) {
    const request = ++pending.current
    worker.current?.terminate()
    setStatus("converting")
    try {
      const file = supplied ?? (await exampleFile(format))
      if (request !== pending.current) return
      const job = new Worker(new URL("./convert.worker.ts", import.meta.url), {
        type: "module",
      })
      worker.current = job
      function finish(data: Blob | null) {
        job.terminate()
        if (request !== pending.current) return
        worker.current = null
        if (data) {
          const name = `${file.name.slice(0, -4) || "model"}.${target}`
          setResult({ data, name, source: file.name })
        }
        setStatus(data ? undefined : "failed")
      }
      job.onmessage = (event: MessageEvent<Blob | null>) => finish(event.data)
      job.onerror = () => finish(null)
      job.postMessage({ file, format })
    } catch {
      if (request !== pending.current) return
      worker.current?.terminate()
      worker.current = null
      setStatus("failed")
    }
  }

  const choose = (
    <Button
      variant={result ? "outline" : "default"}
      onClick={() => input.current?.click()}
    >
      <Folder data-icon="inline-start" aria-hidden="true" />
      {m.open}
    </Button>
  )
  return (
    <section
      className={cn(
        "grid min-w-0 gap-3 rounded-lg",
        dragging && "ring-2 ring-ring"
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
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files[0]
        if (file) void convert(file)
      }}
    >
      <input
        ref={input}
        hidden
        type="file"
        accept={`.${format}`}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) void convert(file)
        }}
      />
      {status === "failed" && (
        <Alert variant="destructive">
          <AlertDescription>{m.failed}</AlertDescription>
        </Alert>
      )}
      <Empty
        className={cn(
          "border border-dashed bg-muted/30",
          result ? "min-h-36" : "min-h-64"
        )}
      >
        {!result && (
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ArrowLeftRight aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              <span className="font-mono" dir="ltr">
                {format.toUpperCase()} → {target.toUpperCase()}
              </span>
              <br />
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          {choose}
          <Button variant="outline" onClick={() => void convert()}>
            {m.example}
          </Button>
        </div>
        {status === "converting" && (
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Spinner aria-hidden="true" />
            {m.converting}
          </p>
        )}
      </Empty>
      {result && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-background p-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Box
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{m.output}</p>
              <p
                dir="auto"
                className="truncate font-medium"
                title={result.name}
              >
                {result.name}
              </p>
              <p
                dir="auto"
                className="truncate text-xs text-muted-foreground"
                title={result.source}
              >
                {result.source}
              </p>
            </div>
          </div>
          <DocumentDownload
            file={result.data}
            filename={result.name}
            label={m.download.replace("{format}", target.toUpperCase())}
          />
        </div>
      )}
    </section>
  )
}
