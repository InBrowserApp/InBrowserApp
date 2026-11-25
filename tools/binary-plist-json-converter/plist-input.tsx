import { useEffect, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
import { Binary, Folder } from "@workspace/ui/icons"
import { examplePlist, plistToJson } from "./codec"
import type { Messages } from "./client"

type Result = { file: File; output: { text: string; blob: Blob } | null }

export function PlistInput({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  useEffect(() => {
    if (!file) return
    let obsolete = false
    void file
      .arrayBuffer()
      .then((bytes) => {
        if (obsolete) return
        const text = plistToJson(new Uint8Array(bytes))
        const blob = new Blob([text], {
          type: "application/json;charset=utf-8",
        })
        setResult({ file, output: { text, blob } })
      })
      .catch(() => {
        if (!obsolete) setResult({ file, output: null })
      })
    return () => {
      obsolete = true
    }
  }, [file])
  const current = result?.file === file ? result : null
  const output = current?.output
  return (
    <DocumentWorkspace
      tool="binary-plist-json-converter"
      file={file}
      onFile={(next) => {
        setResult(null)
        setFile(next)
      }}
      accept=".plist,application/x-plist"
      active={Boolean(output)}
      fitContent
      messages={m}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-64">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Binary aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
          <div className="flex flex-wrap justify-center gap-2">
            <Button data-file-open onClick={chooseFile}>
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
            <Button variant="outline" onClick={() => setFile(examplePlist())}>
              {m.example}
            </Button>
          </div>
        </Empty>
      )}
    >
      {file && !current ? (
        <p
          role="status"
          className="flex min-h-36 items-center justify-center gap-2 text-sm"
        >
          <Spinner aria-hidden="true" />
          {m.loading}
        </p>
      ) : null}
      {current?.output === null ? (
        <Alert variant="destructive" className="m-3 w-auto">
          <AlertDescription>{m.badPlist}</AlertDescription>
        </Alert>
      ) : null}
      {file && output ? (
        <>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-3">
            <h2 className="text-sm font-medium">{m.jsonOutput}</h2>
            <div className="flex flex-wrap gap-2">
              <ToolCopyButton
                value={output.text}
                copyLabel={m.copy}
                copiedLabel={m.copied}
                size="default"
              />
              <DocumentDownload
                file={output.blob}
                filename={file.name.replace(/(?:\.plist)?$/i, ".json")}
                label={m.downloadJson}
              />
            </div>
          </div>
          <pre
            dir="ltr"
            aria-label={m.jsonOutput}
            className="max-h-[30rem] min-h-0 overflow-auto px-4 py-3 text-sm group-data-[focus=true]/workspace:max-h-none focus-visible:outline-ring"
          >
            {output.text}
          </pre>
        </>
      ) : null}
    </DocumentWorkspace>
  )
}
