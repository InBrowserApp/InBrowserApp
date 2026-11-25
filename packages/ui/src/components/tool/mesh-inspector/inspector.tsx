import { useRef, useState } from "react"
import { ScanLine, Folder } from "../../../icons"
import { cn } from "../../../lib/utils"
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
import { useMeshWorker } from "../use-mesh-worker"
import { InspectionReport } from "./report"
import type { MeshReport } from "@workspace/model-mesh/inspect"
import type { MeshInspectorMessages } from "./messages"

export default function MeshInspector({
  lang,
  messages: m,
}: {
  lang: string
  messages: MeshInspectorMessages
}) {
  const picker = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const {
    result,
    status,
    run: inspect,
  } = useMeshWorker<MeshReport>(
    "stl",
    () =>
      new Worker(new URL("./inspect.worker.ts", import.meta.url), {
        type: "module",
      })
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
        )
          setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files[0]
        if (file) void inspect(file)
      }}
    >
      <input
        ref={picker}
        hidden
        type="file"
        accept=".stl,.obj"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) void inspect(file)
        }}
      />
      <p role="status" className="sr-only">
        {!status && result ? `${m.result} · ${result.name}` : ""}
      </p>
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
              <ScanLine aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={result ? "outline" : "default"}
            onClick={() => picker.current?.click()}
          >
            <Folder data-icon="inline-start" aria-hidden="true" />
            {m.open}
          </Button>
          <Button variant="outline" onClick={() => void inspect()}>
            {m.example}
          </Button>
        </div>
        {status === "working" && (
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Spinner aria-hidden="true" />
            {m.checking}
          </p>
        )}
      </Empty>
      {result && (
        <InspectionReport
          name={result.name}
          report={result.data}
          previous={Boolean(status)}
          lang={lang}
          messages={m}
        />
      )}
    </section>
  )
}
