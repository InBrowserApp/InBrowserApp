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
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Download, FileText } from "@workspace/ui/icons"
import {
  cellPosition,
  outputName,
} from "@workspace/spreadsheet-conversion/navigation"
import { useWorkbook } from "./use-workbook"
import { Worksheet } from "@workspace/ui/components/tool/spreadsheet-preview"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const { info, url, preview, error, loading, requestPreview } = useWorkbook(
    file,
    m
  )
  return (
    <DocumentWorkspace
      tool="ods-to-xlsx-converter"
      file={file}
      onFile={setFile}
      accept=".ods"
      active={Boolean(file && !error)}
      fitContent
      messages={m}
    >
      <div className="min-h-0 overflow-auto">
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
              <EmptyDescription>
                {m.formats}
                <br />
                {m.privacy}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {loading ? (
          <div className="flex flex-wrap items-center justify-center gap-3 p-6">
            <p role="status" className="flex items-center gap-2">
              <Spinner aria-hidden="true" />
              {m.working}
            </p>
            <Button variant="outline" onClick={() => setFile(null)}>
              {m.cancel}
            </Button>
          </div>
        ) : null}
        {info && url && file ? (
          <div className="min-w-0 space-y-5 p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p role="status" className="text-sm text-muted-foreground">
                {m.ready}
              </p>
              <Button
                asChild
                className="h-auto min-h-9 max-w-full whitespace-normal"
              >
                <a
                  href={url}
                  download={outputName(file.name, "ods")}
                  data-astro-prefetch="false"
                >
                  <Download aria-hidden="true" />
                  {m.download}
                </a>
              </Button>
            </div>
            {info.missingCaches ? (
              <Alert>
                <AlertTitle>{m.notes}</AlertTitle>
                <AlertDescription>{m.missingCaches}</AlertDescription>
              </Alert>
            ) : null}
            <Worksheet
              cellPosition={cellPosition}
              info={info}
              preview={preview}
              requestPreview={requestPreview}
              messages={m}
            />
          </div>
        ) : null}
        <aside
          className="space-y-2 border-t p-4 text-sm text-muted-foreground"
          aria-label={m.notes}
        >
          <h2 className="font-medium text-foreground">{m.notes}</h2>
          <p>{m.preserved}</p>
          <p>{m.limitations}</p>
          <p>{m.previewLimits}</p>
        </aside>
      </div>
    </DocumentWorkspace>
  )
}
