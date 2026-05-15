import { useCallback, useRef, useState } from "react"
import type * as React from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { CameraCard } from "./client/camera-card"
import { useObjectUrl } from "./client/object-url"
import { ResultCard } from "./client/result-card"
import { SourceCard } from "./client/source-card"
import { UploadCard } from "./client/upload-card"
import { useQrCamera } from "./client/use-qr-camera"
import {
  QR_DECODER_ERRORS,
  decodeQrFromImageFile,
  isSupportedImageFile,
} from "./core/qr-decoder"

import type {
  QRCodeReaderMessages,
  QRScanResult,
  ScanMode,
} from "./client/types"

type QRCodeReaderClientProps = Readonly<{
  messages: QRCodeReaderMessages
}>

function resolveDecodeError(error: unknown, messages: QRCodeReaderMessages) {
  if (!(error instanceof Error)) {
    return messages.canvasReadError
  }

  switch (error.message) {
    case QR_DECODER_ERRORS.invalidFileType:
      return messages.invalidFileTypeError
    case QR_DECODER_ERRORS.imageLoadFailed:
      return messages.imageLoadError
    case QR_DECODER_ERRORS.contextUnavailable:
      return messages.canvasUnavailableError
    case QR_DECODER_ERRORS.canvasReadFailed:
      return messages.canvasReadError
    default:
      return messages.canvasReadError
  }
}

function QRCodeReaderClient({ messages }: QRCodeReaderClientProps) {
  const [mode, setMode] = useState<ScanMode>("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<QRScanResult | null>(null)
  const [error, setError] = useState("")
  const [isDecoding, setIsDecoding] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const previewUrl = useObjectUrl(selectedFile)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imageScanIdRef = useRef(0)

  const handleDecoded = useCallback(
    (decoded: Omit<QRScanResult, "source">, source: QRScanResult["source"]) => {
      setResult({ ...decoded, source })
      setError("")
    },
    []
  )

  const { cameraStatus, startCamera, stopCamera, videoRef } = useQrCamera({
    messages,
    onDecoded: handleDecoded,
    onError: setError,
  })

  async function handleFileSelected(file: File) {
    imageScanIdRef.current += 1
    const scanId = imageScanIdRef.current

    setSelectedFile(file)
    setIsDecoding(true)
    setError("")

    try {
      const decoded = await decodeQrFromImageFile(file)

      if (scanId !== imageScanIdRef.current) {
        return
      }

      if (decoded) {
        handleDecoded(decoded, "image")
      } else {
        setResult(null)
        setError(messages.noQrFoundError)
      }
    } catch (decodeError) {
      if (scanId !== imageScanIdRef.current) {
        return
      }

      setResult(null)
      setError(resolveDecodeError(decodeError, messages))
    } finally {
      if (scanId === imageScanIdRef.current) {
        setIsDecoding(false)
      }
    }
  }

  function handleFiles(files: readonly File[]) {
    const file = files[0]

    if (!file) {
      return
    }

    if (!isSupportedImageFile(file)) {
      setSelectedFile(null)
      setResult(null)
      setError(messages.invalidFileTypeError)
      return
    }

    void handleFileSelected(file)
  }

  function handleDragEnter(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDraggingOver(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    handleFiles(Array.from(event.dataTransfer.files))
  }

  function handleClearImage() {
    imageScanIdRef.current += 1
    setSelectedFile(null)
    setIsDecoding(false)
    setError("")

    if (result?.source === "image") {
      setResult(null)
    }
  }

  function handleModeChange(nextMode: ScanMode) {
    if (nextMode === "upload") {
      stopCamera()
    }

    setMode(nextMode)
    setError("")
  }

  return (
    <div className="flex flex-col gap-6">
      <SourceCard
        messages={messages}
        mode={mode}
        onModeChange={handleModeChange}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.9fr)]">
        {mode === "upload" ? (
          <UploadCard
            fileInputRef={fileInputRef}
            isDecoding={isDecoding}
            isDraggingOver={isDraggingOver}
            messages={messages}
            onClear={handleClearImage}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onFileChange={(event) => {
              handleFiles(Array.from(event.target.files ?? []))
              event.target.value = ""
            }}
            onSelectImage={() => fileInputRef.current?.click()}
            previewUrl={previewUrl}
            selectedFile={selectedFile}
          />
        ) : (
          <CameraCard
            messages={messages}
            onStartCamera={() => {
              void startCamera()
            }}
            onStopCamera={stopCamera}
            status={cameraStatus}
            videoRef={videoRef}
          />
        )}

        <ResultCard messages={messages} result={result} />
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

export default QRCodeReaderClient
