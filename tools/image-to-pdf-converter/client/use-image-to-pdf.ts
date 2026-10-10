import { useCallback, useEffect, useRef, useState } from "react"
import {
  DEFAULT_CONVERTER_OPTIONS,
  clampMarginMm,
  normalizeRotation,
} from "../core/options"
import { getOutputFileName } from "../core/file-names"
import { createImagePdf, createPdfBlob } from "../core/pdf-document"
import {
  getFileSignature,
  readSourcePages,
  releasePages,
  createPageRenderer,
  ImagePageError,
} from "./image-processing"
import { imageLabel } from "./utils"
import type { ConverterOptions, PdfGenerationProgress } from "../core/options"
import type { ImageQueueItem, ImageToPdfMessages, PdfResult } from "./types"

function useImageToPdf(messages: ImageToPdfMessages) {
  const itemsRef = useRef<ImageQueueItem[]>([])
  const operation = useRef<AbortController | null>(null)
  const [items, setItems] = useState<ImageQueueItem[]>([])
  const [options, setOptions] = useState<ConverterOptions>(
    DEFAULT_CONVERTER_OPTIONS
  )
  const [isAddingImages, setIsAddingImages] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] =
    useState<PdfGenerationProgress | null>(null)
  const [readingProgress, setReadingProgress] = useState<{
    name: string
    completed: number
    total: number
  } | null>(null)
  const [result, setResult] = useState<PdfResult | null>(null)
  const [error, setError] = useState("")
  const selected = items.filter((item) => item.selected)
  const canGenerate =
    selected.length > 0 &&
    selected.every((item) => !item.failure) &&
    !isGenerating &&
    !isAddingImages

  useEffect(
    () => () => {
      operation.current?.abort()
      releasePages(itemsRef.current)
    },
    []
  )

  const updateItems = useCallback((next: ImageQueueItem[]) => {
    itemsRef.current = next
    setItems(next)
    setResult(null)
    setError("")
  }, [])

  const cancel = useCallback(() => {
    operation.current?.abort()
    operation.current = null
    setIsAddingImages(false)
    setIsGenerating(false)
    setGenerationProgress(null)
    setReadingProgress(null)
    setResult(null)
    setError("")
  }, [])

  async function addFiles(files: readonly File[]) {
    if (!files.length || operation.current) return
    const controller = new AbortController()
    operation.current = controller
    const pending: ImageQueueItem[] = []
    const signatures = new Set(
      itemsRef.current.map((item) => getFileSignature(item.file))
    )
    let duplicate = false
    setIsAddingImages(true)
    setResult(null)
    setError("")
    try {
      for (const file of files) {
        const signature = getFileSignature(file)
        if (signatures.has(signature)) {
          duplicate = true
          continue
        }
        signatures.add(signature)
        setReadingProgress({ name: file.name, completed: 0, total: 0 })
        const pages = await readSourcePages(
          file,
          controller.signal,
          (completed, total) => {
            if (!controller.signal.aborted)
              setReadingProgress({ name: file.name, completed, total })
          }
        )
        for (const page of pages) pending.push(page)
        controller.signal.throwIfAborted()
      }
      updateItems([...itemsRef.current, ...pending])
      if (duplicate) setError(messages.duplicateFileError)
    } catch {
      releasePages(pending)
      if (!controller.signal.aborted) setError(messages.invalidImageError)
    } finally {
      if (operation.current === controller) {
        operation.current = null
        setIsAddingImages(false)
        setReadingProgress(null)
      }
    }
  }

  const clearItems = useCallback(() => {
    cancel()
    releasePages(itemsRef.current)
    updateItems([])
  }, [cancel, updateItems])

  const removeItem = useCallback(
    (id: string) => {
      releasePages(itemsRef.current.filter((item) => item.id === id))
      updateItems(itemsRef.current.filter((item) => item.id !== id))
    },
    [updateItems]
  )

  async function generatePdf() {
    if (operation.current) return
    if (!canGenerate) {
      setError(messages.noImagesError)
      return
    }
    const controller = new AbortController()
    operation.current = controller
    const generationItems = itemsRef.current.filter((item) => item.selected)
    const renderer = createPageRenderer(controller.signal)
    setIsGenerating(true)
    setResult(null)
    setError("")
    setGenerationProgress({ completed: 0, total: generationItems.length })
    try {
      const bytes = await createImagePdf({
        images: generationItems.map(
          (item) => () => renderer.render(item, options.qualityPreset)
        ),
        options,
        signal: controller.signal,
        onProgress: (progress) => {
          if (!controller.signal.aborted) setGenerationProgress(progress)
        },
      })
      controller.signal.throwIfAborted()
      setResult({
        blob: createPdfBlob(bytes),
        fileName: getOutputFileName(generationItems),
        pageCount: generationItems.length,
      })
    } catch (reason) {
      if (!controller.signal.aborted) {
        if (reason instanceof ImagePageError) {
          updateItems(
            itemsRef.current.map((item) =>
              item.id === reason.item.id
                ? { ...item, failure: reason.failure }
                : item
            )
          )
          setError(
            messages.exportErrorLabel.replace(
              "{name}",
              imageLabel(reason.item, messages)
            ) +
              " " +
              messages.failures[reason.failure]
          )
        } else setError(messages.generateFailedError)
      }
    } finally {
      renderer.close()
      if (operation.current === controller) {
        operation.current = null
        setIsGenerating(false)
        setGenerationProgress(null)
      }
    }
  }

  const moveItem = useCallback(
    (from: number, to: number) => {
      if (
        from < 0 ||
        to < 0 ||
        from >= itemsRef.current.length ||
        to >= itemsRef.current.length ||
        from === to
      )
        return
      const next = [...itemsRef.current]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item!)
      updateItems(next)
    },
    [updateItems]
  )

  const moveItemDown = useCallback(
    (index: number) => moveItem(index, index + 1),
    [moveItem]
  )
  const moveItemUp = useCallback(
    (index: number) => moveItem(index, index - 1),
    [moveItem]
  )
  const rotateItem = useCallback(
    (id: string) =>
      updateItems(
        itemsRef.current.map((item) =>
          item.id === id
            ? { ...item, rotation: normalizeRotation(item.rotation + 90) }
            : item
        )
      ),
    [updateItems]
  )
  const toggleItem = useCallback(
    (id: string) =>
      updateItems(
        itemsRef.current.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item
        )
      ),
    [updateItems]
  )
  const selectAll = useCallback(
    (selected: boolean) =>
      updateItems(itemsRef.current.map((item) => ({ ...item, selected }))),
    [updateItems]
  )

  return {
    addFiles,
    canGenerate,
    cancel,
    clearItems,
    error,
    generatePdf,
    generationProgress,
    isAddingImages,
    isGenerating,
    items,
    options,
    readingProgress,
    removeItem,
    result,
    moveItemDown,
    moveItemUp,
    rotateItem,
    toggleItem,
    selectAll,
    setOptions: (next: ConverterOptions) => {
      setOptions({ ...next, marginMm: clampMarginMm(next.marginMm) })
      setResult(null)
    },
  }
}
export { useImageToPdf }
