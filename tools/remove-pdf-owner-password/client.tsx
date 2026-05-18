import { useEffect, useRef, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { TriangleAlert } from "@workspace/ui/icons"

import { createOutputFileName, isPdfFile } from "./core/file"
import { FileSummaryCard } from "./components/file-summary-card"
import { ResultCard } from "./components/result-card"
import { UploadCard } from "./components/upload-card"
import { toDisplayErrorMessage } from "./client/utils"
import { removePdfOwnerPasswordWithWorker } from "./workers/remove-owner-password-worker-client"

import type { PdfResult, RemovePdfOwnerPasswordMessages } from "./client/types"

type RemovePdfOwnerPasswordClientProps = Readonly<{
  messages: RemovePdfOwnerPasswordMessages
}>

const ACCEPTED_PDF_TYPES = "application/pdf,.pdf"

function RemovePdfOwnerPasswordClient({
  messages,
}: RemovePdfOwnerPasswordClientProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const runIdRef = useRef(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<PdfResult | null>(null)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const resultUrl = useObjectUrl(result?.blob ?? null)

  useEffect(() => {
    return () => {
      runIdRef.current += 1
    }
  }, [])

  function openFilePicker() {
    inputRef.current?.click()
  }

  function clearFile() {
    runIdRef.current += 1
    dragDepthRef.current = 0
    setIsDraggingOver(false)
    setSelectedFile(null)
    setResult(null)
    setError("")
    setIsProcessing(false)
  }

  function selectFile(file: File | null) {
    dragDepthRef.current = 0
    setIsDraggingOver(false)
    setResult(null)

    if (!file) {
      return
    }

    if (!isPdfFile(file)) {
      setSelectedFile(null)
      setError(messages.unsupportedFile)
      return
    }

    if (file.size === 0) {
      setSelectedFile(null)
      setError(messages.emptyFileError)
      return
    }

    runIdRef.current += 1
    setError("")
    setIsProcessing(false)
    setSelectedFile(file)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0] ?? null)
    event.target.value = ""
  }

  function handleDragEnter(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDraggingOver(true)
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) {
      setIsDraggingOver(false)
    }
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    selectFile(event.dataTransfer.files?.[0] ?? null)
  }

  async function processSelectedFile() {
    if (!selectedFile) {
      return
    }

    const currentRun = (runIdRef.current += 1)

    setIsProcessing(true)
    setError("")
    setResult(null)

    try {
      const blob = await removePdfOwnerPasswordWithWorker(selectedFile)

      if (currentRun !== runIdRef.current) {
        return
      }

      setResult({
        blob,
        fileName: createOutputFileName(selectedFile.name),
      })
    } catch (conversionError) {
      if (currentRun !== runIdRef.current) {
        return
      }

      setError(toDisplayErrorMessage(conversionError, messages))
    } finally {
      if (currentRun === runIdRef.current) {
        setIsProcessing(false)
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={inputRef}
        accept={ACCEPTED_PDF_TYPES}
        aria-hidden="true"
        className="sr-only"
        data-testid="pdf-input"
        onChange={handleFileChange}
        tabIndex={-1}
        type="file"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,26rem)_1fr]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <ToolPanelCard>
            <ToolPanelCardContent className="gap-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">
                  {messages.uploadTitle}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {messages.uploadDescription}
                </p>
              </div>

              {selectedFile ? (
                <FileSummaryCard
                  disabled={isProcessing}
                  file={selectedFile}
                  messages={messages}
                  onChangeFile={openFilePicker}
                  onRemoveFile={clearFile}
                  onStart={() => {
                    void processSelectedFile()
                  }}
                />
              ) : (
                <UploadCard
                  isDraggingOver={isDraggingOver}
                  messages={messages}
                  onClick={openFilePicker}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              )}
            </ToolPanelCardContent>
          </ToolPanelCard>
        </div>

        <ResultCard
          isProcessing={isProcessing}
          messages={messages}
          result={result}
          resultUrl={resultUrl}
          selectedFile={selectedFile}
        />
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

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [blob])

  return url
}

export default RemovePdfOwnerPasswordClient
