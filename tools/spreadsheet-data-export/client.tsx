import { useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertTitle,
  AlertDescription,
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
import { useWorkbook } from "./use-workbook"
import { ExportPanel } from "./export-panel"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const { session, loading, error } = useWorkbook(file, m)
  return (
    <DocumentWorkspace
      tool="spreadsheet-data-export"
      file={file}
      onFile={setFile}
      accept=".xlsx,.xlsm,.xltx,.xltm"
      active={Boolean(file && !error)}
      fitContent
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
              <FileText />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {loading ? (
        <p role="status" className="flex items-center justify-center gap-2 p-6">
          <Spinner aria-hidden="true" />
          {m.opening}
        </p>
      ) : null}
      {session ? <ExportPanel session={session} messages={m} /> : null}
    </DocumentWorkspace>
  )
}
