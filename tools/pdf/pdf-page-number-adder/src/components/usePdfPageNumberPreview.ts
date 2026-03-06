import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'
import type { PageNumberFontFamily, PageNumberFormat, PageNumberPosition } from '../types'
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

export const usePdfPageNumberPreview = (props: PreviewProps) => {
  const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
  const previewPage = ref(1)
  const isRenderingPage = ref(false)
  const hasPreviewError = ref(false)

  const renderedPageCanvas = document.createElement('canvas')
  let renderSequence = 0

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
  const previewFontFamily = computed(() => (props.fontFamily === 'serif' ? 'serif' : 'sans-serif'))

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

    const sourcePage = previewSourcePage.value

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
    totalPreviewPages,
    isRenderingPage,
    hasPreviewError,
    setPreviewPage,
  }
}
