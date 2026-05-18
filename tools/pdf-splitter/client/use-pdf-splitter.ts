import { useRef, useState } from "react"

import { toErrorCode, toPdfErrorMessage, toRangeErrorMessage } from "./errors"
import { usePdfDragDrop } from "./use-pdf-drag"
import { createSingleResult, createZipResult } from "./result-builders"
import { splitPdfWithWorker } from "./split-pdf-worker"
import {
  createEvenPageList,
  createOddPageList,
  createPageList,
  formatPagesToRanges,
  parsePageRanges,
} from "../core/page-ranges"
import {
  getOutputBaseName,
  inspectPdfFile,
  isPdfFile,
} from "../core/pdf-document"

import type { PdfSplitterMessages } from "./types"
import type { SplitMultipleMode, SplitOutputMode } from "../core/pdf-document"

import type { SplitResult } from "../components/results-card"

function usePdfSplitter(messages: PdfSplitterMessages) {
  const loadTokenRef = useRef(0)
  const lastInteractedPageRef = useRef<number | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [rangeInput, setRangeInput] = useState("")
  const [rangeErrorCode, setRangeErrorCode] = useState("")
  const [selectedPages, setSelectedPages] = useState<readonly number[]>([])
  const [outputMode, setOutputMode] = useState<SplitOutputMode>("single")
  const [multipleMode, setMultipleMode] = useState<SplitMultipleMode>("ranges")
  const [isLoadingDocument, setIsLoadingDocument] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<SplitResult | null>(null)
  const { clearDragState, dragHandlers, isDraggingOver } = usePdfDragDrop(
    (file) => {
      void selectFile(file)
    }
  )

  function resetDocumentState() {
    lastInteractedPageRef.current = null
    setPageCount(0)
    setRangeInput("")
    setRangeErrorCode("")
    setSelectedPages([])
    setOutputMode("single")
    setMultipleMode("ranges")
    setResult(null)
  }

  function clearFile() {
    loadTokenRef.current += 1
    clearDragState()
    setIsLoadingDocument(false)
    setIsGenerating(false)
    setSelectedFile(null)
    setError("")
    resetDocumentState()
  }

  function setSelection(nextPages: readonly number[], updateRange = true) {
    const normalizedPages = [...new Set(nextPages)].sort(
      (left, right) => left - right
    )

    setSelectedPages(normalizedPages)

    if (updateRange) {
      setRangeInput(formatPagesToRanges(normalizedPages))
    }

    setRangeErrorCode("")
    setResult(null)
    setError("")
  }

  async function selectFile(file: File | null) {
    clearDragState()

    if (!file) {
      return
    }

    if (!isPdfFile(file)) {
      clearFile()
      setError(messages.unsupportedFile)
      return
    }

    const loadToken = (loadTokenRef.current += 1)
    resetDocumentState()
    setSelectedFile(file)
    setIsLoadingDocument(true)
    setError("")

    try {
      const inspection = await inspectPdfFile(file)

      if (loadToken !== loadTokenRef.current) {
        return
      }

      const allPages = createPageList(inspection.pageCount)
      setPageCount(inspection.pageCount)
      setSelection(allPages)
    } catch (inspectionError) {
      if (loadToken !== loadTokenRef.current) {
        return
      }

      setSelectedFile(null)
      setError(toPdfErrorMessage(inspectionError, messages))
      resetDocumentState()
    } finally {
      if (loadToken === loadTokenRef.current) {
        setIsLoadingDocument(false)
      }
    }
  }

  function handleRangeInputChange(value: string) {
    setRangeInput(value)
    setResult(null)
    setError("")

    if (!value.trim()) {
      setSelectedPages([])
      setRangeErrorCode("")
      return
    }

    try {
      const parsed = parsePageRanges(value, pageCount)
      setSelectedPages(parsed.pagesInOrder)
      setRangeErrorCode("")
    } catch (rangeError) {
      setSelectedPages([])
      setRangeErrorCode(toErrorCode(rangeError))
    }
  }

  function togglePage(page: number, useRange: boolean) {
    const nextSelection = new Set(selectedPages)

    if (useRange && lastInteractedPageRef.current !== null) {
      const start = Math.min(lastInteractedPageRef.current, page)
      const end = Math.max(lastInteractedPageRef.current, page)

      for (let current = start; current <= end; current += 1) {
        nextSelection.add(current)
      }
    } else if (nextSelection.has(page)) {
      nextSelection.delete(page)
    } else {
      nextSelection.add(page)
    }

    lastInteractedPageRef.current = page
    setSelection([...nextSelection])
  }

  function handleOutputModeChange(mode: SplitOutputMode) {
    setOutputMode(mode)
    setResult(null)
    setError("")
  }

  function handleMultipleModeChange(mode: SplitMultipleMode) {
    setMultipleMode(mode)
    setResult(null)
    setError("")
  }

  async function generateResult() {
    if (!selectedFile || isGenerating) {
      return
    }

    let parsed

    try {
      parsed = parsePageRanges(rangeInput, pageCount)
      setRangeErrorCode("")
    } catch (rangeError) {
      setRangeErrorCode(toErrorCode(rangeError))
      return
    }

    setIsGenerating(true)
    setResult(null)
    setError("")

    const outputBaseName = getOutputBaseName(selectedFile.name, outputMode)

    try {
      const sourceBytes = await selectedFile.arrayBuffer()
      const workerResult = await splitPdfWithWorker({
        multipleMode,
        outputBaseName,
        outputMode,
        pages: parsed.pagesInOrder,
        segments: parsed.segments,
        sourceBytes,
      })

      if (!workerResult.ok) {
        setError(toPdfErrorMessage(workerResult.code, messages))
        return
      }

      setResult(
        outputMode === "single"
          ? createSingleResult(workerResult.result)
          : createZipResult(workerResult.result, outputBaseName)
      )
    } catch (generateError) {
      setError(toPdfErrorMessage(generateError, messages))
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate = Boolean(
    selectedFile &&
    pageCount > 0 &&
    selectedPages.length > 0 &&
    !rangeErrorCode &&
    !isLoadingDocument &&
    !isGenerating
  )

  return {
    actions: {
      clearFile,
      generateResult,
      handleDragEnter: dragHandlers.handleDragEnter,
      handleDragLeave: dragHandlers.handleDragLeave,
      handleDragOver: dragHandlers.handleDragOver,
      handleDrop: dragHandlers.handleDrop,
      handleMultipleModeChange,
      handleOutputModeChange,
      handleRangeInputChange,
      selectAll: () => setSelection(createPageList(pageCount)),
      selectEven: () => setSelection(createEvenPageList(pageCount)),
      selectFile,
      selectOdd: () => setSelection(createOddPageList(pageCount)),
      setSelection,
      togglePage,
    },
    state: {
      canGenerate,
      error,
      isDraggingOver,
      isGenerating,
      isLoadingDocument,
      multipleMode,
      outputMode,
      pageCount,
      rangeError: rangeErrorCode
        ? toRangeErrorMessage(rangeErrorCode, messages)
        : "",
      rangeInput,
      result,
      selectedFile,
      selectedPages,
    },
  }
}

export { usePdfSplitter }
