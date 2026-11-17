import { useId } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { ExportCard } from "./client/export-card"
import { PageListCard } from "./client/page-list-card"
import { PDF_PAGE_ORGANIZER_TOOL_ID } from "./client/types"
import { UploadCard } from "./client/upload-card"
import { usePdfPageOrganizer } from "./client/use-pdf-page-organizer"

import type { PdfPageOrganizerMessages } from "./client/types"

type PdfPageOrganizerClientProps = Readonly<{
  messages: PdfPageOrganizerMessages
}>

function PdfPageOrganizerClient({ messages }: PdfPageOrganizerClientProps) {
  const inputId = useId()
  const state = usePdfPageOrganizer(messages)
  const controlsDisabled = state.isReading || state.isGenerating
  const currentStep = state.result ? 2 : state.file && !state.isReading ? 1 : 0

  return (
    <div className="flex flex-col gap-6" data-tool={PDF_PAGE_ORGANIZER_TOOL_ID}>
      <ol className="grid grid-cols-3 gap-3 border-b pb-4 text-sm">
        {[messages.uploadTitle, messages.pagesTitle, messages.exportTitle].map(
          (label, index) => {
            return (
              <li
                aria-current={index === currentStep ? "step" : undefined}
                className={cn(
                  "flex min-w-0 items-center gap-2 text-muted-foreground",
                  index === currentStep && "font-medium text-foreground"
                )}
                key={label}
              >
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="break-words">{label}</span>
              </li>
            )
          }
        )}
      </ol>
      <UploadCard
        disabled={controlsDisabled}
        file={state.file}
        inputId={inputId}
        isReading={state.isReading}
        messages={messages}
        onFileSelected={(file) => {
          void state.selectFile(file)
        }}
        pageCount={state.originalPageCount}
      />
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.file && !state.isReading ? (
        <>
          <PageListCard
            canReset={state.canReset}
            canUndo={state.canUndo}
            disabled={controlsDisabled}
            isRenderingPreviews={state.isRenderingPreviews}
            messages={messages}
            onMoveDown={state.movePageDown}
            onMovePage={state.movePageTo}
            onMoveUp={state.movePageUp}
            onRemove={state.removePage}
            onReset={state.resetPages}
            onUndo={state.undo}
            onRotateClockwise={state.rotatePageClockwise}
            pages={state.pages}
            previewError={state.previewError}
            previews={state.previews}
          />
          <ExportCard
            canGenerate={state.canGenerate}
            isGenerating={state.isGenerating}
            messages={messages}
            onGenerate={() => {
              void state.generatePdf()
            }}
            pageCount={state.pages.length}
            result={state.result}
          />
        </>
      ) : null}
    </div>
  )
}

export default PdfPageOrganizerClient
