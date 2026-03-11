import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { inspectPdf, isPdfFile } from '../inspect-pdf'
import { organizePdfWithWorker } from '../organize-pdf'
import { PDF_ERROR } from '../pdf-errors'
import { PdfPageRenderer } from '../utils/pdf-renderer'
import {
  createOutputFileName,
  normalizeRotation,
  PREVIEW_WIDTH,
  THUMBNAIL_WIDTH,
  type ActionResult,
  type OrganizerPage,
} from './pageOrganizerState'
import { createPagesFromRotations } from './pageOrganizerOperations'
import { usePageOrganizerEdits } from './usePageOrganizerEdits'

export const usePdfPageOrganizer = () => {
  const file = ref<File | null>(null)
  const originalPageCount = ref(0)
  const originalPageRotations = ref<number[]>([])
  const pages = ref<OrganizerPage[]>([])
  const previewPageId = ref<string | null>(null)

  const isLoadingDocument = ref(false)
  const isRenderingThumbnails = ref(false)
  const isPreviewLoading = ref(false)
  const isGenerating = ref(false)

  const fileErrorCode = ref('')
  const generateErrorCode = ref('')

  const previewBlob = ref<Blob | null>(null)
  const resultBlob = ref<Blob | null>(null)
  const resultFilename = ref('')

  const previewUrl = useObjectUrl(previewBlob)
  const downloadUrl = useObjectUrl(resultBlob)

  let renderer: PdfPageRenderer | null = null
  let loadToken = 0
  let previewToken = 0
  let thumbnailToken = 0
  let exportToken = 0

  const hasPages = computed(() => pages.value.length > 0)
  const hasResult = computed(() => Boolean(resultBlob.value && resultFilename.value))
  const canExport = computed(
    () => Boolean(file.value) && hasPages.value && !isLoadingDocument.value && !isGenerating.value,
  )
  const hasChanges = computed(() => {
    if (pages.value.length !== originalPageCount.value) {
      return true
    }

    return pages.value.some(
      (page, index) =>
        page.sourcePageNumber !== index + 1 || normalizeRotation(page.rotationOffset) !== 0,
    )
  })

  const currentPreviewPage = computed(
    () => pages.value.find((page) => page.id === previewPageId.value) ?? null,
  )
  const currentPreviewIndex = computed(() =>
    pages.value.findIndex((page) => page.id === previewPageId.value),
  )
  const previewImageUrl = computed(() => previewUrl.value || null)
  const previewPlaceholderUrl = computed(() => currentPreviewPage.value?.thumbnailUrl || null)
  const previewRotation = computed(() => currentPreviewPage.value?.rotationOffset ?? 0)
  const previewDisplayPage = computed(() => {
    if (currentPreviewIndex.value < 0) {
      return null
    }

    return currentPreviewIndex.value + 1
  })
  const canPreviewPrevious = computed(() => currentPreviewIndex.value > 0)
  const canPreviewNext = computed(
    () => currentPreviewIndex.value >= 0 && currentPreviewIndex.value < pages.value.length - 1,
  )

  const revokeThumbnailUrl = (page: OrganizerPage): void => {
    if (page.thumbnailUrl) {
      URL.revokeObjectURL(page.thumbnailUrl)
    }
  }

  const revokeAllThumbnails = (): void => {
    for (const page of pages.value) {
      revokeThumbnailUrl(page)
    }
  }

  const destroyRenderer = async (): Promise<void> => {
    if (!renderer) {
      return
    }

    const currentRenderer = renderer
    renderer = null
    await currentRenderer.destroy()
  }

  const clearResult = (): void => {
    resultBlob.value = null
    resultFilename.value = ''
    generateErrorCode.value = ''
  }

  const cancelPendingExport = (): void => {
    exportToken += 1
    isGenerating.value = false
  }

  const clearPreview = (): void => {
    previewToken += 1
    previewPageId.value = null
    previewBlob.value = null
    isPreviewLoading.value = false
  }

  const resetState = async (): Promise<void> => {
    loadToken += 1
    thumbnailToken += 1
    cancelPendingExport()
    await destroyRenderer()
    revokeAllThumbnails()
    resetSelection()
    clearPreview()
    clearResult()
    file.value = null
    pages.value = []
    originalPageCount.value = 0
    originalPageRotations.value = []
    clearHistory()
    fileErrorCode.value = ''
    isLoadingDocument.value = false
    isRenderingThumbnails.value = false
  }

  const updatePage = (pageId: string, patch: Partial<OrganizerPage>): void => {
    const index = pages.value.findIndex((page) => page.id === pageId)
    if (index < 0) {
      return
    }

    const currentPage = pages.value[index]
    if (!currentPage) {
      return
    }

    pages.value[index] = {
      id: patch.id ?? currentPage.id,
      sourcePageNumber: patch.sourcePageNumber ?? currentPage.sourcePageNumber,
      originalRotation: patch.originalRotation ?? currentPage.originalRotation,
      rotationOffset: patch.rotationOffset ?? currentPage.rotationOffset,
      thumbnailUrl: patch.thumbnailUrl ?? currentPage.thumbnailUrl,
      isLoading: patch.isLoading ?? currentPage.isLoading,
      hasError: patch.hasError ?? currentPage.hasError,
    }
  }

  const ensurePreviewStillValid = (): void => {
    if (!previewPageId.value) {
      return
    }

    if (!pages.value.some((page) => page.id === previewPageId.value)) {
      clearPreview()
    }
  }

  const renderThumbnails = async (token: number): Promise<void> => {
    if (!renderer || !pages.value.length) {
      return
    }

    const currentThumbnailToken = ++thumbnailToken
    const pendingPages = pages.value
      .filter((page) => !page.thumbnailUrl)
      .map((page) => page.sourcePageNumber)

    if (!pendingPages.length) {
      isRenderingThumbnails.value = false
      return
    }

    isRenderingThumbnails.value = true

    for (const pageNumber of pendingPages) {
      if (!renderer || token !== loadToken || currentThumbnailToken !== thumbnailToken) {
        return
      }

      const pageId = String(pageNumber)
      updatePage(pageId, { isLoading: true, hasError: false })

      try {
        const blob = await renderer.renderPage(pageNumber, THUMBNAIL_WIDTH)
        if (token !== loadToken || currentThumbnailToken !== thumbnailToken) {
          return
        }

        const thumbnailUrl = URL.createObjectURL(blob)
        const currentPage = pages.value.find((page) => page.id === pageId)
        if (!currentPage) {
          URL.revokeObjectURL(thumbnailUrl)
          continue
        }

        if (currentPage.thumbnailUrl) {
          URL.revokeObjectURL(currentPage.thumbnailUrl)
        }

        updatePage(pageId, {
          thumbnailUrl,
          isLoading: false,
          hasError: false,
        })
      } catch {
        if (token !== loadToken || currentThumbnailToken !== thumbnailToken) {
          return
        }

        updatePage(pageId, {
          isLoading: false,
          hasError: true,
        })
      }
    }

    if (token === loadToken && currentThumbnailToken === thumbnailToken) {
      isRenderingThumbnails.value = false
    }
  }

  const markDocumentChanged = (): void => {
    cancelPendingExport()
    clearResult()
    ensurePreviewStillValid()
  }

  const {
    selectedCount,
    selectedPageSet,
    canUndo,
    canRedo,
    resetSelection,
    resetHistory,
    clearHistory,
    reorderPages,
    movePage,
    rotatePage,
    rotateSelectedPages,
    deletePage,
    deleteSelectedPages,
    togglePageSelection,
    selectAllPages,
    clearSelection,
    resetChanges,
    undoChanges,
    redoChanges,
  } = usePageOrganizerEdits({
    pages,
    originalPageRotations,
    beforeRestore: clearPreview,
    afterPagesUpdated: () => {
      markDocumentChanged()
      void renderThumbnails(loadToken)
    },
  })

  const openPreview = async (pageId: string): Promise<ActionResult> => {
    const page = pages.value.find((item) => item.id === pageId)
    if (!page || !renderer) {
      return { success: false, errorCode: PDF_ERROR.PreviewFailed }
    }

    previewPageId.value = pageId
    previewBlob.value = null
    isPreviewLoading.value = true

    const currentPreviewToken = ++previewToken

    try {
      const blob = await renderer.renderPage(page.sourcePageNumber, PREVIEW_WIDTH)
      if (currentPreviewToken !== previewToken) {
        return { success: false }
      }

      previewBlob.value = blob
      return { success: true }
    } catch {
      if (currentPreviewToken !== previewToken) {
        return { success: false }
      }

      return { success: false, errorCode: PDF_ERROR.PreviewFailed }
    } finally {
      if (currentPreviewToken === previewToken) {
        isPreviewLoading.value = false
      }
    }
  }

  const previewByOffset = async (offset: number): Promise<ActionResult> => {
    const nextIndex = currentPreviewIndex.value + offset
    const targetPage = pages.value[nextIndex]
    if (!targetPage) {
      return { success: false }
    }

    return await openPreview(targetPage.id)
  }

  const exportPdf = async (): Promise<ActionResult> => {
    if (!file.value || !pages.value.length) {
      return { success: false, errorCode: PDF_ERROR.ExportFailed }
    }

    const currentExportToken = ++exportToken
    isGenerating.value = true
    generateErrorCode.value = ''
    resultBlob.value = null
    resultFilename.value = ''

    try {
      const response = await organizePdfWithWorker({
        file: file.value,
        pages: pages.value.map((page) => ({
          sourcePageNumber: page.sourcePageNumber,
          rotation: normalizeRotation(page.originalRotation + page.rotationOffset),
        })),
        outputFileName: createOutputFileName(file.value),
      })

      if (currentExportToken !== exportToken) {
        return { success: false }
      }

      if (!response.ok) {
        generateErrorCode.value = response.code
        return { success: false, errorCode: response.code }
      }

      resultBlob.value = response.result.file.blob
      resultFilename.value = response.result.file.name
      return { success: true }
    } catch (error) {
      if (currentExportToken !== exportToken) {
        return { success: false }
      }

      const errorCode = error instanceof Error ? error.message : PDF_ERROR.ExportFailed
      generateErrorCode.value = errorCode
      return { success: false, errorCode }
    } finally {
      if (currentExportToken === exportToken) {
        isGenerating.value = false
      }
    }
  }

  const handleUpload = async (nextFile: File): Promise<ActionResult> => {
    if (!isPdfFile(nextFile)) {
      fileErrorCode.value = PDF_ERROR.Invalid
      return { success: false, errorCode: PDF_ERROR.Invalid }
    }

    isLoadingDocument.value = true
    fileErrorCode.value = ''

    const currentLoadToken = ++loadToken
    const nextRenderer = new PdfPageRenderer(nextFile)

    try {
      const inspection = await inspectPdf(nextFile)
      if (currentLoadToken !== loadToken) {
        await nextRenderer.destroy()
        return { success: false }
      }

      thumbnailToken += 1
      await destroyRenderer()
      revokeAllThumbnails()

      renderer = nextRenderer
      file.value = nextFile
      originalPageCount.value = inspection.pageCount
      originalPageRotations.value = inspection.pageRotations
      const nextPages = createPagesFromRotations(inspection.pageRotations)
      pages.value = nextPages
      resetSelection()
      clearPreview()
      clearResult()
      resetHistory(nextPages)
      void renderThumbnails(currentLoadToken)
      return { success: true }
    } catch (error) {
      await nextRenderer.destroy()
      if (currentLoadToken !== loadToken) {
        return { success: false }
      }

      const errorCode = error instanceof Error ? error.message : PDF_ERROR.Invalid
      fileErrorCode.value = errorCode
      return { success: false, errorCode }
    } finally {
      if (currentLoadToken === loadToken) {
        isLoadingDocument.value = false
      }
    }
  }

  onBeforeUnmount(() => void resetState())

  return {
    file,
    pages,
    originalPageCount,
    selectedCount,
    selectedPageSet,
    previewPageId,
    previewImageUrl,
    previewPlaceholderUrl,
    previewRotation,
    previewDisplayPage,
    canPreviewPrevious,
    canPreviewNext,
    isLoadingDocument,
    isRenderingThumbnails,
    isPreviewLoading,
    isGenerating,
    fileErrorCode,
    generateErrorCode,
    hasPages,
    hasChanges,
    hasResult,
    canUndo,
    canRedo,
    canExport,
    resultFilename,
    downloadUrl,
    handleUpload,
    reorderPages,
    movePage,
    rotatePage,
    rotateSelectedPages,
    deletePage,
    deleteSelectedPages,
    togglePageSelection,
    selectAllPages,
    clearSelection,
    resetChanges,
    undoChanges,
    redoChanges,
    openPreview,
    previewByOffset,
    closePreview: clearPreview,
    exportPdf,
    clearFile: resetState,
  }
}
