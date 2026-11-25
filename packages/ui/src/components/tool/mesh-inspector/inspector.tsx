import { useEffect, useRef, useState } from "react"
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
import { exampleFile } from "../model-viewer/load-model"
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
  const active = useRef<{ worker?: Worker } | null>(null)
  const [status, setStatus] = useState<"checking" | "failed">()
  const [result, setResult] = useState<{ name: string; report: MeshReport }>()
  const [dragging, setDragging] = useState(false)

  useEffect(
    () => () => {
      active.current?.worker?.terminate()
      active.current = null
    },
    []
  )

  async function inspect(file?: File) {
    active.current?.worker?.terminate()
    const request: { worker?: Worker } = {}
    active.current = request
    setStatus("checking")
    let name = ""
    function finish(report: MeshReport | null) {
      request.worker?.terminate()
      if (active.current !== request) return
      active.current = null
      if (report) setResult({ name, report })
      setStatus(report ? undefined : "failed")
    }
    try {
      const input = file ?? (await exampleFile("stl"))
      if (active.current !== request) return
      name = input.name
      const worker = new Worker(
        new URL("./inspect.worker.ts", import.meta.url),
        { type: "module" }
      )
      request.worker = worker
      worker.onmessage = (event: MessageEvent<MeshReport | null>) =>
        finish(event.data)
      worker.onerror = () => finish(null)
      worker.postMessage(input)
    } catch {
      finish(null)
    }
  }

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
        {status === "checking" && (
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
          {...result}
          previous={Boolean(status)}
          lang={lang}
          messages={m}
        />
      )}
    </section>
  )
}
