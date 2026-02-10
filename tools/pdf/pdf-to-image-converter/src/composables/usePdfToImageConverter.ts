import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import type { ImageFormat, PdfPageImage, RenderPageOptions, ZipImageEntry } from '../types'
import { DEFAULT_DPI, clampDpi } from '../utils/dpi'
import { createImageZip } from '../utils/create-image-zip'
import { createPageImageName, createZipName } from '../utils/filename'
import { PdfToImageRenderer } from '../utils/pdf-to-image-renderer'
import { shouldUseQuality } from '../utils/mime'

export type PdfToImageConverterMessageText = {
  loadFailed: () => string
  loadFailedInvalid: () => string
  renderFailed: () => string
  renderFailedCanvas: () => string
  exportFailed: () => string
  exportFailedCanvas: () => string
  zipReady: (params: { count: number }) => string
}

export type UsePdfToImageConverterOptions = {
  text?: Partial<PdfToImageConverterMessageText>
}

const defaultMessageText: PdfToImageConverterMessageText = {
  loadFailed: () => 'loadFailed',
  loadFailedInvalid: () => 'loadFailedInvalid',
  renderFailed: () => 'renderFailed',
  renderFailedCanvas: () => 'renderFailedCanvas',
  exportFailed: () => 'exportFailed',
  exportFailedCanvas: () => 'exportFailedCanvas',
  zipReady: () => 'zipReady',
}

export function usePdfToImageConverter(options: UsePdfToImageConverterOptions = {}) {
  const message = useMessage()
  const text: PdfToImageConverterMessageText = {
    ...defaultMessageText,
    ...options.text,
  }

  const pdfFile = ref<File | null>(null)
  const renderer = ref<PdfToImageRenderer | null>(null)

  const numPages = ref(0)
  const page = ref(1)
  const format = ref<ImageFormat>('png')
  const dpi = ref(DEFAULT_DPI)
  const quality = ref(0.92)

  const currentPageImage = ref<PdfPageImage | null>(null)
  const isLoadingDocument = ref(false)
  const isRenderingPage = ref(false)
  const isExporting = ref(false)
  const exportProgress = ref(0)
  const errorMessage = ref('')

  const zipDownloadBlob = ref<Blob | null>(null)

  const isRendering = computed(() => isLoadingDocument.value || isRenderingPage.value)

  const currentImageObjectURL = useObjectUrl(computed(() => currentPageImage.value?.blob ?? null))
  const zipDownloadObjectURL = useObjectUrl(zipDownloadBlob)

  const currentImageURL = computed(() => currentImageObjectURL.value ?? null)
  const zipDownloadURL = computed(() => zipDownloadObjectURL.value ?? null)

  const currentDownloadName = computed(() => {
    if (!pdfFile.value) return 'page.png'
    return createPageImageName(pdfFile.value.name, page.value, format.value)
  })

  const zipDownloadName = computed(() => {
    if (!pdfFile.value) return 'pdf-images.zip'
    return createZipName(pdfFile.value.name, dpi.value, format.value)
  })

  let loadToken = 0
  let renderToken = 0

  function clampQuality(value: number): number {
    if (!Number.isFinite(value)) return 0.92
    return Math.min(1, Math.max(0.1, value))
  }

  function getRenderOptions(): RenderPageOptions {
    return {
      dpi: clampDpi(dpi.value),
      format: format.value,
      quality: clampQuality(quality.value),
    }
  }

  function setFormat(value: ImageFormat): void {
    format.value = value
  }

  function setDpi(value: number): void {
    dpi.value = clampDpi(value)
  }

  function setQuality(value: number): void {
    quality.value = clampQuality(value)
  }

  function handleUpload(file: File): void {
    pdfFile.value = file
  }

  watch(pdfFile, async (file, previousFile) => {
    loadToken += 1
    const currentLoadToken = loadToken

    if (previousFile && previousFile !== file) {
      zipDownloadBlob.value = null
    }

    await renderer.value?.destroy()
    renderer.value = null
    numPages.value = 0
    page.value = 1
    currentPageImage.value = null
    errorMessage.value = ''
    exportProgress.value = 0

    if (!file) return

    isLoadingDocument.value = true
    try {
      const nextRenderer = new PdfToImageRenderer(file)
      const totalPages = await nextRenderer.getNumPages()

      if (currentLoadToken !== loadToken) {
        await nextRenderer.destroy()
        return
      }

      renderer.value = nextRenderer
      numPages.value = totalPages
      page.value = 1
      zipDownloadBlob.value = null
    } catch (error) {
      errorMessage.value = resolveLoadErrorMessage(text, error)
    } finally {
      if (currentLoadToken === loadToken) {
        isLoadingDocument.value = false
      }
    }
  })

  watch([renderer, page, format, dpi, quality, numPages], async () => {
    if (!renderer.value || !numPages.value) {
      currentPageImage.value = null
      return
    }

    renderToken += 1
    const currentRenderToken = renderToken
    isRenderingPage.value = true
    errorMessage.value = ''

    try {
      const image = await renderer.value.renderPage(page.value, getRenderOptions())
      if (currentRenderToken !== renderToken) return
      currentPageImage.value = image
    } catch (error) {
      if (currentRenderToken !== renderToken) return
      currentPageImage.value = null
      errorMessage.value = resolveRenderErrorMessage(text, error)
    } finally {
      if (currentRenderToken === renderToken) {
        isRenderingPage.value = false
      }
    }
  })

  watch([format, dpi, quality, pdfFile], () => {
    zipDownloadBlob.value = null
    exportProgress.value = 0
  })

  watch(format, (value) => {
    if (shouldUseQuality(value)) return
    quality.value = 0.92
  })

  async function exportAllPages(): Promise<void> {
    if (!renderer.value || !pdfFile.value || !numPages.value || isExporting.value) {
      return
    }

    isExporting.value = true
    exportProgress.value = 0
    zipDownloadBlob.value = null
    errorMessage.value = ''

    try {
      const options = getRenderOptions()
      const entries: ZipImageEntry[] = []

      for (let pageNumber = 1; pageNumber <= numPages.value; pageNumber += 1) {
        const image = await renderer.value.renderPage(pageNumber, options)
        entries.push({
          name: createPageImageName(pdfFile.value.name, pageNumber, format.value),
          blob: image.blob,
        })
        exportProgress.value = pageNumber
      }

      zipDownloadBlob.value = await createImageZip(entries)
      message.success(text.zipReady({ count: entries.length }))
    } catch (error) {
      errorMessage.value = resolveExportErrorMessage(text, error)
      message.error(errorMessage.value)
    } finally {
      isExporting.value = false
    }
  }

  onBeforeUnmount(() => {
    void renderer.value?.destroy()
  })

  return {
    page,
    numPages,
    format,
    dpi,
    quality,
    currentPageImage,
    isLoadingDocument,
    isRendering,
    isExporting,
    exportProgress,
    errorMessage,
    currentImageURL,
    currentDownloadName,
    zipDownloadURL,
    zipDownloadName,
    handleUpload,
    setFormat,
    setDpi,
    setQuality,
    exportAllPages,
  }
}

function resolveLoadErrorMessage(text: PdfToImageConverterMessageText, error: unknown): string {
  if (error instanceof Error && error.message.toLowerCase().includes('invalid pdf')) {
    return text.loadFailedInvalid()
  }

  return text.loadFailed()
}

function resolveRenderErrorMessage(text: PdfToImageConverterMessageText, error: unknown): string {
  if (error instanceof Error && error.message === 'CANVAS_CONTEXT_UNAVAILABLE') {
    return text.renderFailedCanvas()
  }

  return text.renderFailed()
}

function resolveExportErrorMessage(text: PdfToImageConverterMessageText, error: unknown): string {
  if (error instanceof Error && error.message === 'CANVAS_TO_BLOB_FAILED') {
    return text.exportFailedCanvas()
  }

  return text.exportFailed()
}
