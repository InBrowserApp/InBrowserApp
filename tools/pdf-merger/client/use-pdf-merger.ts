import { useEffect, useMemo, useRef, useState } from "react"

import { mergePdfFilesWithWorker } from "./pdf-merge-worker"
import {
  createErrorQueueItem,
  createQueueItem,
  createReadyQueueItem,
  moveQueueItem,
} from "./queue-utils"
import {
  DEFAULT_OUTPUT_FILE_NAME,
  PDF_MERGER_ERROR,
  formatBytes,
  getFileSignature,
  inspectPdfFile,
  isPdfFile,
  normalizeOutputFileName,
} from "../core/pdf-merger"

import type { PdfMergeProgress } from "../core/pdf-merger"
import type { PdfMergeResult } from "./pdf-merge-worker"
import type { PdfMergerMessages, PdfQueueItem } from "./types"

function getErrorMessage(error: unknown, messages: PdfMergerMessages) {
  const code = error instanceof Error ? error.message : ""

  if (code === PDF_MERGER_ERROR.encrypted) {
    return messages.encryptedPdfError
  }

  if (code === PDF_MERGER_ERROR.invalid) {
    return messages.invalidPdfError
  }

  if (code === PDF_MERGER_ERROR.workerUnavailable) {
    return messages.workerUnavailableError
  }

  if (code === PDF_MERGER_ERROR.notEnoughFiles) {
    return messages.noFilesError
  }

  return messages.mergeFailedError
}

function getReadyPageCount(items: readonly PdfQueueItem[]) {
  return items.reduce((total, item) => total + (item.pageCount ?? 0), 0)
}

function getInputSizeLabel(items: readonly PdfQueueItem[]) {
  return formatBytes(items.reduce((total, item) => total + item.size, 0))
}

function usePdfMerger(messages: PdfMergerMessages) {
  const itemsRef = useRef<readonly PdfQueueItem[]>([])
  const [items, setItems] = useState<PdfQueueItem[]>([])
  const [outputName, setOutputName] = useState(DEFAULT_OUTPUT_FILE_NAME)
  const [error, setError] = useState("")
  const [result, setResult] = useState<PdfMergeResult | null>(null)
  const [isMerging, setIsMerging] = useState(false)
  const [progress, setProgress] = useState<PdfMergeProgress | null>(null)
  const [previewItemId, setPreviewItemId] = useState("")
  const readyPageCount = useMemo(() => getReadyPageCount(items), [items])
  const inputSizeLabel = useMemo(() => getInputSizeLabel(items), [items])
  const canMerge =
    items.length >= 2 &&
    !isMerging &&
    items.every((item) => item.status === "ready")
  const previewItem =
    items.find(
      (item) => item.id === previewItemId && item.status !== "error"
    ) ?? null

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.previewUrl)
      }
    },
    []
  )

  function updateItems(
    updater: (currentItems: readonly PdfQueueItem[]) => PdfQueueItem[]
  ) {
    setItems((currentItems) => {
      const nextItems = updater(currentItems)
      itemsRef.current = nextItems

      return nextItems
    })
    setResult(null)
    setError("")
  }

  function updateItem(
    id: string,
    updater: (item: PdfQueueItem) => PdfQueueItem
  ) {
    setItems((currentItems) => {
      const nextItems = currentItems.map((item) =>
        item.id === id ? updater(item) : item
      )
      itemsRef.current = nextItems

      return nextItems
    })
  }

  function changeOutputName(value: string) {
    setOutputName(value)
    setResult((currentResult) =>
      currentResult
        ? {
            ...currentResult,
            fileName: normalizeOutputFileName(value),
          }
        : null
    )
  }

  async function addFiles(files: readonly File[]) {
    if (!files.length || isMerging) {
      return
    }

    const existingSignatures = new Set(
      itemsRef.current.map((item) => getFileSignature(item.file))
    )
    const nextItems: PdfQueueItem[] = []
    let hadDuplicate = false
    let hadInvalid = false

    for (const file of files) {
      if (!isPdfFile(file)) {
        hadInvalid = true
        continue
      }

      const signature = getFileSignature(file)

      if (existingSignatures.has(signature)) {
        hadDuplicate = true
        continue
      }

      existingSignatures.add(signature)
      nextItems.push(createQueueItem(file))
    }

    if (nextItems.length) {
      updateItems((currentItems) => [...currentItems, ...nextItems])

      for (const item of nextItems) {
        void inspectPdfFile(item.file)
          .then((inspection) => {
            updateItem(item.id, (currentItem) =>
              createReadyQueueItem(currentItem, inspection.pageCount)
            )
          })
          .catch((inspectionError) => {
            updateItem(item.id, (currentItem) =>
              createErrorQueueItem(currentItem, inspectionError)
            )
          })
      }
    }

    if (hadInvalid) {
      setError(messages.invalidPdfError)
    } else if (hadDuplicate) {
      setError(messages.duplicateFileError)
    }
  }

  function reorder(from: number, to: number) {
    if (
      from === to ||
      from < 0 ||
      to < 0 ||
      from >= itemsRef.current.length ||
      to >= itemsRef.current.length
    ) {
      return
    }

    updateItems((currentItems) => moveQueueItem(currentItems, from, to))
  }

  function removeItem(id: string) {
    const item = itemsRef.current.find((currentItem) => currentItem.id === id)

    if (item) {
      URL.revokeObjectURL(item.previewUrl)
    }

    if (previewItemId === id) {
      setPreviewItemId("")
    }

    updateItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem.id !== id)
    )
  }

  function clearItems() {
    for (const item of itemsRef.current) {
      URL.revokeObjectURL(item.previewUrl)
    }

    setPreviewItemId("")
    updateItems(() => [])
  }

  async function merge() {
    if (!canMerge) {
      setError(messages.noFilesError)
      return
    }

    const mergeItems = itemsRef.current.filter(
      (item) => item.status === "ready"
    )

    setIsMerging(true)
    setError("")
    setResult(null)
    setProgress({ completed: 0, total: mergeItems.length })

    try {
      const nextResult = await mergePdfFilesWithWorker({
        files: mergeItems.map((item) => item.file),
        outputName,
        pageCount: getReadyPageCount(mergeItems),
        onProgress: setProgress,
      })

      setResult(nextResult)
    } catch (mergeError) {
      setError(getErrorMessage(mergeError, messages))
    } finally {
      setIsMerging(false)
      setProgress(null)
    }
  }

  return {
    addFiles,
    canMerge,
    clearItems,
    error,
    inputSizeLabel,
    isMerging,
    items,
    merge,
    moveItemDown: (index: number) => {
      reorder(index, index + 1)
    },
    moveItemUp: (index: number) => {
      reorder(index, index - 1)
    },
    outputName,
    previewItem,
    progress,
    readyPageCount,
    removeItem,
    reorder,
    result,
    setOutputName: changeOutputName,
    setPreviewItemId,
  }
}

export { usePdfMerger }
