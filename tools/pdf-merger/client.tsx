import { useEffect, useId, useRef } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import { TriangleAlert } from "@workspace/ui/icons"

import { ActionsCard } from "./components/actions-card"
import { QueueCard } from "./components/queue-card"
import { ResultCard } from "./components/result-card"
import { UploadCard } from "./components/upload-card"
import { PDF_MERGER_TOOL_ID } from "./client/types"
import { usePdfMerger } from "./client/use-pdf-merger"

import type { PdfMergerMessages } from "./client/types"

type PdfMergerClientProps = Readonly<{
  messages: PdfMergerMessages
}>

function PdfMergerClient({ messages }: PdfMergerClientProps) {
  const inputId = useId()
  const state = usePdfMerger(messages)
  const addFilesRef = useRef(state.addFiles)

  useEffect(() => {
    addFilesRef.current = state.addFiles
  }, [state.addFiles])

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      if (state.isMerging) {
        return
      }

      const files = Array.from(event.clipboardData?.files ?? [])

      if (files.length) {
        void addFilesRef.current(files)
      }
    }

    window.addEventListener("paste", handlePaste)

    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [state.isMerging])

  return (
    <div className="flex flex-col gap-6" data-tool={PDF_MERGER_TOOL_ID}>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <UploadCard
            disabled={state.isMerging}
            inputId={inputId}
            messages={messages}
            onFilesSelected={(files) => {
              void state.addFiles(files)
            }}
          />
          <QueueCard
            disabled={state.isMerging}
            inputSizeLabel={state.inputSizeLabel}
            items={state.items}
            messages={messages}
            onClear={state.clearItems}
            onMoveDown={state.moveItemDown}
            onMoveUp={state.moveItemUp}
            onPreview={state.setPreviewItemId}
            onRemove={state.removeItem}
            onReorder={state.reorder}
            readyPageCount={state.readyPageCount}
          />
        </div>

        <div className="flex flex-col gap-6 xl:sticky xl:top-6">
          <ActionsCard
            canMerge={state.canMerge}
            fileCount={state.items.length}
            inputSizeLabel={state.inputSizeLabel}
            isMerging={state.isMerging}
            messages={messages}
            onMerge={() => {
              void state.merge()
            }}
            onOutputNameChange={state.setOutputName}
            outputName={state.outputName}
            readyPageCount={state.readyPageCount}
          />
          <ResultCard
            isMerging={state.isMerging}
            messages={messages}
            progress={state.progress}
            result={state.result}
          />
        </div>
      </div>

      {state.error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            state.setPreviewItemId("")
          }
        }}
        open={Boolean(state.previewItem)}
      >
        <DialogContent
          className="h-[min(86vh,56rem)] max-w-[min(64rem,calc(100vw-2rem))] grid-rows-[auto_minmax(0,1fr)]"
          closeLabel={messages.closePreviewLabel}
        >
          <DialogHeader>
            <DialogTitle>
              {messages.previewTitle.replace(
                "{name}",
                state.previewItem?.name ?? ""
              )}
            </DialogTitle>
            <DialogDescription>{messages.localOnlyNote}</DialogDescription>
          </DialogHeader>
          {state.previewItem ? (
            <iframe
              className="min-h-0 w-full rounded-md border bg-muted"
              src={state.previewItem.previewUrl}
              title={state.previewItem.name}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PdfMergerClient
