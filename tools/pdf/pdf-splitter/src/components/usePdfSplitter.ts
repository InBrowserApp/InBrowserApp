import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { inspectPdf } from '../inspect-pdf'
import { PDF_ERROR } from '../pdf-errors'
import { splitPdfWithWorker } from '../split-pdf'
import { createPdfZip } from '../utils/create-pdf-zip'
import { PAGE_RANGE_ERROR, formatPagesToRanges, parsePageRanges } from '../utils/parse-page-ranges'
import { PdfThumbnailRenderer } from '../utils/pdf-thumbnail-renderer'
import type { SplitMultipleMode, SplitOutputMode } from '../split-pdf.worker'

export type PreviewItem = {
  page: number
  thumbnailUrl: string | null
  isLoading: boolean
  hasError: boolean
}

type SelectionResult = {
  success: boolean
  errorCode?: string
}

const DEFAULT_OUTPUT_NAME = 'split-result'

const getFileBaseName = (filename: string): string => {
  const trimmed = filename.trim()
  if (!trimmed) {
    return DEFAULT_OUTPUT_NAME
  }

  return trimmed.replace(/\.pdf$/i, '') || DEFAULT_OUTPUT_NAME
}

export const usePdfSplitter = () => {
  const file = ref<File | null>(null)
  const pageCount = ref(0)
  const rangeInput = ref('')
  const selectedPages = ref<number[]>([])
  const outputName = ref(DEFAULT_OUTPUT_NAME)
  const outputMode = ref<SplitOutputMode>('single')
  const multipleMode = ref<SplitMultipleMode>('ranges')

  const isLoadingDocument = ref(false)
  const isRenderingThumbnails = ref(false)
  const isGenerating = ref(false)
  const isPreviewLoading = ref(false)

  const fileErrorCode = ref('')
  const rangeErrorCode = ref('')
  const generateErrorCode = ref('')

  const previewPage = ref<number | null>(null)
  const previewBlob = ref<Blob | null>(null)

  const resultPdfBlob = ref<Blob | null>(null)
  const resultZipBlob = ref<Blob | null>(null)
  const resultFilename = ref('')
  const resultFileCount = ref(0)

  const items = ref<PreviewItem[]>([])

  const previewBlobURL = useObjectUrl(previewBlob)
  const resultPdfURL = useObjectUrl(resultPdfBlob)
  const resultZipURL = useObjectUrl(resultZipBlob)

  let renderer: PdfThumbnailRenderer | null = null
  let loadToken = 0
  let previewToken = 0
  let lastInteractedPage: number | null = null

  const selectedPageSet = computed(() => new Set(selectedPages.value))

  const selectedCount = computed(() => selectedPages.value.length)

  const hasSelection = computed(() => selectedCount.value > 0)

  const canGenerate = computed(() => {
    if (!file.value || isGenerating.value || isLoadingDocument.value) {
      return false
    }

    return rangeInput.value.trim().length > 0
  })

  const hasResult = computed(() => Boolean(resultPdfBlob.value || resultZipBlob.value))

  const isSingleResult = computed(() => Boolean(resultPdfBlob.value))

  const downloadUrl = computed(() => resultPdfURL.value ?? resultZipURL.value ?? null)

  const normalizedOutputBaseName = computed(() => {
    const normalized = getFileBaseName(outputName.value)
    if (!normalized) {
      return DEFAULT_OUTPUT_NAME
    }

    return normalized
  })

  const clearFileError = (): void => {
    fileErrorCode.value = ''
  }

  const clearRangeError = (): void => {
    rangeErrorCode.value = ''
  }

  const clearGenerateError = (): void => {
    generateErrorCode.value = ''
  }

  const clearResult = (): void => {
    resultPdfBlob.value = null
    resultZipBlob.value = null
    resultFilename.value = ''
    resultFileCount.value = 0
    clearGenerateError()
  }

  const revokeAllThumbnails = (): void => {
    for (const item of items.value) {
      if (item.thumbnailUrl) {
        URL.revokeObjectURL(item.thumbnailUrl)
      }
    }
  }

  const cleanupRenderer = async (): Promise<void> => {
    if (!renderer) {
      return
    }

    const previousRenderer = renderer
    renderer = null
    await previousRenderer.destroy()
  }

  const resetState = async (): Promise<void> => {
    loadToken += 1
    previewToken += 1

    await cleanupRenderer()
    revokeAllThumbnails()

    file.value = null
    pageCount.value = 0
    rangeInput.value = ''
    selectedPages.value = []
    items.value = []
    outputName.value = DEFAULT_OUTPUT_NAME
    outputMode.value = 'single'
    multipleMode.value = 'ranges'

    isLoadingDocument.value = false
    isRenderingThumbnails.value = false
    isGenerating.value = false
    isPreviewLoading.value = false

    previewPage.value = null
    previewBlob.value = null

    fileErrorCode.value = ''
    rangeErrorCode.value = ''
    generateErrorCode.value = ''

    clearResult()

    lastInteractedPage = null
  }

  const setSelectedPages = (pages: number[], updateRangeInput: boolean): void => {
    const normalized = [...new Set(pages)].sort((left, right) => left - right)
    selectedPages.value = normalized

    if (updateRangeInput) {
      rangeInput.value = formatPagesToRanges(normalized)
    }
  }

  const selectAll = (): void => {
    const pages = Array.from({ length: pageCount.value }, (_, index) => index + 1)
    setSelectedPages(pages, true)
    clearRangeError()
    clearResult()
  }

  const selectOddPages = (): void => {
    const pages = Array.from({ length: pageCount.value }, (_, index) => index + 1).filter(
      (page) => page % 2 === 1,
    )
    setSelectedPages(pages, true)
    clearRangeError()
    clearResult()
  }

  const selectEvenPages = (): void => {
    const pages = Array.from({ length: pageCount.value }, (_, index) => index + 1).filter(
      (page) => page % 2 === 0,
    )
    setSelectedPages(pages, true)
    clearRangeError()
    clearResult()
  }

  const clearSelectedPages = (): void => {
    selectedPages.value = []
    rangeInput.value = ''
    clearRangeError()
    clearResult()
  }

  const togglePageSelection = (page: number, useShift = false): void => {
    const nextSelection = new Set(selectedPages.value)

    if (useShift && lastInteractedPage !== null) {
      const start = Math.min(lastInteractedPage, page)
      const end = Math.max(lastInteractedPage, page)

      for (let current = start; current <= end; current += 1) {
        nextSelection.add(current)
      }
    } else if (nextSelection.has(page)) {
      nextSelection.delete(page)
    } else {
      nextSelection.add(page)
    }

    setSelectedPages([...nextSelection], true)
    lastInteractedPage = page
    clearRangeError()
    clearResult()
  }

  const updateItem = (page: number, patch: Partial<PreviewItem>): void => {
    items.value = items.value.map((item) => {
      if (item.page !== page) {
        return item
      }

      return {
        ...item,
        ...patch,
      }
    })
  }

  const renderThumbnails = async (token: number): Promise<void> => {
    if (!renderer) {
      return
    }

    isRenderingThumbnails.value = true

    for (let page = 1; page <= pageCount.value; page += 1) {
      if (token !== loadToken || !renderer) {
        break
      }

      try {
        const blob = await renderer.renderPage(page, 180)

        if (token !== loadToken) {
          break
        }

        const thumbnailUrl = URL.createObjectURL(blob)
        const previousItem = items.value.find((item) => item.page === page)
        if (previousItem?.thumbnailUrl) {
          URL.revokeObjectURL(previousItem.thumbnailUrl)
        }

        updateItem(page, {
          thumbnailUrl,
          isLoading: false,
          hasError: false,
        })
      } catch {
        if (token !== loadToken) {
          break
        }

        updateItem(page, {
          thumbnailUrl: null,
          isLoading: false,
          hasError: true,
        })
      }

      if (page % 4 === 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, 0)
        })
      }
    }

    if (token === loadToken) {
      isRenderingThumbnails.value = false
    }
  }

  const handleUpload = async (nextFile: File): Promise<void> => {
    loadToken += 1
    const token = loadToken

    await cleanupRenderer()
    revokeAllThumbnails()

    clearFileError()
    clearRangeError()
    clearResult()

    file.value = nextFile
    pageCount.value = 0
    items.value = []
    selectedPages.value = []
    rangeInput.value = ''
    outputName.value = `${getFileBaseName(nextFile.name)}-split`
    previewPage.value = null
    previewBlob.value = null

    isLoadingDocument.value = true
    isRenderingThumbnails.value = false

    try {
      const inspectionResult = await inspectPdf(nextFile)
      if (token !== loadToken) {
        return
      }

      pageCount.value = inspectionResult.pageCount
      setSelectedPages(
        Array.from({ length: inspectionResult.pageCount }, (_, index) => index + 1),
        true,
      )

      items.value = Array.from({ length: inspectionResult.pageCount }, (_, index) => ({
        page: index + 1,
        thumbnailUrl: null,
        isLoading: true,
        hasError: false,
      }))

      renderer = new PdfThumbnailRenderer(nextFile)

      void renderThumbnails(token)
    } catch (error) {
      if (token !== loadToken) {
        return
      }

      const errorCode = error instanceof Error ? error.message : PDF_ERROR.Invalid
      fileErrorCode.value = errorCode
    } finally {
      if (token === loadToken) {
        isLoadingDocument.value = false
      }
    }
  }

  const applyRangeSelection = (): SelectionResult => {
    if (!pageCount.value) {
      return { success: false }
    }

    try {
      const parsed = parsePageRanges(rangeInput.value, pageCount.value)
      setSelectedPages(parsed.pagesInOrder, false)
      clearRangeError()
      clearResult()
      return { success: true }
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : PAGE_RANGE_ERROR.InvalidToken
      rangeErrorCode.value = errorCode
      return {
        success: false,
        errorCode,
      }
    }
  }

  const closePreview = (): void => {
    previewToken += 1
    previewPage.value = null
    previewBlob.value = null
    isPreviewLoading.value = false
  }

  const openPreview = async (page: number): Promise<void> => {
    if (!renderer) {
      return
    }

    previewToken += 1
    const token = previewToken

    previewPage.value = page
    previewBlob.value = null
    isPreviewLoading.value = true

    try {
      const blob = await renderer.renderPage(page, 900)

      if (token !== previewToken) {
        return
      }

      previewBlob.value = blob
    } finally {
      if (token === previewToken) {
        isPreviewLoading.value = false
      }
    }
  }

  const generate = async (): Promise<SelectionResult> => {
    if (!file.value || !pageCount.value || isGenerating.value) {
      return { success: false }
    }

    clearGenerateError()

    const applyResult = applyRangeSelection()
    if (!applyResult.success) {
      return applyResult
    }

    let parsed
    try {
      parsed = parsePageRanges(rangeInput.value, pageCount.value)
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : PAGE_RANGE_ERROR.InvalidToken
      rangeErrorCode.value = errorCode
      return {
        success: false,
        errorCode,
      }
    }

    isGenerating.value = true
    clearResult()

    try {
      const workerResult = await splitPdfWithWorker({
        file: file.value,
        pages: parsed.pagesInOrder,
        segments: parsed.segments,
        outputMode: outputMode.value,
        multipleMode: multipleMode.value,
        outputBaseName: normalizedOutputBaseName.value,
      })

      if (!workerResult.ok) {
        generateErrorCode.value = workerResult.code
        return {
          success: false,
          errorCode: workerResult.code,
        }
      }

      if (workerResult.result.kind === 'single') {
        resultPdfBlob.value = workerResult.result.file.blob
        resultFilename.value = workerResult.result.file.name
        resultFileCount.value = 1
        return { success: true }
      }

      const zipBlob = await createPdfZip(workerResult.result.files)
      resultZipBlob.value = zipBlob
      resultFilename.value = `${normalizedOutputBaseName.value}.zip`
      resultFileCount.value = workerResult.result.files.length

      return { success: true }
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : PDF_ERROR.SplitFailed
      generateErrorCode.value = errorCode
      return {
        success: false,
        errorCode,
      }
    } finally {
      isGenerating.value = false
    }
  }

  onBeforeUnmount(() => {
    void cleanupRenderer()
    revokeAllThumbnails()
  })

  return {
    file,
    pageCount,
    rangeInput,
    selectedPages,
    selectedPageSet,
    outputName,
    outputMode,
    multipleMode,
    isLoadingDocument,
    isRenderingThumbnails,
    isGenerating,
    isPreviewLoading,
    fileErrorCode,
    rangeErrorCode,
    generateErrorCode,
    previewPage,
    previewBlobURL,
    resultFilename,
    resultFileCount,
    hasResult,
    isSingleResult,
    downloadUrl,
    selectedCount,
    hasSelection,
    canGenerate,
    items,
    handleUpload,
    applyRangeSelection,
    togglePageSelection,
    selectAll,
    selectOddPages,
    selectEvenPages,
    clearSelectedPages,
    openPreview,
    closePreview,
    generate,
    resetState,
  }
}
