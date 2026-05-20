import { Button } from "@workspace/ui/components/ui/button"
import { Separator } from "@workspace/ui/components/ui/separator"
import { Download, Trash2, Upload } from "@workspace/ui/icons"

import { formatBytes } from "../client/utils"

import type { RemovePdfOwnerPasswordMessages } from "../client/types"

type FileSummaryCardProps = Readonly<{
  disabled: boolean
  file: File
  messages: RemovePdfOwnerPasswordMessages
  onChangeFile: () => void
  onRemoveFile: () => void
  onStart: () => void
}>

function FileSummaryCard({
  disabled,
  file,
  messages,
  onChangeFile,
  onRemoveFile,
  onStart,
}: FileSummaryCardProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{messages.selectedPdfTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {messages.actionDescription}
        </p>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <dt className="font-medium">{messages.fileNameLabel}</dt>
            <dd className="break-all text-muted-foreground">{file.name}</dd>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium">{messages.fileSizeLabel}</dt>
            <dd className="text-muted-foreground">{formatBytes(file.size)}</dd>
          </div>
        </dl>
      </div>

      <p className="text-sm text-muted-foreground">
        {messages.openPasswordNote}
      </p>

      <div className="flex flex-col gap-3">
        <Button
          className="w-full"
          disabled={disabled}
          onClick={onStart}
          type="button"
        >
          <Download data-icon="inline-start" />
          {messages.actionLabel}
        </Button>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            disabled={disabled}
            onClick={onChangeFile}
            type="button"
            variant="outline"
          >
            <Upload data-icon="inline-start" />
            {messages.changeFile}
          </Button>
          <Button
            disabled={disabled}
            onClick={onRemoveFile}
            type="button"
            variant="outline"
          >
            <Trash2 data-icon="inline-start" />
            {messages.removeFile}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { FileSummaryCard }
