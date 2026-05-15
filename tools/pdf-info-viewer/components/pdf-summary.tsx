import { Button } from "@workspace/ui/components/ui/button"
import { FileText, RefreshCcw, Trash2 } from "@workspace/ui/icons"

import { formatBytes } from "../core/pdf-info"
import type { PdfInfoViewerMessages } from "../client/types"

type PdfSummaryProps = Readonly<{
  file: File
  messages: PdfInfoViewerMessages
  onChangeFile: () => void
  onRemoveFile: () => void
}>

function PdfSummary({
  file,
  messages,
  onChangeFile,
  onRemoveFile,
}: PdfSummaryProps) {
  return (
    <div className="flex min-h-[18rem] flex-col justify-between gap-5 rounded-lg border bg-muted/20 p-4">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground">
            <FileText />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {messages.selectedPdf}
            </p>
            <p className="mt-1 font-medium break-words">{file.name}</p>
          </div>
        </div>

        <dl className="grid gap-3 text-sm">
          <div className="rounded-lg border bg-background p-3">
            <dt className="text-muted-foreground">{messages.fileSize}</dt>
            <dd className="mt-1 font-medium">{formatBytes(file.size)}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <Button
          onClick={onChangeFile}
          type="button"
          variant="outline"
          className="w-full"
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.changeFile}
        </Button>
        <Button
          onClick={onRemoveFile}
          type="button"
          variant="outline"
          className="w-full"
        >
          <Trash2 data-icon="inline-start" />
          {messages.removeFile}
        </Button>
      </div>
    </div>
  )
}

export { PdfSummary }
