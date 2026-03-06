import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'
import type { PageNumberFontFamily, PageNumberFormat, PageNumberPosition } from '../types'
import { buildPageNumberLabel, resolvePageNumberCoordinates } from '../utils/page-number-layout'
import { loadPdfDocument } from '../utils/pdfjs'

type PreviewProps = {
  file: File | null
  startNumber: number
  format: PageNumberFormat
  fontFamily: PageNumberFontFamily
  position: PageNumberPosition
  fontSize: number
  marginX: number
  marginY: number
  pageCount: number
}

export const usePdfPageNumberPreview = (props: PreviewProps) => {
  const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
  const previewPage = ref(1)
  const pageWidthPt = ref(0)
  const pageHeightPt = ref(0)
  const isRenderingPage = ref(false)
  const hasPreviewError = ref(false)

  const renderedPageCanvas = document.createElement('canvas')
  let renderSequence = 0

  const totalPreviewPages = computed(() => Math.max(1, props.pageCount))
  const canGoPrevious = computed(() => previewPage.value > 1)
  const canGoNext = computed(() => previewPage.value < totalPreviewPages.value)
  const previewFontFamily = computed(() => (props.fontFamily === 'serif' ? 'serif' : 'sans-serif'))

  const previewLabel = computed(() =>
    buildPageNumberLabel(
      Math.max(0, previewPage.value - 1),
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

  const drawPageNumberPreview = (): void => {
    const canvas = previewCanvasRef.value
    if (!canvas || renderedPageCanvas.width < 1 || renderedPageCanvas.height < 1) {
      return
    }

    canvas.width = renderedPageCanvas.width
    canvas.height = renderedPageCanvas.height

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(renderedPageCanvas, 0, 0)

    const fontSize = previewFontSize.value
    const label = previewLabel.value

    context.font = `${fontSize}px ${previewFontFamily.value}`
    context.textBaseline = 'top'

    const textWidth = context.measureText(label).width
    const coordinates = resolvePageNumberCoordinates({
      pageWidth: canvas.width,
      pageHeight: canvas.height,
      textWidth,
      fontSize,
      marginX: previewMarginX.value,
      marginY: previewMarginY.value,
      position: props.position,
    })

    const topY = canvas.height - coordinates.y - fontSize
    const x = Math.min(Math.max(0, coordinates.x), Math.max(0, canvas.width - textWidth))
    const y = Math.min(Math.max(0, topY), Math.max(0, canvas.height - fontSize))

    context.fillStyle = 'rgba(255, 255, 255, 0.84)'
    context.fillRect(x - 4, y - 2, textWidth + 8, fontSize + 4)
    context.fillStyle = 'rgba(0, 0, 0, 0.84)'
    context.fillText(label, x, y)
  }

  const renderPreviewPage = async (): Promise<void> => {
    const currentSequence = ++renderSequence

    if (!props.file) {
      hasPreviewError.value = false
      isRenderingPage.value = false
      pageWidthPt.value = 0
      pageHeightPt.value = 0
      clearVisibleCanvas()
      renderedPageCanvas.width = 0
      renderedPageCanvas.height = 0
      return
    }

    const effectivePage = Math.min(Math.max(previewPage.value, 1), totalPreviewPages.value)
    if (effectivePage !== previewPage.value) {
      previewPage.value = effectivePage
      return
    }

    isRenderingPage.value = true
    hasPreviewError.value = false

    let loadingTask: ReturnType<typeof loadPdfDocument> | null = null
    let documentProxy: PDFDocumentProxy | null = null

    try {
      const data = new Uint8Array(await props.file.arrayBuffer())
      if (currentSequence !== renderSequence) {
        return
      }

      loadingTask = loadPdfDocument(data)
      documentProxy = await loadingTask.promise

      if (currentSequence !== renderSequence) {
        return
      }

      const page = await documentProxy.getPage(effectivePage)
      if (currentSequence !== renderSequence) {
        return
      }

      const viewportAtScaleOne = page.getViewport({ scale: 1 })
      pageWidthPt.value = Math.round(viewportAtScaleOne.width)
      pageHeightPt.value = Math.round(viewportAtScaleOne.height)

      const targetWidth = Math.min(1200, Math.max(600, viewportAtScaleOne.width))
      const scale = targetWidth / viewportAtScaleOne.width
      const viewport = page.getViewport({ scale })

      renderedPageCanvas.width = Math.max(1, Math.floor(viewport.width))
      renderedPageCanvas.height = Math.max(1, Math.floor(viewport.height))

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

      drawPageNumberPreview()
    } catch {
      if (currentSequence === renderSequence) {
        hasPreviewError.value = true
        pageWidthPt.value = 0
        pageHeightPt.value = 0
        clearVisibleCanvas()
        renderedPageCanvas.width = 0
        renderedPageCanvas.height = 0
      }
    } finally {
      try {
        loadingTask?.destroy()
      } catch {
        // no-op
      }

      try {
        documentProxy?.destroy()
      } catch {
        // no-op
      }

      if (currentSequence === renderSequence) {
        isRenderingPage.value = false
      }
    }
  }

  const goToPreviousPage = (): void => {
    if (canGoPrevious.value) {
      previewPage.value -= 1
    }
  }

  const goToNextPage = (): void => {
    if (canGoNext.value) {
      previewPage.value += 1
    }
  }

  watch(
    () => props.file,
    () => {
      previewPage.value = 1
    },
  )

  watch(
    () => props.pageCount,
    () => {
      previewPage.value = Math.min(previewPage.value, totalPreviewPages.value)
    },
  )

  watch(
    () => [props.file, previewPage.value],
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
    ],
    () => {
      if (!isRenderingPage.value && !hasPreviewError.value) {
        drawPageNumberPreview()
      }
    },
  )

  onBeforeUnmount(() => {
    renderSequence += 1
  })

  return {
    previewCanvasRef,
    previewPage,
    pageWidthPt,
    pageHeightPt,
    totalPreviewPages,
    canGoPrevious,
    canGoNext,
    isRenderingPage,
    hasPreviewError,
    goToPreviousPage,
    goToNextPage,
  }
}
