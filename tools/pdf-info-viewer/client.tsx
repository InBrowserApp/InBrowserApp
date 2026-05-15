import { useEffect, useMemo, useRef, useState } from "react"

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

import { InfoResults } from "./components/info-results"
import { PdfSummary } from "./components/pdf-summary"
import { UploadCard } from "./components/upload-card"
import { extractPdfInfo, isPdfFile, pdfInfoToJson } from "./core/pdf-info"

import type { PdfInfoViewerMessages } from "./client/types"
import type { PdfInfo } from "./core/pdf-info"

type PdfInfoViewerClientProps = Readonly<{
  language: string
  messages: PdfInfoViewerMessages
}>

const ACCEPTED_PDF_TYPES = "application/pdf,.pdf"

function PdfInfoViewerClient({ language, messages }: PdfInfoViewerClientProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const runIdRef = useRef(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [info, setInfo] = useState<PdfInfo | null>(null)
  const [error, setError] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  useEffect(() => {
    if (!selectedFile) {
      runIdRef.current += 1
      setInfo(null)
      setIsReading(false)
      return
    }

    const fileToRead = selectedFile
    const currentRun = (runIdRef.current += 1)
    setIsReading(true)
    setError("")
    setInfo(null)

    async function readInfo() {
      try {
        const nextInfo = await extractPdfInfo(fileToRead)

        if (currentRun !== runIdRef.current) {
          return
        }

        setInfo(nextInfo)
      } catch (parseError) {
        if (currentRun !== runIdRef.current) {
          return
        }

        setError(toErrorMessage(parseError, messages.parseError))
        setInfo(null)
      } finally {
        if (currentRun === runIdRef.current) {
          setIsReading(false)
        }
      }
    }

    void readInfo()
  }, [messages.parseError, selectedFile])

  const jsonExport = useMemo(() => (info ? pdfInfoToJson(info) : ""), [info])
  const jsonBlob = useMemo(
    () =>
      jsonExport
        ? new Blob([jsonExport], {
            type: "application/json",
          })
        : null,
    [jsonExport]
  )
  const jsonDownloadUrl = useObjectUrl(jsonBlob)

  function openFilePicker() {
    inputRef.current?.click()
  }

  function clearFile() {
    dragDepthRef.current = 0
    setIsDraggingOver(false)
    setSelectedFile(null)
    setInfo(null)
    setError("")
  }

  function selectFile(file: File | null) {
    dragDepthRef.current = 0
    setIsDraggingOver(false)

    if (!file) {
      return
    }

    if (!isPdfFile(file)) {
      clearFile()
      setError(messages.unsupportedFile)
      return
    }

    setError("")
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

  const dragHandlers = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={inputRef}
        accept={ACCEPTED_PDF_TYPES}
        aria-label={messages.dragDropOrClick}
        className="sr-only"
        data-testid="pdf-input"
        onChange={handleFileChange}
        type="file"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,24rem)_1fr]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <ToolPanelCard>
            <ToolPanelCardContent className="gap-5">
              {selectedFile ? (
                <PdfSummary
                  file={selectedFile}
                  messages={messages}
                  onChangeFile={openFilePicker}
                  onRemoveFile={clearFile}
                />
              ) : (
                <UploadCard
                  isDraggingOver={isDraggingOver}
                  messages={messages}
                  onClick={openFilePicker}
                  {...dragHandlers}
                />
              )}
            </ToolPanelCardContent>
          </ToolPanelCard>
        </div>

        <ToolPanelCard>
          <ToolPanelCardContent className="gap-5">
            <InfoResults
              info={info}
              isLoading={isReading}
              jsonDownloadUrl={jsonDownloadUrl}
              jsonExport={jsonExport}
              language={language}
              messages={messages}
            />
          </ToolPanelCardContent>
        </ToolPanelCard>
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

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default PdfInfoViewerClient
