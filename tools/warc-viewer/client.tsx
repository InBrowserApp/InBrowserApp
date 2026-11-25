import { useEffect, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Folder, Globe } from "@workspace/ui/icons"
import { CaptureBrowser } from "./capture-browser"
import type { Capture } from "./archive"
import type English from "./messages/en.json"

export type Messages = typeof English

type ArchiveState = { file: File; captures: Capture[] | null }

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [archive, setArchive] = useState<ArchiveState | null>(null)
  useEffect(() => {
    if (!file) return
    const controller = new AbortController()
    void import("./archive")
      .then(({ openWarc }) => openWarc(file, controller.signal))
      .then(
        (captures) => {
          if (!controller.signal.aborted) setArchive({ file, captures })
        },
        () => {
          if (!controller.signal.aborted) setArchive({ file, captures: null })
        }
      )
    return () => controller.abort()
  }, [file])
  const current = archive?.file === file ? archive : null
  return (
    <DocumentWorkspace
      tool="warc-viewer"
      file={file}
      onFile={(next) => {
        setArchive(null)
        setFile(next)
      }}
      accept=".warc,.warc.gz,application/warc,application/gzip"
      active={Boolean(current?.captures)}
      fitContent
      messages={m}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-64">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Globe aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
          <div className="flex flex-wrap justify-center gap-2">
            <Button data-file-open onClick={chooseFile}>
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const { sampleArchive } = await import("./archive")
                setFile((current) => current ?? sampleArchive())
              }}
            >
              {m.example}
            </Button>
          </div>
        </Empty>
      )}
    >
      {file && !current ? (
        <p
          role="status"
          className="flex min-h-48 items-center justify-center gap-2 text-sm"
        >
          <Spinner aria-hidden="true" />
          {m.loading}
        </p>
      ) : null}
      {current?.captures === null ? (
        <Alert variant="destructive" className="m-3 w-auto">
          <AlertDescription>{m.invalid}</AlertDescription>
        </Alert>
      ) : null}
      {current?.captures ? (
        <CaptureBrowser captures={current.captures} messages={m} lang={lang} />
      ) : null}
    </DocumentWorkspace>
  )
}
