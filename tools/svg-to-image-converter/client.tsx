import { useEffect, useId, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  deriveOutputFileName,
  getSvgDimensions,
  normalizeBackgroundColor,
  resolveLockedHeight,
  resolveLockedWidth,
  resolveOutputSize,
} from "./core/svg-conversion"
import { convertSvgToRasterBlob } from "./client/convert-svg-to-raster"
import { OptionsCard } from "./client/options-card"
import { ResultCard } from "./client/result-card"
import { UploadCard } from "./client/upload-card"

import type { SvgToImageMessages, SvgToImageResult } from "./client/types"
import type { OutputFormat, SvgDimensions } from "./core/svg-conversion"

type SvgToImageClientProps = Readonly<{
  messages: SvgToImageMessages
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

function SvgToImageConverterClient({ messages }: SvgToImageClientProps) {
  const inputId = useId()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [svgText, setSvgText] = useState("")
  const [sourceDimensions, setSourceDimensions] =
    useState<SvgDimensions | null>(null)
  const [format, setFormat] = useState<OutputFormat>("png")
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [keepAspect, setKeepAspect] = useState(true)
  const [useBackground, setUseBackground] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [quality, setQuality] = useState(92)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<SvgToImageResult | null>(null)

  const sourcePreviewUrl = useObjectUrl(selectedFile)
  const resultPreviewUrl = useObjectUrl(result?.blob ?? null)

  function clearResult() {
    setResult(null)
    setError("")
  }

  function resetToOriginal() {
    if (!sourceDimensions) {
      return
    }

    setWidth(sourceDimensions.width)
    setHeight(sourceDimensions.height)
    clearResult()
  }

  function handleRemoveFile() {
    setSelectedFile(null)
    setSvgText("")
    setSourceDimensions(null)
    setWidth(512)
    setHeight(512)
    setKeepAspect(true)
    setUseBackground(false)
    setBackgroundColor("#ffffff")
    setQuality(92)
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
      const nextSvgText = await file.text()
      const nextDimensions = getSvgDimensions(
        nextSvgText,
        messages.invalidSvgError
      )

      setSelectedFile(file)
      setSvgText(nextSvgText)
      setSourceDimensions(nextDimensions)
      setWidth(nextDimensions.width)
      setHeight(nextDimensions.height)
      setKeepAspect(true)
      clearResult()
    } catch (readError) {
      setError(
        readError instanceof Error ? readError.message : messages.readError
      )
    }
  }

  function handleWidthChange(value: number) {
    setWidth(value)

    if (keepAspect) {
      setHeight(resolveLockedHeight(value, sourceDimensions))
    }

    clearResult()
  }

  function handleHeightChange(value: number) {
    setHeight(value)

    if (keepAspect) {
      setWidth(resolveLockedWidth(value, sourceDimensions))
    }

    clearResult()
  }

  function handleKeepAspectChange(value: boolean) {
    setKeepAspect(value)

    if (value) {
      setHeight(resolveLockedHeight(width, sourceDimensions))
    }

    clearResult()
  }

  function handleFormatChange(value: OutputFormat) {
    setFormat(value)
    setBackgroundColor((currentColor) =>
      normalizeBackgroundColor(currentColor, value)
    )
    clearResult()
  }

  async function handleConvert() {
    if (!selectedFile || !svgText) {
      return
    }

    setIsConverting(true)
    setError("")

    try {
      const dimensions = resolveOutputSize(sourceDimensions, width, height)
      const blob = await convertSvgToRasterBlob(
        {
          backgroundColor,
          format,
          height: dimensions.height,
          quality,
          svgText,
          useBackground,
          width: dimensions.width,
        },
        {
          convertFailedError: messages.convertFailedError,
          imageLoadFailedError: messages.imageLoadFailedError,
          noCanvasError: messages.noCanvasError,
        }
      )

      setResult({
        blob,
        dimensions,
        fileName: deriveOutputFileName(selectedFile.name, format),
        format,
      })
    } catch (convertError) {
      setResult(null)
      setError(
        convertError instanceof Error
          ? convertError.message
          : messages.convertFailedError
      )
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <UploadCard
        inputId={inputId}
        messages={messages}
        onFilesSelected={(files) => {
          void handleFilesSelected(files)
        }}
        onRemoveFile={handleRemoveFile}
        selectedFile={selectedFile}
        sourceDimensions={sourceDimensions}
        sourcePreviewUrl={sourcePreviewUrl}
      />

      {selectedFile ? (
        <OptionsCard
          backgroundColor={backgroundColor}
          format={format}
          height={height}
          isConverting={isConverting}
          keepAspect={keepAspect}
          messages={messages}
          onBackgroundColorChange={(value) => {
            setBackgroundColor(value)
            clearResult()
          }}
          onConvert={() => {
            void handleConvert()
          }}
          onFormatChange={handleFormatChange}
          onHeightChange={handleHeightChange}
          onKeepAspectChange={handleKeepAspectChange}
          onQualityChange={(value) => {
            setQuality(value)
            clearResult()
          }}
          onReset={resetToOriginal}
          onUseBackgroundChange={(value) => {
            setUseBackground(value)
            clearResult()
          }}
          onWidthChange={handleWidthChange}
          quality={quality}
          selectedFile={selectedFile}
          useBackground={useBackground}
          width={width}
        />
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.meta.name}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <ResultCard
        downloadUrl={resultPreviewUrl}
        messages={messages}
        result={result}
        resultPreviewUrl={resultPreviewUrl}
        selectedFile={selectedFile}
        sourceDimensions={sourceDimensions}
      />
    </div>
  )
}

export default SvgToImageConverterClient
