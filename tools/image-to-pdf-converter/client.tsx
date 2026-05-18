import { useEffect, useId, useRef } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { QueueCard } from "./client/queue-card"
import { ResultCard } from "./client/result-card"
import { SettingsCard } from "./client/settings-card"
import { UploadCard } from "./client/upload-card"
import { IMAGE_TO_PDF_TOOL_ID } from "./client/types"
import { useImageToPdf } from "./client/use-image-to-pdf"

import type { ImageToPdfMessages } from "./client/types"

type ImageToPdfClientProps = Readonly<{
  messages: ImageToPdfMessages
}>

function ImageToPdfClient({ messages }: ImageToPdfClientProps) {
  const inputId = useId()
  const state = useImageToPdf(messages)
  const addFilesRef = useRef(state.addFiles)

  useEffect(() => {
    addFilesRef.current = state.addFiles
  }, [state.addFiles])

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      if (state.isGenerating) {
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
  }, [state.isGenerating])

  return (
    <div className="flex flex-col gap-6" data-tool={IMAGE_TO_PDF_TOOL_ID}>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <UploadCard
            disabled={state.isGenerating}
            inputId={inputId}
            isAddingImages={state.isAddingImages}
            messages={messages}
            onFilesSelected={(files) => {
              void state.addFiles(files)
            }}
          />
          <QueueCard
            disabled={state.isGenerating}
            items={state.items}
            messages={messages}
            onClear={state.clearItems}
            onMoveDown={state.moveItemDown}
            onMoveUp={state.moveItemUp}
            onRemove={state.removeItem}
            onRotate={state.rotateItem}
          />
        </div>

        <SettingsCard
          canGenerate={state.canGenerate}
          disabled={state.isGenerating || state.isAddingImages}
          isGenerating={state.isGenerating}
          messages={messages}
          onGenerate={() => {
            void state.generatePdf()
          }}
          onOptionsChange={state.setOptions}
          options={state.options}
        />
      </div>

      {state.error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <ResultCard
        isGenerating={state.isGenerating}
        messages={messages}
        progress={state.generationProgress}
        result={state.result}
      />
    </div>
  )
}

export default ImageToPdfClient
