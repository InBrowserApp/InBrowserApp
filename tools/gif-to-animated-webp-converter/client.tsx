import { useEffect, useId, useMemo, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { OptionsCard } from "./client/options-card"
import { ResultsCard } from "./client/results-card"
import { UploadCard, fileKey } from "./client/upload-card"
import { convertGifFileToAnimatedWebp } from "./core/animated-webp-conversion"
import {
  DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS,
  isSupportedGifFile,
  normalizeGifToAnimatedWebpOptions,
  resolveUniqueAnimatedWebpOutputName,
} from "./core/gif-frame-rendering"
import { createStoredZip } from "./core/zip"

import type {
  AnimatedWebpBatchResult,
  GifToAnimatedWebpMessages,
} from "./client/types"
import type { GifToAnimatedWebpOptions } from "./core/gif-frame-rendering"

type GifToAnimatedWebpClientProps = Readonly<{
  messages: GifToAnimatedWebpMessages
}>

function resolveErrorMessage(
  error: unknown,
  messages: GifToAnimatedWebpMessages
) {
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

function GifToAnimatedWebpClient({ messages }: GifToAnimatedWebpClientProps) {
  const inputId = useId()
  const [files, setFiles] = useState<File[]>([])
  const [options, setOptions] = useState<GifToAnimatedWebpOptions>(
    DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS
  )
  const [batchResult, setBatchResult] =
    useState<AnimatedWebpBatchResult | null>(null)
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
    const results: AnimatedWebpBatchResult["results"] = []
    const failures: string[] = []

    try {
      for (const file of files) {
        const outputName = resolveUniqueAnimatedWebpOutputName(
          file.name,
          nameCounts
        )

        try {
          const result = await convertGifFileToAnimatedWebp(
            file,
            options,
            outputName
          )
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
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
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
            setOptions(normalizeGifToAnimatedWebpOptions(nextOptions))
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

export default GifToAnimatedWebpClient
