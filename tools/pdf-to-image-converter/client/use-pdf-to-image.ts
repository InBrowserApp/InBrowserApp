import { useEffect, useMemo, useState } from "react"

import { createPageImageName, createZipName } from "../core/file-names"
import { DEFAULT_RENDER_OPTIONS, normalizeRenderOptions } from "../core/options"
import { createStoredZip } from "../core/zip"

import type {
  ExportProgress,
  PdfPageImage,
  PdfToImageMessages,
  RenderPageOptions,
  ZipResult,
} from "./types"
import type { PdfToImageRenderer } from "./pdf-renderer"

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  )
}

function normalizePage(page: number, numPages: number) {
  if (!Number.isFinite(page)) {
    return 1
  }

  return Math.min(Math.max(1, Math.round(page)), Math.max(1, numPages))
}

function resolveLoadErrorMessage(error: unknown, messages: PdfToImageMessages) {
  if (
    error instanceof Error &&
    error.message.toLowerCase().includes("invalid")
  ) {
    return messages.invalidPdfError
  }

  return messages.loadFailedError
}

function resolveRenderErrorMessage(
  error: unknown,
  messages: PdfToImageMessages
) {
  if (
    error instanceof Error &&
    (error.message === "CANVAS_CONTEXT_UNAVAILABLE" ||
      error.message === "CANVAS_TO_BLOB_UNAVAILABLE")
  ) {
    return messages.canvasUnavailableError
  }

  return messages.renderFailedError
}

function resolveExportErrorMessage(
  error: unknown,
  messages: PdfToImageMessages
) {
  if (error instanceof Error && error.message === "CANVAS_TO_BLOB_FAILED") {
    return messages.canvasExportFailedError
  }

  return messages.exportFailedError
}

function usePdfToImage(messages: PdfToImageMessages) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [renderer, setRenderer] = useState<PdfToImageRenderer | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [options, setOptions] = useState<RenderPageOptions>({
    ...DEFAULT_RENDER_OPTIONS,
  })
  const [currentImage, setCurrentImage] = useState<PdfPageImage | null>(null)
  const [zipResult, setZipResult] = useState<ZipResult | null>(null)
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(
    null
  )
  const [isLoadingDocument, setIsLoadingDocument] = useState(false)
  const [isRendering, setIsRendering] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState("")
  const renderOptions = useMemo(
    () => normalizeRenderOptions(options),
    [options]
  )
  const renderOptionsKey = useMemo(
    () => JSON.stringify(renderOptions),
    [renderOptions]
  )

  useEffect(() => {
    let cancelled = false
    setRenderer(null)
    setNumPages(0)
    setPage(1)
    setCurrentImage(null)
    setZipResult(null)
    setExportProgress(null)
    setError("")

    if (!selectedFile) {
      setIsLoadingDocument(false)
      return
    }

    const currentFile = selectedFile
    let nextRenderer: PdfToImageRenderer | null = null
    setIsLoadingDocument(true)

    async function loadDocument() {
      try {
        const { PdfToImageRenderer } = await import("./pdf-renderer")

        if (cancelled) {
          return
        }

        nextRenderer = new PdfToImageRenderer(currentFile)
        const totalPages = await nextRenderer.getNumPages()

        if (cancelled) {
          return
        }

        setRenderer(nextRenderer)
        setNumPages(totalPages)
      } catch (loadError) {
        if (!cancelled) {
          setError(resolveLoadErrorMessage(loadError, messages))
        }
      } finally {
        if (!cancelled) {
          setIsLoadingDocument(false)
        }
      }
    }

    void loadDocument()

    return () => {
      cancelled = true
      void nextRenderer?.destroy()
    }
  }, [messages, selectedFile])

  useEffect(() => {
    if (!renderer || !numPages) {
      setCurrentImage(null)
      setIsRendering(false)
      return
    }

    const currentRenderer = renderer
    let cancelled = false
    setIsRendering(true)
    setCurrentImage(null)
    setError("")

    async function renderCurrentPage() {
      try {
        const image = await currentRenderer.renderPage(page, renderOptions)

        if (!cancelled) {
          setCurrentImage(image)
        }
      } catch (renderError) {
        if (!cancelled) {
          setCurrentImage(null)
          setError(resolveRenderErrorMessage(renderError, messages))
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false)
        }
      }
    }

    void renderCurrentPage()

    return () => {
      cancelled = true
    }
  }, [messages, numPages, page, renderOptions, renderOptionsKey, renderer])

  function selectFile(file: File | null) {
    if (!file) {
      return
    }

    if (!isPdfFile(file)) {
      setSelectedFile(null)
      setError(messages.unsupportedFileError)
      return
    }

    setSelectedFile(file)
  }

  function clearFile() {
    setSelectedFile(null)
    setError("")
  }

  function updatePage(nextPage: number) {
    setPage(normalizePage(nextPage, numPages))
  }

  function updateOptions(nextOptions: RenderPageOptions) {
    setOptions(normalizeRenderOptions(nextOptions))
    setZipResult(null)
  }

  async function exportAllPages() {
    if (!renderer || !selectedFile || !numPages || isExporting) {
      return
    }

    setIsExporting(true)
    setExportProgress({ completed: 0, total: numPages })
    setZipResult(null)
    setError("")

    try {
      const entries = []

      for (let pageNumber = 1; pageNumber <= numPages; pageNumber += 1) {
        const image = await renderer.renderPage(pageNumber, renderOptions)
        entries.push({
          data: new Uint8Array(await image.blob.arrayBuffer()),
          name: createPageImageName(
            selectedFile.name,
            pageNumber,
            image.format
          ),
        })
        setExportProgress({ completed: pageNumber, total: numPages })
      }

      setZipResult({
        blob: createStoredZip(entries),
        fileName: createZipName(
          selectedFile.name,
          renderOptions.dpi,
          renderOptions.format
        ),
        pageCount: numPages,
      })
    } catch (exportError) {
      setError(resolveExportErrorMessage(exportError, messages))
    } finally {
      setIsExporting(false)
      setExportProgress(null)
    }
  }

  return {
    clearFile,
    currentImage,
    currentImageName: selectedFile
      ? createPageImageName(selectedFile.name, page, renderOptions.format)
      : "page.png",
    error,
    exportAllPages,
    exportProgress,
    isExporting,
    isLoadingDocument,
    isRendering,
    numPages,
    options: renderOptions,
    page,
    selectedFile,
    selectFile,
    updateOptions,
    updatePage,
    zipResult,
  }
}

export { usePdfToImage }
