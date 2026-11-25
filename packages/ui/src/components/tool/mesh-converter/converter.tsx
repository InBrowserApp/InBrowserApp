import { useRef, useState } from "react"
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
import { useMeshWorker } from "../use-mesh-worker"
import type { MeshFormat } from "@workspace/model-mesh/mesh-file"
import type { MeshConverterMessages } from "./messages"

export default function MeshConverter({
  format,
  messages: m,
}: {
  format: MeshFormat
  messages: MeshConverterMessages
}) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const {
    result,
    status,
    run: convert,
  } = useMeshWorker<Blob>(
    format,
    () =>
      new Worker(new URL("./convert.worker.ts", import.meta.url), {
        type: "module",
      }),
    (file) => ({ file, format })
  )
  const target = format === "stl" ? "obj" : "stl"
  const outputName = `${result?.name.slice(0, -4) || "model"}.${target}`

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
        className={
          result
            ? "items-start gap-2 p-0"
            : "min-h-64 border border-dashed bg-muted/30"
        }
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
        {status === "working" && (
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Spinner aria-hidden="true" />
            {m.converting}
          </p>
        )}
      </Empty>
      <p className="sr-only" role="status">
        {result && !status && `${m.output} ${outputName}`}
      </p>
      {result && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-background p-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Box
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {status ? m.previousOutput : m.output}
              </p>
              <p dir="auto" className="truncate font-medium" title={outputName}>
                {outputName}
              </p>
              <p
                dir="auto"
                className="truncate text-xs text-muted-foreground"
                title={result.name}
              >
                {result.name}
              </p>
            </div>
          </div>
          <DocumentDownload
            file={result.data}
            filename={outputName}
            label={m.download.replace("{format}", target.toUpperCase())}
          />
        </div>
      )}
    </section>
  )
}
