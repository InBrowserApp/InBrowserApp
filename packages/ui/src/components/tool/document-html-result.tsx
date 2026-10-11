import { useCallback, useState } from "react"
import type { ReactNode } from "react"
import { DocumentDownload } from "./document-download"
import { DocumentFrame } from "./document-frame"
import { DocumentZoom } from "./document-zoom"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"

type Messages = Record<
  | "error"
  | "notes"
  | "failed"
  | "layoutNotice"
  | "unsupported"
  | "ready"
  | "download"
  | "zoom"
  | "zoomIn"
  | "zoomOut"
  | "documentBody"
  | "missingReference"
  | "position",
  string
>

export function DocumentHtmlResult({
  html,
  title,
  file,
  filename,
  messages: m,
  notes,
}: {
  html: string
  title: string
  file: Blob
  filename: string
  messages: Messages
  notes?: ReactNode
}) {
  const [zoom, setZoom] = useState(100)
  const [position, setPosition] = useState(0)
  const [missing, setMissing] = useState(false)
  const [failed, setFailed] = useState(false)
  const onMissing = useCallback(() => setMissing(true), [])
  const onResourceError = useCallback(() => setFailed(true), [])
  return (
    <>
      {!failed && notes ? (
        notes
      ) : (
        <Alert className="shrink-0 rounded-none border-x-0 border-t-0">
          <AlertTitle>{failed ? m.error : m.notes}</AlertTitle>
          <AlertDescription>
            {failed ? m.failed : m.layoutNotice}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-2">
        <p role="status" className="text-sm text-muted-foreground">
          {failed ? m.unsupported : m.ready}
        </p>
        {!failed ? (
          <DocumentDownload
            file={file}
            filename={filename}
            label={m.download}
          />
        ) : null}
        <DocumentZoom value={zoom} onChange={setZoom} messages={m} />
      </div>
      <div className="min-h-0 min-w-0 flex-1">
        <DocumentFrame
          html={html}
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
            {title}
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
