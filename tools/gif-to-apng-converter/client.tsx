import { useId, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  DEFAULT_GIF_TO_APNG_OPTIONS,
  convertGifToApng,
  isSupportedGifFile,
  normalizeGifToApngOptions,
  resolveUniqueApngOutputName,
} from "./core/apng-conversion"
import { createStoredZip } from "./core/zip"
import { OptionsCard } from "./client/options-card"
import { ResultsCard } from "./client/results-card"
import { UploadCard, fileKey } from "./client/upload-card"

import type { GifToApngBatchResult, GifToApngMessages } from "./client/types"
import type { GifToApngOptions } from "./core/apng-conversion"

type GifToApngClientProps = Readonly<{
  language: string
  messages: GifToApngMessages
}>

function resolveErrorMessage(error: unknown, messages: GifToApngMessages) {
  if (!(error instanceof Error)) {
    return messages.conversionFailedError
  }

  switch (error.message) {
    case "INVALID_GIF":
      return messages.invalidGifError
    case "EMPTY_GIF":
      return messages.emptyGifError
    case "INVALID_FRAME":
      return messages.invalidFrameError
    case "CANVAS_CONTEXT_UNAVAILABLE":
      return messages.canvasUnavailableError
    default:
      return messages.conversionFailedError
  }
}

function GifToApngClient({ language, messages }: GifToApngClientProps) {
  const inputId = useId()
  const [files, setFiles] = useState<File[]>([])
  const [options, setOptions] = useState<GifToApngOptions>(
    DEFAULT_GIF_TO_APNG_OPTIONS
  )
  const [batchResult, setBatchResult] = useState<GifToApngBatchResult | null>(
    null
  )
  const [error, setError] = useState("")
  const [isConverting, setIsConverting] = useState(false)

  function handleFilesSelected(selectedFiles: readonly File[]) {
    if (selectedFiles.length === 0) {
      return
    }

    let hadDuplicate = false
    let hadInvalidFile = false
    const existingKeys = new Set(files.map(fileKey))
    const nextFiles = [...files]

    for (const file of selectedFiles) {
      if (!isSupportedGifFile(file)) {
        hadInvalidFile = true
        continue
      }

      const key = fileKey(file)

      if (existingKeys.has(key)) {
        hadDuplicate = true
        continue
      }

      existingKeys.add(key)
      nextFiles.push(file)
    }

    if (nextFiles.length !== files.length) {
      setFiles(nextFiles)
      setBatchResult(null)
    }

    if (hadInvalidFile) {
      setError(messages.invalidFileTypeError)
      return
    }

    if (hadDuplicate) {
      setError(messages.duplicateFileError)
      return
    }

    setError("")
  }

  async function handleConvert() {
    if (files.length === 0 || isConverting) {
      setError(messages.noFilesError)
      return
    }

    setIsConverting(true)
    setBatchResult(null)
    setError("")

    const normalizedOptions = normalizeGifToApngOptions(options)
    const nameCounts = new Map<string, number>()
    const results: GifToApngBatchResult["results"] = []
    const failures: string[] = []

    try {
      for (const file of files) {
        const outputName = resolveUniqueApngOutputName(file.name, nameCounts)

        try {
          results.push(
            await convertGifToApng(file, normalizedOptions, outputName)
          )
        } catch (conversionError) {
          failures.push(resolveErrorMessage(conversionError, messages))
        }
      }

      const zipBlob =
        results.length > 1
          ? createStoredZip(
              await Promise.all(
                results.map(async (result) => ({
                  data: new Uint8Array(await result.blob.arrayBuffer()),
                  name: result.outputName,
                }))
              )
            )
          : null

      setBatchResult({ results, zipBlob })

      if (failures.length > 0) {
        setError(
          results.length
            ? `${messages.partialConversionError} ${failures[0]}`
            : (failures[0] ?? messages.conversionFailedError)
        )
      } else if (results.length === 0) {
        setError(messages.conversionFailedError)
      }
    } catch {
      setBatchResult(results.length ? { results, zipBlob: null } : null)
      setError(messages.zipFailedError)
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-start">
      <aside className="order-2 lg:sticky lg:top-6 lg:order-1 lg:row-span-3 lg:self-start">
        <OptionsCard
          fileCount={files.length}
          isConverting={isConverting}
          locale={language}
          messages={messages}
          onConvert={() => {
            void handleConvert()
          }}
          onOptionsChange={(nextOptions) => {
            setOptions(normalizeGifToApngOptions(nextOptions))
            setBatchResult(null)
            setError("")
          }}
          options={options}
        />
      </aside>

      <div className="order-1 min-w-0 lg:order-2">
        <UploadCard
          files={files}
          inputId={inputId}
          locale={language}
          messages={messages}
          onClearFiles={() => {
            setFiles([])
            setBatchResult(null)
            setError("")
          }}
          onFilesSelected={handleFilesSelected}
          onRemoveFile={(file) => {
            setFiles((currentFiles) =>
              currentFiles.filter(
                (currentFile) => fileKey(currentFile) !== fileKey(file)
              )
            )
            setBatchResult(null)
            setError("")
          }}
        />
      </div>

      {error ? (
        <Alert
          className="order-3 min-w-0 lg:col-start-2"
          role="alert"
          variant="destructive"
        >
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="order-4 min-w-0 lg:col-start-2">
        <ResultsCard
          batchResult={batchResult}
          isConverting={isConverting}
          locale={language}
          messages={messages}
        />
      </div>
    </div>
  )
}

export default GifToApngClient
