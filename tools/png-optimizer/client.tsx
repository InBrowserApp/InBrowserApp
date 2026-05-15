import { useId, useMemo, useRef, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  DEFAULT_PNG_OPTIMIZER_OPTIONS,
  INVALID_PNG_FILE_ERROR,
  isSupportedPngFile,
  normalizePngOptimizerOptions,
} from "./core/png-optimizer"
import {
  WORKER_UNAVAILABLE_ERROR,
  optimizePngFile,
} from "./client/optimizer-worker"
import { OptionsCard } from "./client/options-card"
import { ResultsCard } from "./client/results-card"
import { UploadCard } from "./client/upload-card"

import type {
  PngOptimizationResult,
  PngOptimizerOptions,
} from "./core/png-optimizer"
import type { PngOptimizerMessages } from "./client/types"

type PngOptimizerClientProps = Readonly<{
  messages: PngOptimizerMessages
}>

function resolveErrorMessage(error: unknown, messages: PngOptimizerMessages) {
  if (!(error instanceof Error)) {
    return messages.optimizationFailedError
  }

  switch (error.message) {
    case INVALID_PNG_FILE_ERROR:
      return messages.invalidFileTypeError
    case WORKER_UNAVAILABLE_ERROR:
      return messages.workerUnavailableError
    default:
      return messages.optimizationFailedError
  }
}

function PngOptimizerClient({ messages }: PngOptimizerClientProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [options, setOptions] = useState<PngOptimizerOptions>(
    DEFAULT_PNG_OPTIMIZER_OPTIONS
  )
  const [result, setResult] = useState<PngOptimizationResult | null>(null)
  const [error, setError] = useState("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const normalizedOptions = useMemo(
    () => normalizePngOptimizerOptions(options),
    [options]
  )

  function resetResult() {
    setResult(null)
    setError("")
  }

  function handleFileSelected(file: File | null) {
    if (!file) {
      return
    }

    resetResult()

    if (!isSupportedPngFile(file)) {
      setSelectedFile(null)
      setError(messages.invalidFileTypeError)
      return
    }

    setSelectedFile(file)
  }

  function handleClearFile() {
    setSelectedFile(null)
    resetResult()
  }

  async function handleOptimize() {
    if (isOptimizing) {
      return
    }

    if (!selectedFile) {
      setError(messages.noFileError)
      return
    }

    setIsOptimizing(true)
    resetResult()

    try {
      setResult(await optimizePngFile(selectedFile, normalizedOptions))
    } catch (optimizeError) {
      setError(resolveErrorMessage(optimizeError, messages))
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <UploadCard
          inputId={inputId}
          inputRef={inputRef}
          messages={messages}
          onClearFile={handleClearFile}
          onFileSelected={handleFileSelected}
          selectedFile={selectedFile}
        />

        <OptionsCard
          isOptimizing={isOptimizing}
          messages={messages}
          onOptimize={() => {
            void handleOptimize()
          }}
          onOptionsChange={(nextOptions) => {
            setOptions(normalizePngOptimizerOptions(nextOptions))
            setResult(null)
          }}
          options={normalizedOptions}
          selectedFile={selectedFile}
        />
      </div>

      {error ? (
        <Alert role="alert" variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <ResultsCard
        isOptimizing={isOptimizing}
        messages={messages}
        result={result}
      />
    </div>
  )
}

export default PngOptimizerClient
