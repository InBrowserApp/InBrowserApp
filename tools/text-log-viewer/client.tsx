import { useState } from "react"
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
import { FileText } from "@workspace/ui/icons"
import { EncodingPicker } from "./encoding-picker"
import { Reader } from "./reader"
import { useReader } from "./use-reader"
import type { Messages } from "./types"
export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [encoding, setEncoding] = useState("auto")
  const { view, busy, error, request } = useReader(file, encoding)
  return (
    <DocumentWorkspace
      tool="text-log-viewer"
      file={file}
      onFile={(next) => {
        setFile(next)
        setEncoding("auto")
      }}
      accept=".txt,.text,.log"
      active={Boolean(file)}
      messages={m}
    >
      {file ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-3 py-2">
          <EncodingPicker value={encoding} onChange={setEncoding} m={m} />
          {view ? (
            <span className="text-xs text-muted-foreground">
              {m.decoded.replace("{encoding}", view.metadata.encoding)}
            </span>
          ) : null}
        </div>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{m[error]}</AlertDescription>
        </Alert>
      ) : null}
      {busy && !view ? (
        <p
          role="status"
          className="flex flex-1 items-center justify-center gap-2 p-6"
        >
          <Spinner />
          {m.opening}
        </p>
      ) : null}
      {view && !error ? (
        <Reader view={view} busy={busy} request={request} m={m} />
      ) : null}
      {!file ? (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              {m.formats}
              <br />
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {file ? (
        <details className="max-h-32 shrink-0 overflow-auto border-t px-3 py-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer">{m.notes}</summary>
          <p className="mt-2">{m.scope}</p>
          <p className="mt-2">{m.findHelp}</p>
          <p className="mt-2">{m.literal}</p>
        </details>
      ) : null}
    </DocumentWorkspace>
  )
}
