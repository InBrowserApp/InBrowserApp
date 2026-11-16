import { useEffect, useRef, useState } from "react"

import {
  createPdfBlob,
  inspectPdf,
  isPdfFile,
  movePage,
  organizePdf,
  removePage,
  rotatePage,
} from "../core/pdf-page-organizer"

import type {
  OrganizerResult,
  PdfPageEntry,
  PdfPageOrganizerMessages,
  PdfPagePreview,
} from "./types"

function resolveErrorMessage(
  error: unknown,
  messages: PdfPageOrganizerMessages
) {
  if (!(error instanceof Error)) {
    return messages.exportFailedError
  }

  if (error.message === "ENCRYPTED_PDF") {
    return messages.encryptedPdfError
  }

  if (error.message === "INVALID_PDF") {
    return messages.invalidPdfError
  }

  if (error.message === "NO_PAGES") {
    return messages.noPagesError
  }

  return messages.exportFailedError
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError"
}

function createPreviewMap(previews: readonly PdfPagePreview[]) {
  return Object.fromEntries(
    previews.map((preview) => [preview.pageNumber, preview])
  )
}

function usePdfPageOrganizer(messages: PdfPageOrganizerMessages) {
  const runIdRef = useRef(0)
  const previewAbortRef = useRef<AbortController | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PdfPageEntry[]>([])
  const [originalPages, setOriginalPages] = useState<PdfPageEntry[]>([])
  const [history, setHistory] = useState<readonly PdfPageEntry[][]>([])
  const [previews, setPreviews] = useState<
    Readonly<Record<number, PdfPagePreview>>
  >({})
  const [result, setResult] = useState<OrganizerResult | null>(null)
  const [error, setError] = useState("")
  const [previewError, setPreviewError] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [isRenderingPreviews, setIsRenderingPreviews] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const canGenerate =
    Boolean(file) && pages.length > 0 && !isGenerating && !isReading
  const canReset =
    pages.length !== originalPages.length ||
    pages.some(
      (page, index) =>
        page.id !== originalPages[index]?.id ||
        page.rotation !== originalPages[index]?.rotation
    )

  useEffect(() => {
    return () => {
      previewAbortRef.current?.abort()
    }
  }, [])

  async function renderPreviews(
    nextFile: File,
    runId: number,
    controller: AbortController
  ) {
    setIsRenderingPreviews(true)

    try {
      const { renderPdfPagePreviews } = await import("./pdf-preview")
      const nextPreviews = await renderPdfPagePreviews(
        nextFile,
        controller.signal
      )

      if (runId === runIdRef.current && !controller.signal.aborted) {
        setPreviews(createPreviewMap(nextPreviews))
      }
    } catch (previewRenderError) {
      if (
        runId === runIdRef.current &&
        !controller.signal.aborted &&
        !isAbortError(previewRenderError)
      ) {
        setPreviewError(messages.previewUnavailableLabel)
      }
    } finally {
      if (runId === runIdRef.current) {
        setIsRenderingPreviews(false)
      }
    }
  }

  async function selectFile(nextFile: File | null) {
    runIdRef.current += 1
    previewAbortRef.current?.abort()
    setResult(null)
    setError("")
    setPreviewError("")
    setPreviews({})
    setIsRenderingPreviews(false)
    setHistory([])

    if (!nextFile) {
      setFile(null)
      setPages([])
      setOriginalPages([])
      return
    }

    if (!isPdfFile(nextFile)) {
      setFile(null)
      setPages([])
      setOriginalPages([])
      setError(messages.invalidPdfTypeError)
      return
    }

    const currentRun = runIdRef.current
    const previewController = new AbortController()
    previewAbortRef.current = previewController
    setFile(nextFile)
    setPages([])
    setOriginalPages([])
    setIsReading(true)

    try {
      const inspection = await inspectPdf(nextFile)

      if (currentRun !== runIdRef.current) {
        return
      }

      setPages([...inspection.pages])
      setOriginalPages([...inspection.pages])
      void renderPreviews(nextFile, currentRun, previewController)
    } catch (readError) {
      if (currentRun !== runIdRef.current) {
        return
      }

      setFile(null)
      setPages([])
      setOriginalPages([])
      setError(resolveErrorMessage(readError, messages))
    } finally {
      if (currentRun === runIdRef.current) {
        setIsReading(false)
      }
    }
  }

  function updatePages(
    updater: (current: readonly PdfPageEntry[]) => PdfPageEntry[]
  ) {
    setHistory((previous) => [...previous, pages].slice(-20))
    setPages(updater(pages))
    setResult(null)
    setError("")
  }

  async function generatePdf() {
    const currentFile = file
    const currentPages = pages

    if (!currentFile) {
      setError(messages.invalidPdfTypeError)
      return
    }

    if (!currentPages.length) {
      setError(messages.noPagesError)
      return
    }

    setIsGenerating(true)
    setResult(null)
    setError("")

    try {
      const organized = await organizePdf(currentFile, currentPages)
      setResult({
        blob: createPdfBlob(organized.bytes),
        fileName: organized.fileName,
        pageCount: organized.pageCount,
      })
    } catch (generateError) {
      setError(resolveErrorMessage(generateError, messages))
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    canGenerate,
    canReset,
    canUndo: history.length > 0,
    error,
    file,
    generatePdf,
    isGenerating,
    isReading,
    isRenderingPreviews,
    movePageDown: (index: number) => {
      updatePages((currentPages) => movePage(currentPages, index, index + 1))
    },
    movePageTo: (fromIndex: number, toIndex: number) => {
      updatePages((currentPages) => movePage(currentPages, fromIndex, toIndex))
    },
    movePageUp: (index: number) => {
      updatePages((currentPages) => movePage(currentPages, index, index - 1))
    },
    pages,
    originalPageCount: originalPages.length,
    previewError,
    previews,
    removePage: (pageId: string) => {
      updatePages((currentPages) => removePage(currentPages, pageId))
    },
    resetPages: () => {
      updatePages(() => [...originalPages])
    },
    undo: () => {
      const previous = history.at(-1)
      if (!previous) {
        return
      }
      setPages(previous)
      setHistory(history.slice(0, -1))
      setResult(null)
      setError("")
    },
    result,
    rotatePageClockwise: (pageId: string) => {
      updatePages((currentPages) => rotatePage(currentPages, pageId, 90))
    },
    selectFile,
  }
}

export { usePdfPageOrganizer }
