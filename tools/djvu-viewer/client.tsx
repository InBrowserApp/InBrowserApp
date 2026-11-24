import { useEffect, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { BookOpen } from "@workspace/ui/icons"
import { Reader } from "./reader"
import type { Messages, Reply, Request } from "./types"

type OpenResult = { file: File } & (
  | { type: "opened"; worker: Worker; total: number }
  | { type: "invalid" | "engineError" }
)

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<OpenResult>()
  const current = result?.file === file ? result : undefined
  const error =
    current?.type === "invalid" || current?.type === "engineError"
      ? m[current.type]
      : null

  useEffect(() => {
    if (!file) return
    let worker: Worker
    try {
      worker = new Worker(new URL("./djvu.worker.ts", import.meta.url), {
        type: "module",
      })
    } catch {
      setResult({ file, type: "engineError" })
      return
    }
    worker.onmessage = ({ data }: MessageEvent<Reply>) => {
      if (data.type === "opened") setResult({ ...data, file, worker })
      else if (data.type === "invalid" || data.type === "engineError") {
        setResult({ type: data.type, file })
        worker.terminate()
      }
    }
    worker.onerror = () => {
      setResult({ file, type: "engineError" })
      worker.terminate()
    }
    worker.postMessage({ type: "open", file } satisfies Request)
    return () => worker.terminate()
  }, [file])

  return (
    <DocumentWorkspace
      tool="djvu-viewer"
      file={file}
      onFile={setFile}
      accept=".djvu,.djv,image/vnd.djvu"
      active={Boolean(file && !error)}
      messages={m}
    >
      {!file ? (
        <Empty className="min-h-72">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : error ? (
        <div className="p-3">
          <Alert variant="destructive" className="text-start">
            <AlertTitle>{m.openError}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : current?.type === "opened" ? (
        <Reader worker={current.worker} total={current.total} m={m} />
      ) : (
        <p
          role="status"
          className="flex flex-1 items-center justify-center gap-2 p-6"
        >
          <Spinner aria-hidden="true" />
          {m.loading}
        </p>
      )}
    </DocumentWorkspace>
  )
}
