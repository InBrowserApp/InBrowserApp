import { useId } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { OptionsCard } from "./client/options-card"
import { ResultCard } from "./client/result-card"
import type { ImageResizerMessages } from "./client/types"
import { UploadCard } from "./client/upload-card"
import { useImageResizer } from "./client/use-image-resizer"

type ImageResizerClientProps = Readonly<{
  messages: ImageResizerMessages
}>

function ImageResizerClient({ messages }: ImageResizerClientProps) {
  const inputId = useId()
  const {
    error,
    handleFileChange,
    isProcessing,
    options,
    resetOptions,
    result,
    resultPreviewUrl,
    runResize,
    selectedFile,
    setOptions,
    sourceDimensions,
    sourcePreviewUrl,
    updateHeight,
    updateWidth,
  } = useImageResizer(messages)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <UploadCard
          inputId={inputId}
          messages={messages}
          onFileChange={(file) => {
            void handleFileChange(file)
          }}
          selectedFile={selectedFile}
          sourceDimensions={sourceDimensions}
          sourcePreviewUrl={sourcePreviewUrl}
        />
        <OptionsCard
          inputId={inputId}
          isProcessing={isProcessing}
          messages={messages}
          onReset={resetOptions}
          onResize={runResize}
          options={options}
          selectedFile={selectedFile}
          setOptions={setOptions}
          updateHeight={updateHeight}
          updateWidth={updateWidth}
        />
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            {selectedFile
              ? messages.resizeErrorTitle
              : messages.invalidImageTitle}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <ResultCard
        messages={messages}
        result={result}
        resultPreviewUrl={resultPreviewUrl}
        sourceDimensions={sourceDimensions}
        sourcePreviewUrl={sourcePreviewUrl}
      />
    </div>
  )
}

export default ImageResizerClient
