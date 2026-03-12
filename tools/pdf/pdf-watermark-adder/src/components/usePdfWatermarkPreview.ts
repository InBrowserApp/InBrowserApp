import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'
import type {
  WatermarkFontFamily,
  WatermarkLayoutMode,
  WatermarkMode,
  WatermarkPosition,
} from '../types'
import { getAllPages, parsePageSelection } from '../utils/page-range'
import { loadPdfDocument } from '../utils/pdfjs'
import { normalizeTextLines } from '../utils/watermark-content'
import { measureStandardFontTextWidth, resolvePreviewFontFamily } from '../utils/watermark-font'
import {
  calculateLineHeight,
  calculateTextBlockHeight,
  normalizeRotation,
  resolveWatermarkPlacements,
  rotatePoint,
  toRadians,
} from '../utils/watermark-layout'

type PreviewProps = {
  file: File | null
  pageCount: number
  rangeInput: string
  rangeErrorCode: string
  mode: WatermarkMode
  layoutMode: WatermarkLayoutMode
  text: string
  fontFamily: WatermarkFontFamily
  fontSize: number
  color: string
  opacity: number
  rotation: number
  position: WatermarkPosition
  offsetX: number
  offsetY: number
  tileGapX: number
  tileGapY: number
  imageFile: File | null
  imageScale: number
}

type PreviewDocumentState = {
  file: File | null
  loadingTask: ReturnType<typeof loadPdfDocument> | null
  promise: Promise<PDFDocumentProxy> | null
  proxy: PDFDocumentProxy | null
  version: number
}

type PreviewImageSource = ImageBitmap | HTMLImageElement

type PreviewImageState = {
  file: File | null
  promise: Promise<PreviewImageSource> | null
  image: PreviewImageSource | null
  version: number
}

const PREVIEW_STALE_ERROR = 'preview-stale'

const isPreviewStaleError = (error: unknown): boolean =>
  error instanceof Error && error.message === PREVIEW_STALE_ERROR

const normalizeHexColor = (value: string): string => {
  const normalized = value.trim()
  const shortMatch = normalized.match(/^#([0-9a-f]{3})$/i)
  if (shortMatch) {
    const [red = '0', green = '0', blue = '0'] = (shortMatch[1] ?? '').split('')
    return `#${red}${red}${green}${green}${blue}${blue}`.toUpperCase()
  }

  const fullMatch = normalized.match(/^#([0-9a-f]{6})$/i)
  if (fullMatch) {
    return `#${(fullMatch[1] ?? '000000').toUpperCase()}`
  }

  return '#000000'
}

const toPreviewColor = (value: string, opacity: number): string => {
  const normalized = normalizeHexColor(value)
  const red = Number.parseInt(normalized.slice(1, 3), 16)
  const green = Number.parseInt(normalized.slice(3, 5), 16)
  const blue = Number.parseInt(normalized.slice(5, 7), 16)
  const alpha = Math.min(Math.max(opacity / 100, 0), 1)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const loadPreviewImage = async (file: File): Promise<PreviewImageSource> => {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file)
  }

  return new Promise<PreviewImageSource>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('preview-image-load-failed'))
    }

    image.src = objectUrl
  })
}

const releasePreviewImage = (image: PreviewImageSource | null): void => {
  if (image && 'close' in image && typeof image.close === 'function') {
    image.close()
  }
}

export const usePdfWatermarkPreview = (props: PreviewProps) => {
  const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
  const previewPage = ref(1)
  const isRenderingPage = ref(false)
  const hasPreviewError = ref(false)

  const renderedPageCanvas = document.createElement('canvas')
  const previewDocumentState: PreviewDocumentState = {
    file: null,
    loadingTask: null,
    promise: null,
    proxy: null,
    version: 0,
  }
  const previewImageState: PreviewImageState = {
    file: null,
    promise: null,
    image: null,
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

  const clearVisibleCanvas = (): void => {
    const canvas = previewCanvasRef.value
    if (!canvas) {
      return
    }

    canvas.width = 0
    canvas.height = 0
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

  const destroyPreviewImage = async (): Promise<void> => {
    previewImageState.version += 1
    releasePreviewImage(previewImageState.image)
    previewImageState.file = null
    previewImageState.promise = null
    previewImageState.image = null
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

  const createPreviewImagePromise = (file: File, version: number): Promise<PreviewImageSource> =>
    (async () => {
      const image = await loadPreviewImage(file)
      if (previewImageState.version !== version || previewImageState.file !== file) {
        releasePreviewImage(image)
        throw new Error(PREVIEW_STALE_ERROR)
      }

      previewImageState.image = image
      return image
    })()

  const ensurePreviewImage = async (file: File): Promise<PreviewImageSource> => {
    if (previewImageState.file !== file || !previewImageState.promise) {
      await destroyPreviewImage()
      previewImageState.file = file
      previewImageState.promise = createPreviewImagePromise(file, previewImageState.version)
    }

    return previewImageState.promise
  }

  const drawTextWatermark = async (
    context: CanvasRenderingContext2D,
    canvasHeight: number,
    sequence: number,
  ): Promise<void> => {
    const lines = normalizeTextLines(props.text)
    if (lines.length < 1) {
      return
    }

    const fontSize = Math.max(8, Math.trunc(props.fontSize))
    const rotation = normalizeRotation(props.rotation)
    const lineHeight = calculateLineHeight(fontSize)
    const lineWidths = await Promise.all(
      lines.map((line) => measureStandardFontTextWidth(line, fontSize, props.fontFamily)),
    )

    if (sequence !== renderSequence) {
      throw new Error(PREVIEW_STALE_ERROR)
    }

    const boxWidth = Math.max(1, ...lineWidths)
    const boxHeight = calculateTextBlockHeight(lines.length, fontSize, lineHeight)
    const placements = resolveWatermarkPlacements({
      pageWidth: context.canvas.width,
      pageHeight: context.canvas.height,
      boxWidth,
      boxHeight,
      layoutMode: props.layoutMode,
      position: props.position,
      offsetX: props.offsetX,
      offsetY: props.offsetY,
      rotation,
      tileGapX: props.tileGapX,
      tileGapY: props.tileGapY,
    })

    context.fillStyle = toPreviewColor(props.color, props.opacity)
    context.font = `${fontSize}px ${resolvePreviewFontFamily(props.fontFamily)}`
    context.textBaseline = 'bottom'

    for (const placement of placements) {
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index] ?? ''
        const lineWidth = lineWidths[index] ?? 0
        const localX = (boxWidth - lineWidth) / 2
        const localY = boxHeight - fontSize - index * lineHeight
        const point = rotatePoint(localX, localY, rotation)

        context.save()
        context.translate(placement.originX + point.x, canvasHeight - (placement.originY + point.y))
        context.rotate(-toRadians(rotation))
        context.fillText(line, 0, 0)
        context.restore()
      }
    }
  }

  const drawImageWatermark = async (
    context: CanvasRenderingContext2D,
    canvasHeight: number,
    sequence: number,
  ): Promise<void> => {
    if (!props.imageFile) {
      return
    }

    const image = await ensurePreviewImage(props.imageFile)
    if (sequence !== renderSequence) {
      throw new Error(PREVIEW_STALE_ERROR)
    }

    const imageWidth = 'naturalWidth' in image ? image.naturalWidth : image.width
    const imageHeight = 'naturalHeight' in image ? image.naturalHeight : image.height
    if (imageWidth < 1 || imageHeight < 1) {
      return
    }

    const rotation = normalizeRotation(props.rotation)
    const width = context.canvas.width * (Math.min(Math.max(props.imageScale, 5), 100) / 100)
    const height = width * (imageHeight / imageWidth)
    const placements = resolveWatermarkPlacements({
      pageWidth: context.canvas.width,
      pageHeight: context.canvas.height,
      boxWidth: width,
      boxHeight: height,
      layoutMode: props.layoutMode,
      position: props.position,
      offsetX: props.offsetX,
      offsetY: props.offsetY,
      rotation,
      tileGapX: props.tileGapX,
      tileGapY: props.tileGapY,
    })

    for (const placement of placements) {
      context.save()
      context.globalAlpha = Math.min(Math.max(props.opacity / 100, 0), 1)
      context.translate(placement.originX, canvasHeight - placement.originY)
      context.rotate(-toRadians(rotation))
      context.drawImage(image, 0, -height, width, height)
      context.restore()
    }
  }

  const drawWatermarkPreview = async (sequence: number): Promise<void> => {
    const canvas = previewCanvasRef.value
    if (!canvas || renderedPageCanvas.width < 1 || renderedPageCanvas.height < 1) {
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

    if (props.mode === 'image') {
      await drawImageWatermark(context, canvas.height, sequence)
      return
    }

    await drawTextWatermark(context, canvas.height, sequence)
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
      return
    }

    const effectivePage = Math.min(Math.max(previewPage.value, 1), totalPreviewPages.value)
    if (effectivePage !== previewPage.value) {
      previewPage.value = effectivePage
      return
    }

    isRenderingPage.value = true
    hasPreviewError.value = false

    try {
      const documentProxy = await ensurePreviewDocument(props.file)
      if (currentSequence !== renderSequence) {
        return
      }

      const page = await documentProxy.getPage(previewSourcePage.value)
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

      await drawWatermarkPreview(currentSequence)
    } catch (error) {
      if (currentSequence === renderSequence && !isPreviewStaleError(error)) {
        hasPreviewError.value = true
        clearVisibleCanvas()
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
      previewPage.value = 1
    },
  )

  watch(
    () => [props.pageCount, props.rangeInput, props.rangeErrorCode],
    () => {
      previewPage.value = 1
    },
  )

  watch(
    () => [
      props.file,
      props.pageCount,
      props.rangeInput,
      props.rangeErrorCode,
      props.mode,
      props.layoutMode,
      props.text,
      props.fontFamily,
      props.fontSize,
      props.color,
      props.opacity,
      props.rotation,
      props.position,
      props.offsetX,
      props.offsetY,
      props.tileGapX,
      props.tileGapY,
      props.imageFile,
      props.imageScale,
      previewPage.value,
    ],
    () => {
      void renderPreviewPage()
    },
    { immediate: true },
  )

  watch(
    () => props.imageFile,
    async (file, previousFile) => {
      if (file === previousFile) {
        return
      }

      await destroyPreviewImage()
    },
  )

  onBeforeUnmount(() => {
    void destroyPreviewDocument()
    void destroyPreviewImage()
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
