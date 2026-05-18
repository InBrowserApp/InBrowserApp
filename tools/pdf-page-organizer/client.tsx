import { useId } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

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

  return (
    <div className="flex flex-col gap-6" data-tool={PDF_PAGE_ORGANIZER_TOOL_ID}>
      <div className="grid items-start gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-6">
          <UploadCard
            disabled={controlsDisabled}
            file={state.file}
            inputId={inputId}
            isReading={state.isReading}
            messages={messages}
            onFileSelected={(file) => {
              void state.selectFile(file)
            }}
            pageCount={state.pages.length}
          />

          <ExportCard
            canGenerate={state.canGenerate}
            isGenerating={state.isGenerating}
            messages={messages}
            onGenerate={() => {
              void state.generatePdf()
            }}
            result={state.result}
          />
        </div>

        <PageListCard
          disabled={controlsDisabled}
          isRenderingPreviews={state.isRenderingPreviews}
          messages={messages}
          onMoveDown={state.movePageDown}
          onMovePage={state.movePageTo}
          onMoveUp={state.movePageUp}
          onRemove={state.removePage}
          onReset={state.resetPages}
          onRotateClockwise={state.rotatePageClockwise}
          pages={state.pages}
          previewError={state.previewError}
          previews={state.previews}
        />
      </div>

      {state.error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

export default PdfPageOrganizerClient
