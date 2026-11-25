import { useState } from "react"
import { wpsAccept, wpsExtension } from "@workspace/legacy-doc/formats"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { DocumentView } from "@workspace/ui/components/tool/legacy-word-view"
import { useLegacyWordPreview } from "@workspace/ui/lib/use-legacy-word-preview"
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
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const supported = file && wpsExtension.test(file.name)
  const result = useLegacyWordPreview(supported ? file : null, m)
  const error =
    file && !supported
      ? "unsupported"
      : result && "error" in result && result.error

  return (
    <DocumentWorkspace
      tool="wps-viewer"
      file={file}
      onFile={setFile}
      accept={wpsAccept}
      active={Boolean(file && !error)}
      messages={m}
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{m[error]}</AlertDescription>
        </Alert>
      ) : null}
      {result && "loading" in result ? (
        <p
          role="status"
          className="flex flex-1 items-center justify-center gap-2 p-6"
        >
          <Spinner />
          {m.loading}
        </p>
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
      {result && "preview" in result ? (
        <DocumentView
          template={result.template}
          preview={result.preview}
          messages={m}
        />
      ) : null}
    </DocumentWorkspace>
  )
}
