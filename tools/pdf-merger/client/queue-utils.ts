import { PDF_MERGER_ERROR, isPdfMergeErrorCode } from "../core/pdf-merger"

import type { PdfQueueItem } from "./types"

let fallbackItemId = 0

function createItemId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }

  fallbackItemId += 1
  return `pdf-merger-${fallbackItemId}`
}

function createQueueItem(file: File): PdfQueueItem {
  return {
    errorCode: null,
    file,
    id: createItemId(),
    name: file.name,
    pageCount: null,
    previewUrl: URL.createObjectURL(file),
    size: file.size,
    status: "reading",
  }
}

function createReadyQueueItem(
  item: PdfQueueItem,
  pageCount: number
): PdfQueueItem {
  return {
    ...item,
    errorCode: null,
    pageCount,
    status: "ready",
  }
}

function createErrorQueueItem(
  item: PdfQueueItem,
  error: unknown
): PdfQueueItem {
  return {
    ...item,
    errorCode:
      error instanceof Error && isPdfMergeErrorCode(error.message)
        ? error.message
        : PDF_MERGER_ERROR.invalid,
    pageCount: null,
    status: "error",
  }
}

function moveQueueItem(
  items: readonly PdfQueueItem[],
  from: number,
  to: number
) {
  const nextItems = [...items]
  const [movingItem] = nextItems.splice(from, 1)

  if (movingItem) {
    nextItems.splice(to, 0, movingItem)
  }

  return nextItems
}

export {
  createErrorQueueItem,
  createQueueItem,
  createReadyQueueItem,
  moveQueueItem,
}
