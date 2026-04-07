import { startTransition, useEffect, useState } from "react"

import {
  readImageDimensions,
  resizeImageFile,
  type ImageDimensions,
  type ResizeOptions,
  type ResizeResult,
} from "../core/resize-image"
import { DEFAULT_OPTIONS, OPTION_STORAGE_KEY } from "./constants"
import type { ImageResizerMessages } from "./types"

export function useImageResizer(messages: ImageResizerMessages) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sourceDimensions, setSourceDimensions] =
    useState<ImageDimensions | null>(null)
  const [options, setOptions] = useState<ResizeOptions>(DEFAULT_OPTIONS)
  const [result, setResult] = useState<ResizeResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null)
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedOptions = window.localStorage.getItem(OPTION_STORAGE_KEY)

    if (!storedOptions) {
      return
    }

    try {
      const parsedOptions = JSON.parse(storedOptions) as Partial<ResizeOptions>

      setOptions((currentOptions) => ({
        ...currentOptions,
        ...parsedOptions,
      }))
    } catch {
      // Ignore broken storage.
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(OPTION_STORAGE_KEY, JSON.stringify(options))
  }, [options])

  useEffect(() => {
    if (!selectedFile) {
      setSourcePreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }

        return null
      })
      return
    }

    const nextUrl = URL.createObjectURL(selectedFile)
    setSourcePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }

      return nextUrl
    })

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [selectedFile])

  useEffect(() => {
    if (!result) {
      setResultPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }

        return null
      })
      return
    }

    const nextUrl = URL.createObjectURL(result.blob)
    setResultPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }

      return nextUrl
    })

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [result])

  async function handleFileChange(file: File | null) {
    setError(null)
    setResult(null)

    if (!file) {
      setSelectedFile(null)
      setSourceDimensions(null)
      return
    }

    if (!file.type.startsWith("image/")) {
      setSelectedFile(null)
      setSourceDimensions(null)
      setError(messages.invalidImageDescription)
      return
    }

    try {
      const dimensions = await readImageDimensions(file)

      startTransition(() => {
        setSelectedFile(file)
        setSourceDimensions(dimensions)
        setOptions((currentOptions) => ({
          ...currentOptions,
          width: dimensions.width,
          height: dimensions.height,
        }))
      })
    } catch {
      setSelectedFile(null)
      setSourceDimensions(null)
      setError(messages.invalidImageDescription)
    }
  }

  function updateWidth(nextWidth: number) {
    setOptions((currentOptions) => {
      if (!sourceDimensions || !currentOptions.keepAspectRatio) {
        return {
          ...currentOptions,
          width: nextWidth,
        }
      }

      const ratio = sourceDimensions.height / sourceDimensions.width
      return {
        ...currentOptions,
        width: nextWidth,
        height: Math.max(1, Math.round(nextWidth * ratio)),
      }
    })
  }

  function updateHeight(nextHeight: number) {
    setOptions((currentOptions) => {
      if (!sourceDimensions || !currentOptions.keepAspectRatio) {
        return {
          ...currentOptions,
          height: nextHeight,
        }
      }

      const ratio = sourceDimensions.width / sourceDimensions.height
      return {
        ...currentOptions,
        width: Math.max(1, Math.round(nextHeight * ratio)),
        height: nextHeight,
      }
    })
  }

  async function runResize() {
    if (!selectedFile) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const nextResult = await resizeImageFile(selectedFile, options)
      setResult(nextResult)
    } catch {
      setResult(null)
      setError(messages.resizeErrorDescription)
    } finally {
      setIsProcessing(false)
    }
  }

  function resetOptions() {
    setResult(null)
    setError(null)
    setOptions((currentOptions) => ({
      ...DEFAULT_OPTIONS,
      width: sourceDimensions?.width ?? currentOptions.width,
      height: sourceDimensions?.height ?? currentOptions.height,
    }))
  }

  return {
    error,
    handleFileChange,
    isProcessing,
    options,
    resetOptions,
    result,
    resultPreviewUrl,
    runResize,
    selectedFile,
    setOptions,
    sourceDimensions,
    sourcePreviewUrl,
    updateHeight,
    updateWidth,
  }
}
