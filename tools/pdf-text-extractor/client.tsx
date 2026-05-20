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

import { PdfSummary } from "./components/pdf-summary"
import { TextResults } from "./components/text-results"
import { UploadCard } from "./components/upload-card"
import {
  createTextDownloadFileName,
  extractPdfText,
  isPdfFile,
  isPdfPasswordError,
} from "./core/pdf-text"

import type { PdfTextExtractorMessages } from "./client/types"
import type { PdfTextExtractionResult } from "./core/pdf-text"

type PdfTextExtractorClientProps = Readonly<{
  lang: string
  messages: PdfTextExtractorMessages
}>

const ACCEPTED_PDF_TYPES = "application/pdf,.pdf"

function PdfTextExtractorClient({
  lang,
  messages,
}: PdfTextExtractorClientProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const runIdRef = useRef(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<PdfTextExtractionResult | null>(null)
  const [error, setError] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  useEffect(() => {
    if (!selectedFile) {
      runIdRef.current += 1
      setResult(null)
      setIsExtracting(false)
      return
    }

    const fileToRead = selectedFile
    const currentRun = (runIdRef.current += 1)
    setIsExtracting(true)
    setError("")
    setResult(null)

    async function readText() {
      try {
        const { PDF_IMAGE_PAINT_OPERATIONS, loadPdfDocument } =
          await import("./pdfjs")
        const nextResult = await extractPdfText(fileToRead, {
          imagePaintOperations: PDF_IMAGE_PAINT_OPERATIONS,
          loadPdfDocument,
        })

        if (currentRun !== runIdRef.current) {
          return
        }

        setResult(nextResult)
      } catch (parseError) {
        if (currentRun !== runIdRef.current) {
          return
        }

        setError(toErrorMessage(parseError, messages))
        setResult(null)
      } finally {
        if (currentRun === runIdRef.current) {
          setIsExtracting(false)
        }
      }
    }

    void readText()
  }, [messages, selectedFile])

  const textBlob = useMemo(
    () =>
      result?.text
        ? new Blob([result.text], { type: "text/plain;charset=utf-8" })
        : null,
    [result]
  )
  const downloadUrl = useObjectUrl(textBlob)
  const downloadFileName = selectedFile
    ? createTextDownloadFileName(selectedFile.name)
    : createTextDownloadFileName("")

  function openFilePicker() {
    inputRef.current?.click()
  }

  function clearFile() {
    dragDepthRef.current = 0
    setIsDraggingOver(false)
    setSelectedFile(null)
    setResult(null)
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
        aria-hidden="true"
        className="sr-only"
        data-testid="pdf-text-input"
        onChange={handleFileChange}
        tabIndex={-1}
        type="file"
      />

      <Alert>
        <TriangleAlert aria-hidden="true" />
        <AlertTitle>{messages.extractionNoticeTitle}</AlertTitle>
        <AlertDescription>{messages.extractionNotice}</AlertDescription>
      </Alert>

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,24rem)_1fr]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <ToolPanelCard>
            <ToolPanelCardContent className="gap-5">
              {selectedFile ? (
                <PdfSummary
                  file={selectedFile}
                  lang={lang}
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
            <TextResults
              downloadFileName={downloadFileName}
              downloadUrl={downloadUrl}
              isLoading={isExtracting}
              lang={lang}
              messages={messages}
              result={result}
            />
          </ToolPanelCardContent>
        </ToolPanelCard>
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
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

    const nextUrl = URL.createObjectURL(blob)
    setUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [blob])

  return url
}

function toErrorMessage(error: unknown, messages: PdfTextExtractorMessages) {
  if (isPdfPasswordError(error)) {
    return messages.passwordError
  }

  return messages.parseError
}

export default PdfTextExtractorClient
