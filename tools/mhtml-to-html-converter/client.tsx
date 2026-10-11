import { useCallback, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { DocumentFrame } from "@workspace/ui/components/tool/document-frame"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileText } from "@workspace/ui/icons"
import { useDocument } from "./use-document"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const { output, error, loading } = useDocument(file, m)
  return (
    <>
      <DocumentWorkspace
        tool="mhtml-to-html-converter"
        file={file}
        onFile={setFile}
        accept=".mhtml,.mht"
        active={Boolean(file && !error)}
        messages={m}
      >
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{m.error}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {!file ? (
          <Empty className="min-h-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{m.drop}</EmptyTitle>
              <EmptyDescription>{m.privacy}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {loading ? (
          <div className="flex flex-1 flex-wrap items-center justify-center gap-2 p-6">
            <p role="status" className="flex items-center gap-2 text-sm">
              <Spinner />
              {m.reading}
            </p>
            <Button variant="outline" size="sm" onClick={() => setFile(null)}>
              {m.cancel}
            </Button>
          </div>
        ) : null}
        {output ? <Result output={output} m={m} /> : null}
      </DocumentWorkspace>
      <p className="mt-2 text-xs text-muted-foreground">{m.fidelity}</p>
      <p className="mt-2 text-xs text-muted-foreground">{m.limitations}</p>
    </>
  )
}

function Result({
  output,
  m,
}: {
  output: NonNullable<ReturnType<typeof useDocument>["output"]>
  m: Messages
}) {
  const [zoom, setZoom] = useState(100)
  const [position, setPosition] = useState(0)
  const [missing, setMissing] = useState(false)
  const [failed, setFailed] = useState(false)
  const onMissing = useCallback(() => setMissing(true), [])
  const onResourceError = useCallback(() => setFailed(true), [])
  return (
    <>
      <Alert className="shrink-0 rounded-none border-x-0 border-t-0">
        <AlertTitle>{failed ? m.error : m.notes}</AlertTitle>
        <AlertDescription>
          {failed ? m.failed : m.layoutNotice}
        </AlertDescription>
      </Alert>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-2">
        <p role="status" className="text-sm text-muted-foreground">
          {failed ? m.unsupported : m.ready}
        </p>
        {!failed ? (
          <DocumentDownload
            file={output.file}
            filename={output.source.name.replace(/\.(mhtml|mht)$/i, ".html")}
            label={m.download}
          />
        ) : null}
        <DocumentZoom value={zoom} onChange={setZoom} messages={m} />
      </div>
      <div className="min-h-0 min-w-0 flex-1">
        <DocumentFrame
          html={output.preview.html}
          title={m.documentBody}
          zoom={zoom}
          target={null}
          onMissing={onMissing}
          onResourceError={onResourceError}
          onPosition={setPosition}
        />
      </div>
      <div className="flex shrink-0 justify-between gap-2 border-t px-3 py-2 text-xs text-muted-foreground">
        {missing ? (
          <p role="status">{m.missingReference}</p>
        ) : (
          <span className="truncate" dir="auto">
            {output.preview.title}
          </span>
        )}
        <span
          className="shrink-0 tabular-nums"
          aria-label={`${m.position}: ${position}%`}
        >
          {position}%
        </span>
      </div>
    </>
  )
}
