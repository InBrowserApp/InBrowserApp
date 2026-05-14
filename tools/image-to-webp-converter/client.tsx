import { useEffect, useId, useMemo, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  DEFAULT_WEBP_OPTIONS,
  convertImageFileToWebp,
  isSupportedInputImage,
  normalizeWebpOptions,
  resolveUniqueWebpOutputName,
} from "./core/webp-conversion"
import { createStoredZip } from "./core/zip"
import { OptionsCard } from "./client/options-card"
import { ResultsCard } from "./client/results-card"
import { UploadCard, fileKey } from "./client/upload-card"

import type { ImageToWebpOptions } from "./core/webp-conversion"
import type { ImageToWebpMessages, WebpBatchResult } from "./client/types"

type ImageToWebpClientProps = Readonly<{
  messages: ImageToWebpMessages
}>

function resolveErrorMessage(error: unknown, messages: ImageToWebpMessages) {
  if (!(error instanceof Error)) {
    return messages.conversionFailedError
  }

  switch (error.message) {
    case "INVALID_IMAGE":
      return messages.invalidImageError
    case "CANVAS_CONTEXT_UNAVAILABLE":
      return messages.canvasUnavailableError
    case "WEBP_UNSUPPORTED":
      return messages.webpUnsupportedError
    default:
      return messages.conversionFailedError
  }
}

function ImageToWebpClient({ messages }: ImageToWebpClientProps) {
  const inputId = useId()
  const [files, setFiles] = useState<File[]>([])
  const [options, setOptions] =
    useState<ImageToWebpOptions>(DEFAULT_WEBP_OPTIONS)
  const [batchResult, setBatchResult] = useState<WebpBatchResult | null>(null)
  const [error, setError] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const optionsKey = useMemo(() => JSON.stringify(options), [options])

  useEffect(() => {
    setBatchResult(null)
    setError("")
  }, [files, optionsKey])

  function handleFilesSelected(selectedFiles: readonly File[]) {
    if (selectedFiles.length === 0) {
      return
    }

    let hadDuplicate = false
    let hadInvalidFile = false
    const existingKeys = new Set(files.map(fileKey))
    const nextFiles = [...files]

    for (const file of selectedFiles) {
      if (!isSupportedInputImage(file)) {
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

    setFiles(nextFiles)

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

    const nameCounts = new Map<string, number>()
    const results: WebpBatchResult["results"] = []
    const failures: string[] = []

    try {
      for (const file of files) {
        const outputName = resolveUniqueWebpOutputName(file.name, nameCounts)

        try {
          const result = await convertImageFileToWebp(file, options, outputName)
          results.push(result)
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
      }
    } catch {
      setBatchResult(results.length ? { results, zipBlob: null } : null)
      setError(messages.zipFailedError)
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <UploadCard
          files={files}
          inputId={inputId}
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
          }}
        />

        <OptionsCard
          fileCount={files.length}
          isConverting={isConverting}
          messages={messages}
          onConvert={() => {
            void handleConvert()
          }}
          onOptionsChange={(nextOptions) => {
            setOptions(normalizeWebpOptions(nextOptions))
          }}
          options={options}
        />
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <ResultsCard
        batchResult={batchResult}
        isConverting={isConverting}
        messages={messages}
      />
    </div>
  )
}

export default ImageToWebpClient
