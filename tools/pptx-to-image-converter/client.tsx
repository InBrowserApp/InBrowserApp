import { useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileImage } from "@workspace/ui/icons"
import { accepted, usePresentation } from "./use-presentation"
import { SlideExport } from "./slide-export"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const result = usePresentation(file)
  const ready = result && "render" in result ? result : null
  const error = result && "error" in result ? m[result.error] : null
  return (
    <DocumentWorkspace
      tool="pptx-to-image-converter"
      file={file}
      onFile={setFile}
      accept={accepted}
      active={Boolean(ready)}
      fitContent
      messages={m}
    >
      {!file ? (
        <Empty className="min-h-48">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileImage aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {file && !result ? (
        <p
          role="status"
          className="flex items-center justify-center gap-2 p-6 text-sm"
        >
          <Spinner />
          {m.reading}
        </p>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {ready ? (
        <SlideExport
          file={ready.file}
          total={ready.total}
          render={ready.render}
          messages={m}
        />
      ) : null}
    </DocumentWorkspace>
  )
}
