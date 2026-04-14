import { useEffect, useId, useMemo, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  convertImageFileToIco,
  isSupportedInputImage,
  normalizeIcoSizes,
  resolveIcoOutputName,
} from "./core/convert-image-to-ico"
import { OptionsCard } from "./client/options-card"
import { ResultCard } from "./client/result-card"
import { UploadCard } from "./client/upload-card"

import type { ImageToIcoOptions } from "./core/convert-image-to-ico"
import type { ImageToIcoMessages } from "./client/types"

type ImageToIcoClientProps = Readonly<{
  messages: ImageToIcoMessages
}>

const DEFAULT_OPTIONS: ImageToIcoOptions = {
  backgroundColor: "#ffffff",
  backgroundEnabled: false,
  sizes: [16, 32, 48, 256],
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

function resolveErrorMessage(error: unknown, messages: ImageToIcoMessages) {
  if (!(error instanceof Error)) {
    return messages.conversionFailedError
  }

  switch (error.message) {
    case "CANVAS_CONTEXT_UNAVAILABLE":
      return messages.canvasUnavailableError
    case "INVALID_IMAGE":
      return messages.invalidImageError
    case "NO_SIZES_SELECTED":
      return messages.selectSizeError
    default:
      return messages.conversionFailedError
  }
}

function ImageToIcoClient({ messages }: ImageToIcoClientProps) {
  const inputId = useId()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [error, setError] = useState("")
  const [isConverting, setIsConverting] = useState(false)

  const normalizedSizes = useMemo(
    () => normalizeIcoSizes(options.sizes),
    [options.sizes]
  )
  const sourcePreviewUrl = useObjectUrl(selectedFile)
  const downloadUrl = useObjectUrl(resultBlob)
  const outputFileName = useMemo(
    () => resolveIcoOutputName(selectedFile?.name ?? ""),
    [selectedFile?.name]
  )
  const optionsKey = useMemo(
    () =>
      JSON.stringify({
        backgroundColor: options.backgroundColor,
        backgroundEnabled: options.backgroundEnabled,
        sizes: normalizedSizes,
      }),
    [normalizedSizes, options.backgroundColor, options.backgroundEnabled]
  )

  useEffect(() => {
    setResultBlob(null)
    setError("")
  }, [optionsKey, selectedFile])

  function handleFilesSelected(files: readonly File[]) {
    if (files.length === 0) {
      return
    }

    if (files.length > 1) {
      setError(messages.onlyOneFileError)
      return
    }

    const [file] = files

    if (!file || !isSupportedInputImage(file)) {
      setSelectedFile(null)
      setError(messages.invalidFileTypeError)
      return
    }

    setSelectedFile(file)
  }

  async function handleGenerate() {
    if (!selectedFile || isConverting) {
      return
    }

    setIsConverting(true)
    setError("")

    try {
      const icoBlob = await convertImageFileToIco(selectedFile, {
        ...options,
        sizes: normalizedSizes,
      })

      setResultBlob(icoBlob)
    } catch (conversionError) {
      setResultBlob(null)
      setError(resolveErrorMessage(conversionError, messages))
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <UploadCard
          inputId={inputId}
          messages={messages}
          onFilesSelected={handleFilesSelected}
          onRemoveFile={() => {
            setSelectedFile(null)
            setResultBlob(null)
            setError("")
          }}
          selectedFile={selectedFile}
          sourcePreviewUrl={sourcePreviewUrl}
        />

        <OptionsCard
          isConverting={isConverting}
          messages={messages}
          onGenerate={() => {
            void handleGenerate()
          }}
          onSetBackgroundColor={(value) => {
            setOptions((currentOptions) => ({
              ...currentOptions,
              backgroundColor: value,
            }))
          }}
          onSetBackgroundEnabled={(value) => {
            setOptions((currentOptions) => ({
              ...currentOptions,
              backgroundEnabled: value,
            }))
          }}
          onToggleSize={(size) => {
            setOptions((currentOptions) => {
              const hasSize = currentOptions.sizes.includes(size)

              return {
                ...currentOptions,
                sizes: hasSize
                  ? currentOptions.sizes.filter(
                      (currentSize) => currentSize !== size
                    )
                  : [...currentOptions.sizes, size],
              }
            })
          }}
          options={options}
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

      <ResultCard
        downloadUrl={downloadUrl}
        fileName={outputFileName}
        messages={messages}
        resultBlob={resultBlob}
        sizes={normalizedSizes}
      />
    </div>
  )
}

export default ImageToIcoClient
