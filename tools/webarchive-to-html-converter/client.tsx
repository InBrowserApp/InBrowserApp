import { useEffect, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
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
import type { convertWebArchive } from "./convert"
import type English from "./messages/en.json"

export type Messages = typeof English
type Output = ReturnType<typeof convertWebArchive> & { blob: Blob }
type Conversion = { file: File; output: Output | null }

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [conversion, setConversion] = useState<Conversion | null>(null)
  useEffect(() => {
    if (!file) return
    let obsolete = false
    void Promise.all([file.arrayBuffer(), import("./convert")])
      .then(([bytes, { convertWebArchive }]) => {
        if (!obsolete) {
          const output = convertWebArchive(new Uint8Array(bytes), m.preview)
          const blob = new Blob([output.html], {
            type: "text/html;charset=utf-8",
          })
          setConversion({ file, output: { ...output, blob } })
        }
      })
      .catch(() => {
        if (!obsolete) setConversion({ file, output: null })
      })
    return () => {
      obsolete = true
    }
  }, [file, m.preview])
  const current = conversion?.file === file ? conversion : null
  const output = current?.output
  return (
    <DocumentWorkspace
      tool="webarchive-to-html-converter"
      file={file}
      onFile={(next) => {
        setFile(next)
        setConversion(null)
      }}
      accept=".webarchive,application/x-webarchive"
      active={Boolean(output)}
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
                const { sampleArchive } = await import("./sample")
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
      {current?.output === null ? (
        <Alert variant="destructive" className="m-3 w-auto">
          <AlertDescription>{m.invalid}</AlertDescription>
        </Alert>
      ) : null}
      {file && output ? (
        <>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-3">
            <p
              dir="auto"
              className="min-w-0 flex-1 text-sm font-medium wrap-anywhere"
            >
              {output.title || m.preview}
            </p>
            <DocumentDownload
              file={output.blob}
              filename={file.name.replace(/(?:\.webarchive)?$/i, ".html")}
              label={m.download}
            />
          </div>
          {output.missing ? (
            <p className="border-b px-3 py-2 text-xs text-muted-foreground">
              {m.missing}
            </p>
          ) : null}
          <iframe
            title={m.preview}
            srcDoc={output.html}
            sandbox=""
            className="min-h-[clamp(18rem,42vh,30rem)] w-full flex-1 bg-white group-data-[focus=true]/workspace:min-h-0"
          />
        </>
      ) : null}
    </DocumentWorkspace>
  )
}
