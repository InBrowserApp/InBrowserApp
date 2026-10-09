import { useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileText } from "@workspace/ui/icons"
import { Reader } from "./reader"
import { useDocument } from "./use-document"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const state = useDocument(file, m)
  return (
    <DocumentWorkspace
      tool="rtf-viewer"
      file={file}
      onFile={setFile}
      accept=".rtf,application/rtf,text/rtf"
      active={Boolean(file && !state?.error)}
      messages={m}
    >
      {state?.error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : state?.document ? (
        <Reader key={file?.name} document={state.document} messages={m} />
      ) : file ? (
        <p role="status" className="flex items-center justify-center gap-2 p-6">
          <Spinner />
          {m.loading}
        </p>
      ) : (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </DocumentWorkspace>
  )
}
