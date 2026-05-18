import { useId, useMemo, useRef, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  DEFAULT_PAGE_NUMBER_OPTIONS,
  normalizePageNumberOptions,
} from "./core/options"
import { PAGE_RANGE_ERROR, parsePageSelection } from "./core/page-range"
import {
  addPageNumbersToPdf,
  createPdfBlob,
  getNumberedPdfFileName,
  inspectPdfBytes,
  isPdfFile,
} from "./core/pdf-page-numbers"
import { PreviewCard } from "./client/preview-card"
import { ResultCard } from "./client/result-card"
import { SettingsCard } from "./client/settings-card"
import { UploadCard } from "./client/upload-card"
import { getRangeErrorMessage, resolvePdfErrorMessage } from "./client/utils"

import type { PageRangeErrorCode } from "./core/page-range"
import type { PdfInspection } from "./core/types"
import type {
  PageNumberFormOptions,
  PdfPageNumberAdderMessages,
  PdfPageNumberResult,
} from "./client/types"

type PdfPageNumberAdderClientProps = Readonly<{
  messages: PdfPageNumberAdderMessages
}>

type FileState = Readonly<{
  file: File
  inspection: PdfInspection
}>

const defaultFormOptions: PageNumberFormOptions = {
  fontFamily: DEFAULT_PAGE_NUMBER_OPTIONS.fontFamily,
  fontSize: DEFAULT_PAGE_NUMBER_OPTIONS.fontSize,
  format: DEFAULT_PAGE_NUMBER_OPTIONS.format,
  marginX: DEFAULT_PAGE_NUMBER_OPTIONS.marginX,
  marginY: DEFAULT_PAGE_NUMBER_OPTIONS.marginY,
  position: DEFAULT_PAGE_NUMBER_OPTIONS.position,
  startNumber: DEFAULT_PAGE_NUMBER_OPTIONS.startNumber,
}

function PdfPageNumberAdderClient({ messages }: PdfPageNumberAdderClientProps) {
  const inputId = useId()
  const readRunRef = useRef(0)
  const generateRunRef = useRef(0)
  const [fileState, setFileState] = useState<FileState | null>(null)
  const [formOptions, setFormOptions] =
    useState<PageNumberFormOptions>(defaultFormOptions)
  const [rangeInput, setRangeInput] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<PdfPageNumberResult | null>(null)
  const pageCount = fileState?.inspection.pageCount ?? 0
  const rangeValidation = useMemo(
    () => validatePageRange(rangeInput, pageCount),
    [pageCount, rangeInput]
  )
  const rangeError = rangeValidation.error
    ? getRangeErrorMessage(rangeValidation.error, messages)
    : ""
  const canGenerate =
    Boolean(fileState) && !isReading && !isGenerating && !rangeError

  async function selectFile(file: File | null) {
    readRunRef.current += 1
    generateRunRef.current += 1
    setResult(null)

    if (!file) {
      return
    }

    if (!isPdfFile(file)) {
      setFileState(null)
      setRangeInput("")
      setError(messages.unsupportedFile)
      return
    }

    const currentReadRun = readRunRef.current
    setIsReading(true)
    setError("")

    try {
      const inspection = await inspectPdfBytes(await file.arrayBuffer())

      if (currentReadRun !== readRunRef.current) {
        return
      }

      setFileState({ file, inspection })
      setRangeInput("")
      setResult(null)
    } catch (readError) {
      if (currentReadRun !== readRunRef.current) {
        return
      }

      setFileState(null)
      setError(
        resolvePdfErrorMessage(readError, messages, messages.readPdfError)
      )
    } finally {
      if (currentReadRun === readRunRef.current) {
        setIsReading(false)
      }
    }
  }

  function removeFile() {
    readRunRef.current += 1
    generateRunRef.current += 1
    setFileState(null)
    setRangeInput("")
    setError("")
    setResult(null)
    setIsReading(false)
    setIsGenerating(false)
  }

  async function generatePdf() {
    if (!fileState) {
      setError(messages.noFileError)
      return
    }

    if (rangeValidation.error) {
      setError(getRangeErrorMessage(rangeValidation.error, messages))
      return
    }

    const currentGenerateRun = (generateRunRef.current += 1)
    setIsGenerating(true)
    setError("")
    setResult(null)

    try {
      const bytes = await addPageNumbersToPdf(
        await fileState.file.arrayBuffer(),
        normalizePageNumberOptions({
          ...formOptions,
          pages: rangeValidation.pages,
        })
      )

      if (currentGenerateRun !== generateRunRef.current) {
        return
      }

      setResult({
        blob: createPdfBlob(bytes),
        fileName: getNumberedPdfFileName(fileState.file.name),
        pageCount: rangeValidation.pages.length,
      })
    } catch (generateError) {
      if (currentGenerateRun !== generateRunRef.current) {
        return
      }

      setError(
        resolvePdfErrorMessage(
          generateError,
          messages,
          messages.generateFailedError
        )
      )
    } finally {
      if (currentGenerateRun === generateRunRef.current) {
        setIsGenerating(false)
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <UploadCard
            disabled={isReading || isGenerating}
            file={fileState?.file ?? null}
            inputId={inputId}
            isReading={isReading}
            messages={messages}
            onFileSelected={(file) => {
              void selectFile(file)
            }}
            onRemoveFile={removeFile}
            pageCount={pageCount}
          />
          <ResultCard
            isGenerating={isGenerating}
            messages={messages}
            result={result}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-6">
          <SettingsCard
            canGenerate={canGenerate}
            disabled={isReading || isGenerating || !fileState}
            isGenerating={isGenerating}
            messages={messages}
            onGenerate={() => {
              void generatePdf()
            }}
            onOptionsChange={(options) => {
              setFormOptions(options)
              setResult(null)
            }}
            onRangeInputChange={(value) => {
              setRangeInput(value)
              setResult(null)
              setError("")
            }}
            options={formOptions}
            rangeError={rangeError}
            rangeInput={rangeInput}
          />
          <PreviewCard
            messages={messages}
            options={formOptions}
            pageCount={pageCount}
            selectedPageCount={rangeValidation.pages.length}
          />
        </div>
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

function validatePageRange(input: string, pageCount: number) {
  if (pageCount < 1) {
    return { error: null, pages: [] }
  }

  try {
    return {
      error: null,
      pages: parsePageSelection(input, pageCount),
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? (error.message as PageRangeErrorCode)
          : PAGE_RANGE_ERROR.InvalidToken,
      pages: [],
    }
  }
}

export default PdfPageNumberAdderClient
