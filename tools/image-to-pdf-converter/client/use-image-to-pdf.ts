import { useEffect, useMemo, useRef, useState } from "react"

import { DEFAULT_CONVERTER_OPTIONS, clampMarginMm } from "../core/options"
import { getOutputFileName } from "../core/file-names"
import { createImagePdf, createPdfBlob } from "../core/pdf-document"
import {
  getFileSignature,
  isProbablyImageFile,
  readImageDimensions,
  renderImageToJpeg,
} from "./image-processing"

import type {
  ConverterOptions,
  PdfGenerationProgress,
  Rotation,
} from "../core/options"
import type { PdfImageInput } from "../core/pdf-document"
import type { ImageQueueItem, ImageToPdfMessages, PdfResult } from "./types"

let fallbackItemId = 0

function createItemId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }

  fallbackItemId += 1
  return `image-to-pdf-${fallbackItemId}`
}

function normalizeOptions(options: ConverterOptions): ConverterOptions {
  return {
    ...options,
    marginMm: clampMarginMm(options.marginMm),
  }
}

function resolveErrorMessage(error: unknown, messages: ImageToPdfMessages) {
  if (!(error instanceof Error)) {
    return messages.generateFailedError
  }

  if (error.message === "CANVAS_UNAVAILABLE") {
    return messages.canvasUnavailableError
  }

  if (
    error.message === "CANVAS_EXPORT_FAILED" ||
    error.message === "INVALID_IMAGE"
  ) {
    return messages.invalidImageError
  }

  return messages.generateFailedError
}

function useImageToPdf(messages: ImageToPdfMessages) {
  const itemsRef = useRef<readonly ImageQueueItem[]>([])
  const [items, setItems] = useState<ImageQueueItem[]>([])
  const [options, setOptions] = useState<ConverterOptions>({
    ...DEFAULT_CONVERTER_OPTIONS,
  })
  const [isAddingImages, setIsAddingImages] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] =
    useState<PdfGenerationProgress | null>(null)
  const [result, setResult] = useState<PdfResult | null>(null)
  const [error, setError] = useState("")
  const canGenerate = items.length > 0 && !isGenerating && !isAddingImages
  const optionsKey = useMemo(() => JSON.stringify(options), [options])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    setResult(null)
  }, [optionsKey])

  useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.previewUrl)
      }
    },
    []
  )

  async function addFiles(files: readonly File[]) {
    if (!files.length || isGenerating || isAddingImages) {
      return
    }

    const existingSignatures = new Set(
      itemsRef.current.map((item) => getFileSignature(item.file))
    )
    const nextItems: ImageQueueItem[] = []
    let hadDuplicate = false
    let hadInvalidType = false
    let hadInvalidImage = false

    setIsAddingImages(true)
    setError("")

    try {
      for (const file of files) {
        if (!isProbablyImageFile(file)) {
          hadInvalidType = true
          continue
        }

        const signature = getFileSignature(file)

        if (existingSignatures.has(signature)) {
          hadDuplicate = true
          continue
        }

        existingSignatures.add(signature)

        try {
          const dimensions = await readImageDimensions(file)
          nextItems.push({
            id: createItemId(),
            file,
            name: file.name,
            size: file.size,
            previewUrl: URL.createObjectURL(file),
            width: dimensions.width,
            height: dimensions.height,
            rotation: 0,
          })
        } catch {
          hadInvalidImage = true
        }
      }

      if (nextItems.length) {
        setItems((currentItems) => [...currentItems, ...nextItems])
        setResult(null)
      }

      if (hadInvalidImage) {
        setError(messages.invalidImageError)
      } else if (hadInvalidType) {
        setError(messages.invalidImageTypeError)
      } else if (hadDuplicate) {
        setError(messages.duplicateFileError)
      }
    } finally {
      setIsAddingImages(false)
    }
  }

  function updateItems(
    updater: (currentItems: readonly ImageQueueItem[]) => ImageQueueItem[]
  ) {
    setItems((currentItems) => updater(currentItems))
    setResult(null)
    setError("")
  }

  function clearItems() {
    for (const item of itemsRef.current) {
      URL.revokeObjectURL(item.previewUrl)
    }

    updateItems(() => [])
  }

  function removeItem(id: string) {
    const item = itemsRef.current.find((currentItem) => currentItem.id === id)

    if (item) {
      URL.revokeObjectURL(item.previewUrl)
    }

    updateItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem.id !== id)
    )
  }

  async function generatePdf() {
    if (!canGenerate) {
      setError(messages.noImagesError)
      return
    }

    const generationItems = itemsRef.current.map((item) => ({ ...item }))
    const generationOptions = normalizeOptions(options)

    setIsGenerating(true)
    setResult(null)
    setError("")
    setGenerationProgress({ completed: 0, total: generationItems.length })

    try {
      const images: PdfImageInput[] = []

      for (const [index, item] of generationItems.entries()) {
        images.push(
          await renderImageToJpeg(item.file, {
            qualityPreset: generationOptions.qualityPreset,
            rotation: item.rotation,
          })
        )
        setGenerationProgress({
          completed: index + 1,
          total: generationItems.length,
        })
      }

      const bytes = await createImagePdf({
        images,
        options: generationOptions,
      })

      setResult({
        blob: createPdfBlob(bytes),
        fileName: getOutputFileName(generationItems),
        pageCount: generationItems.length,
      })
    } catch (generateError) {
      setError(resolveErrorMessage(generateError, messages))
    } finally {
      setIsGenerating(false)
      setGenerationProgress(null)
    }
  }

  return {
    addFiles,
    canGenerate,
    clearItems,
    error,
    generatePdf,
    generationProgress,
    isAddingImages,
    isGenerating,
    items,
    moveItemDown: (index: number) => {
      updateItems((currentItems) => moveItem(currentItems, index, index + 1))
    },
    moveItemUp: (index: number) => {
      updateItems((currentItems) => moveItem(currentItems, index, index - 1))
    },
    options,
    removeItem,
    result,
    rotateItem: (id: string) => {
      updateItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id
            ? { ...item, rotation: ((item.rotation + 90) % 360) as Rotation }
            : item
        )
      )
    },
    setOptions: (nextOptions: ConverterOptions) => {
      setOptions(normalizeOptions(nextOptions))
    },
  }
}

function moveItem(
  items: readonly ImageQueueItem[],
  oldIndex: number,
  newIndex: number
) {
  if (
    oldIndex < 0 ||
    newIndex < 0 ||
    oldIndex >= items.length ||
    newIndex >= items.length ||
    oldIndex === newIndex
  ) {
    return [...items]
  }

  const nextItems = [...items]
  const [movedItem] = nextItems.splice(oldIndex, 1)

  if (!movedItem) {
    return nextItems
  }

  nextItems.splice(newIndex, 0, movedItem)
  return nextItems
}

export { useImageToPdf }
