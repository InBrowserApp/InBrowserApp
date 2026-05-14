import { useEffect, useId, useMemo, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { InputCard } from "./client/input-card"
import { optimizeSvgMarkup } from "./client/optimize-svg"
import { OptionsCard } from "./client/options-card"
import { ResultCard } from "./client/result-card"
import {
  DEFAULT_OPTIONS,
  SAMPLE_SVG,
  calculateMetrics,
  createSvgBlob,
  deriveOptimizedFileName,
  isLikelySvgMarkup,
} from "./core/svg-optimizer"

import type { InputMode, SvgOptimizationResult } from "./client/types"
import type { SvgOptimizerMessages } from "./client/types"
import type { SvgOptimizerOptions } from "./core/svg-optimizer"

type SvgOptimizerClientProps = Readonly<{
  messages: SvgOptimizerMessages
}>

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

function SvgOptimizerClient({ messages }: SvgOptimizerClientProps) {
  const inputId = useId()
  const [inputMode, setInputMode] = useState<InputMode>("file")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("pasted.svg")
  const [sourceText, setSourceText] = useState("")
  const [options, setOptions] = useState<SvgOptimizerOptions>(DEFAULT_OPTIONS)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<SvgOptimizationResult | null>(null)
  const [resultVersion, setResultVersion] = useState(0)

  const sourceBlob = useMemo(
    () =>
      sourceText && isLikelySvgMarkup(sourceText)
        ? createSvgBlob(sourceText)
        : null,
    [sourceText]
  )
  const optimizedBlob = useMemo(
    () => (result ? createSvgBlob(result.optimizedSvg) : null),
    [result]
  )
  const sourcePreviewUrl = useObjectUrl(sourceBlob)
  const optimizedPreviewUrl = useObjectUrl(optimizedBlob)

  function clearResult() {
    setResult(null)
    setError("")
  }

  function resetSource(nextMode = inputMode) {
    setInputMode(nextMode)
    setSelectedFile(null)
    setFileName(nextMode === "code" ? "pasted.svg" : "")
    setSourceText("")
    clearResult()
  }

  async function handleFilesSelected(files: readonly File[]) {
    if (files.length === 0) {
      return
    }

    if (files.length > 1) {
      setError(messages.onlyOneFileError)
      return
    }

    const [file] = files

    if (!file) {
      return
    }

    if (
      !file.type.includes("svg") &&
      !file.name.toLowerCase().endsWith(".svg")
    ) {
      setError(messages.invalidFileTypeError)
      return
    }

    try {
      const nextSourceText = await file.text()

      if (!isLikelySvgMarkup(nextSourceText)) {
        setError(messages.invalidSvgError)
        return
      }

      setInputMode("file")
      setSelectedFile(file)
      setFileName(file.name)
      setSourceText(nextSourceText)
      clearResult()
    } catch {
      setError(messages.readError)
    }
  }

  function handleTextChange(value: string) {
    setInputMode("code")
    setSelectedFile(null)
    setFileName("pasted.svg")
    setSourceText(value)
    clearResult()
  }

  function handleLoadSample() {
    setInputMode("code")
    setSelectedFile(null)
    setFileName("sample.svg")
    setSourceText(SAMPLE_SVG)
    clearResult()
  }

  async function handleOptimize() {
    if (isOptimizing || !sourceText) {
      return
    }

    setIsOptimizing(true)
    setError("")

    try {
      const optimizedSvg = await optimizeSvgMarkup(
        sourceText,
        options,
        messages.invalidSvgError
      )

      setResultVersion((version) => version + 1)
      setResult({
        fileName: deriveOptimizedFileName(fileName),
        metrics: calculateMetrics(sourceText, optimizedSvg),
        optimizedSvg,
        options,
      })
    } catch {
      setResult(null)
      setError(messages.optimizeFailedError)
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="grid gap-6 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:items-start">
      <aside className="min-w-0 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
        <OptionsCard
          canOptimize={isLikelySvgMarkup(sourceText)}
          isOptimizing={isOptimizing}
          messages={messages}
          onChange={(nextOptions) => {
            setOptions(nextOptions)
            clearResult()
          }}
          onOptimize={() => {
            void handleOptimize()
          }}
          options={options}
        />
      </aside>

      <div className="flex min-w-0 flex-col gap-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
        <InputCard
          fileName={fileName || "pasted.svg"}
          inputId={inputId}
          messages={messages}
          mode={inputMode}
          onClear={() => resetSource(inputMode)}
          onFilesSelected={(files) => {
            void handleFilesSelected(files)
          }}
          onLoadSample={handleLoadSample}
          onModeChange={(mode) => resetSource(mode)}
          onTextChange={handleTextChange}
          previewUrl={sourcePreviewUrl}
          selectedFile={selectedFile}
          sourceText={sourceText}
        />

        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <ResultCard
          downloadUrl={optimizedPreviewUrl}
          key={result ? resultVersion : "empty"}
          messages={messages}
          optimizedPreviewUrl={optimizedPreviewUrl}
          result={result}
          sourcePreviewUrl={sourcePreviewUrl}
        />
      </div>
    </div>
  )
}

export default SvgOptimizerClient
