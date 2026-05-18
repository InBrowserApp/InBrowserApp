import { useId, useRef } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { PreviewCard } from "./client/components/preview-card"
import { SettingsCard } from "./client/components/settings-card"
import { UploadCard } from "./client/components/upload-card"
import { useObjectUrl } from "./client/object-url"
import { usePdfToImage } from "./client/use-pdf-to-image"

import type { PdfToImageMessages } from "./client/types"

type PdfToImageClientProps = Readonly<{
  messages: PdfToImageMessages
}>

function PdfToImageClient({ messages }: PdfToImageClientProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const state = usePdfToImage(messages)
  const currentImageUrl = useObjectUrl(state.currentImage?.blob ?? null)
  const zipUrl = useObjectUrl(state.zipResult?.blob ?? null)
  const isBusy =
    state.isLoadingDocument || state.isRendering || state.isExporting

  return (
    <div className="flex flex-col gap-6" data-tool="pdf-to-image-converter">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(18rem,26rem)_1fr]">
        <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-6">
          <UploadCard
            disabled={isBusy}
            file={state.selectedFile}
            inputId={inputId}
            isLoadingDocument={state.isLoadingDocument}
            messages={messages}
            numPages={state.numPages}
            onClear={state.clearFile}
            onOpenPicker={() => {
              inputRef.current?.click()
            }}
            onSelectFile={state.selectFile}
          />
          <SettingsCard
            currentImage={state.currentImage}
            currentImageName={state.currentImageName}
            currentImageUrl={currentImageUrl}
            disabled={
              !state.numPages || state.isLoadingDocument || state.isRendering
            }
            exportProgress={state.exportProgress}
            isExporting={state.isExporting}
            messages={messages}
            numPages={state.numPages}
            onExportAll={() => {
              void state.exportAllPages()
            }}
            onOptionsChange={state.updateOptions}
            options={state.options}
            zipResult={state.zipResult}
            zipUrl={zipUrl}
          />
        </div>

        <PreviewCard
          image={state.currentImage}
          imageUrl={currentImageUrl}
          isLoadingDocument={state.isLoadingDocument}
          isRendering={state.isRendering}
          messages={messages}
          numPages={state.numPages}
          onPageChange={state.updatePage}
          page={state.page}
        />
      </div>

      <input
        ref={inputRef}
        accept="application/pdf,.pdf"
        aria-hidden="true"
        className="sr-only"
        data-testid="pdf-to-image-picker"
        disabled={isBusy}
        onChange={(event) => {
          state.selectFile(event.target.files?.[0] ?? null)
          event.target.value = ""
        }}
        tabIndex={-1}
        type="file"
      />

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

export default PdfToImageClient
