import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'
import type { PageNumberFontFamily, PageNumberFormat, PageNumberPosition } from '../types'
import { measureStandardFontTextWidth, resolvePreviewFontFamily } from '../utils/page-number-font'
import { buildPageNumberLabel, resolvePageNumberCoordinates } from '../utils/page-number-layout'
import { getAllPages, parsePageSelection } from '../utils/page-range'
import { loadPdfDocument } from '../utils/pdfjs'

type PreviewProps = {
  file: File | null
  rangeInput: string
  rangeErrorCode: string
  startNumber: number
  format: PageNumberFormat
  fontFamily: PageNumberFontFamily
  position: PageNumberPosition
  fontSize: number
  marginX: number
  marginY: number
  pageCount: number
}

const PREVIEW_STALE_ERROR = 'preview-stale'

type PreviewDocumentState = {
  file: File | null
  loadingTask: ReturnType<typeof loadPdfDocument> | null
  promise: Promise<PDFDocumentProxy> | null
  proxy: PDFDocumentProxy | null
  version: number
}

const isPreviewStaleError = (error: unknown): boolean =>
  error instanceof Error && error.message === PREVIEW_STALE_ERROR

export const usePdfPageNumberPreview = (props: PreviewProps) => {
  const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
  const previewPage = ref(1)
  const isRenderingPage = ref(false)
  const hasPreviewError = ref(false)

  const renderedPageCanvas = document.createElement('canvas')
  let renderedPageScale = 1
  const previewDocumentState: PreviewDocumentState = {
    file: null,
    loadingTask: null,
    promise: null,
    proxy: null,
    version: 0,
  }

  let renderSequence = 0

  const nextRenderSequence = (): number => {
    renderSequence += 1
    return renderSequence
  }

  const previewPages = computed<number[]>(() => {
    if (props.pageCount < 1) {
      return [1]
    }

    if (props.rangeErrorCode) {
      return getAllPages(props.pageCount)
    }

    try {
      return parsePageSelection(props.rangeInput, props.pageCount)
    } catch {
      return getAllPages(props.pageCount)
    }
  })

  const totalPreviewPages = computed(() => Math.max(1, previewPages.value.length))

  const previewPageIndex = computed(
    () => Math.min(Math.max(1, previewPage.value), totalPreviewPages.value) - 1,
  )

  const previewSourcePage = computed(() => previewPages.value[previewPageIndex.value] ?? 1)

  const previewLabel = computed(() =>
    buildPageNumberLabel(
      Math.max(0, previewPageIndex.value),
      Math.max(1, props.pageCount),
      Math.max(1, Math.trunc(props.startNumber)),
      props.format,
    ),
  )

  const previewFontSize = computed(() => Math.max(1, Math.trunc(props.fontSize)))
  const previewMarginX = computed(() => Math.max(0, Math.trunc(props.marginX)))
  const previewMarginY = computed(() => Math.max(0, Math.trunc(props.marginY)))

  const clearVisibleCanvas = (): void => {
    const canvas = previewCanvasRef.value
    if (!canvas) {
      return
    }

    canvas.width = 0
    canvas.height = 0
  }

  const showPreviewError = (): void => {
    hasPreviewError.value = true
    clearVisibleCanvas()
  }

  const destroyPreviewDocument = async (): Promise<void> => {
    previewDocumentState.version += 1

    const loadingTask = previewDocumentState.loadingTask
    const documentProxy = previewDocumentState.proxy

    previewDocumentState.file = null
    previewDocumentState.loadingTask = null
    previewDocumentState.promise = null
    previewDocumentState.proxy = null

    try {
      await documentProxy?.destroy()
    } catch {
      // no-op
    }

    try {
      await loadingTask?.destroy()
    } catch {
      // no-op
    }
  }

  const createPreviewDocumentPromise = (file: File, version: number): Promise<PDFDocumentProxy> =>
    (async () => {
      const data = new Uint8Array(await file.arrayBuffer())
      if (previewDocumentState.version !== version || previewDocumentState.file !== file) {
        throw new Error(PREVIEW_STALE_ERROR)
      }

      const loadingTask = loadPdfDocument(data)
      previewDocumentState.loadingTask = loadingTask

      const documentProxy = await loadingTask.promise
      if (previewDocumentState.version !== version || previewDocumentState.file !== file) {
        try {
          await documentProxy.destroy()
        } catch {
          // no-op
        }

        try {
          await loadingTask.destroy()
        } catch {
          // no-op
        }

        throw new Error(PREVIEW_STALE_ERROR)
      }

      previewDocumentState.proxy = documentProxy
      return documentProxy
    })()

  const ensurePreviewDocument = async (file: File): Promise<PDFDocumentProxy> => {
    if (previewDocumentState.file !== file || !previewDocumentState.promise) {
      await destroyPreviewDocument()
      previewDocumentState.file = file
      previewDocumentState.promise = createPreviewDocumentPromise(
        file,
        previewDocumentState.version,
      )
    }

    return previewDocumentState.promise
  }

  const drawPageNumberPreview = async (sequence = renderSequence): Promise<void> => {
    if (renderedPageCanvas.width < 1 || renderedPageCanvas.height < 1) {
      return
    }

    const fontSize = previewFontSize.value * renderedPageScale
    const label = previewLabel.value
    const textWidth = await measureStandardFontTextWidth(label, fontSize, props.fontFamily)
    if (sequence !== renderSequence) {
      throw new Error(PREVIEW_STALE_ERROR)
    }

    const canvas = previewCanvasRef.value
    if (!canvas) {
      return
    }

    canvas.width = renderedPageCanvas.width
    canvas.height = renderedPageCanvas.height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('PREVIEW_CONTEXT_UNAVAILABLE')
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(renderedPageCanvas, 0, 0)

    context.font = `${fontSize}px ${resolvePreviewFontFamily(props.fontFamily)}`
    context.textBaseline = 'top'

    const coordinates = resolvePageNumberCoordinates({
      pageWidth: canvas.width,
      pageHeight: canvas.height,
      textWidth,
      fontSize,
      marginX: previewMarginX.value * renderedPageScale,
      marginY: previewMarginY.value * renderedPageScale,
      position: props.position,
    })

    const topY = canvas.height - coordinates.y - fontSize
    const x = Math.min(Math.max(0, coordinates.x), Math.max(0, canvas.width - textWidth))
    const y = Math.min(Math.max(0, topY), Math.max(0, canvas.height - fontSize))

    context.fillStyle = 'rgba(0, 0, 0, 0.92)'
    context.fillText(label, x, y)
  }

  const renderPreviewPage = async (): Promise<void> => {
    const currentSequence = nextRenderSequence()

    if (!props.file) {
      await destroyPreviewDocument()
      hasPreviewError.value = false
      isRenderingPage.value = false
      clearVisibleCanvas()
      renderedPageCanvas.width = 0
      renderedPageCanvas.height = 0
      renderedPageScale = 1
      return
    }

    const effectivePage = Math.min(Math.max(previewPage.value, 1), totalPreviewPages.value)
    if (effectivePage !== previewPage.value) {
      previewPage.value = effectivePage
      return
    }

    const sourcePage = previewSourcePage.value

    isRenderingPage.value = true
    hasPreviewError.value = false

    try {
      const documentProxy = await ensurePreviewDocument(props.file)
      if (currentSequence !== renderSequence) {
        return
      }

      const page = await documentProxy.getPage(sourcePage)
      if (currentSequence !== renderSequence) {
        return
      }

      const viewportAtScaleOne = page.getViewport({ scale: 1 })

      const targetWidth = Math.min(1200, Math.max(600, viewportAtScaleOne.width))
      const scale = targetWidth / viewportAtScaleOne.width
      const viewport = page.getViewport({ scale })

      renderedPageCanvas.width = Math.max(1, Math.floor(viewport.width))
      renderedPageCanvas.height = Math.max(1, Math.floor(viewport.height))
      renderedPageScale = scale

      const canvasContext = renderedPageCanvas.getContext('2d')
      if (!canvasContext) {
        throw new Error('PREVIEW_CONTEXT_UNAVAILABLE')
      }

      await page.render({
        canvas: renderedPageCanvas,
        canvasContext,
        viewport,
      }).promise

      if (currentSequence !== renderSequence) {
        return
      }

      await drawPageNumberPreview(currentSequence)
    } catch (error) {
      if (currentSequence === renderSequence && !isPreviewStaleError(error)) {
        showPreviewError()
        renderedPageCanvas.width = 0
        renderedPageCanvas.height = 0
        renderedPageScale = 1
      }
    } finally {
      if (currentSequence === renderSequence) {
        isRenderingPage.value = false
      }
    }
  }

  const setPreviewPage = (value: number): void => {
    if (!Number.isFinite(value)) {
      return
    }

    previewPage.value = Math.min(Math.max(1, Math.trunc(value)), totalPreviewPages.value)
  }

  watch(
    () => props.file,
    () => {
      setPreviewPage(1)
    },
  )

  watch(
    () => [props.pageCount, props.rangeInput, props.rangeErrorCode],
    () => {
      setPreviewPage(previewPage.value)
    },
  )

  watch(
    () => [props.file, previewPage.value, props.rangeInput, props.rangeErrorCode],
    () => {
      void renderPreviewPage()
    },
    { immediate: true },
  )

  watch(
    () => [
      props.startNumber,
      props.format,
      props.fontFamily,
      props.position,
      props.fontSize,
      props.marginX,
      props.marginY,
      props.pageCount,
      props.rangeInput,
      props.rangeErrorCode,
    ],
    () => {
      if (!isRenderingPage.value && !hasPreviewError.value) {
        const currentSequence = nextRenderSequence()
        void drawPageNumberPreview(currentSequence).catch((error: unknown) => {
          if (!isPreviewStaleError(error)) {
            showPreviewError()
          }
        })
      }
    },
  )

  onBeforeUnmount(() => {
    renderSequence += 1
    void destroyPreviewDocument()
  })

  return {
    previewCanvasRef,
    previewPage,
    totalPreviewPages,
    isRenderingPage,
    hasPreviewError,
    setPreviewPage,
  }
}
