import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import type { UploadFileInfo } from 'naive-ui'
import {
  canvasToBlob,
  getSvgDimensions,
  loadSvgImage,
  normalizeBackgroundColor,
  resolveOutputSize,
  type OutputFormat,
} from '../utils/svgConversion'

type MessageApi = {
  error: (message: string) => void
  success: (message: string) => void
}

type SvgConverterMessages = {
  onlyOneFile: string
  invalidFileType: string
  readError: string
  invalidSvg: string
  convertSuccess: string
  convertFailed: string
  imageLoadFailed: string
  noCanvas: string
}

export function useSvgConverter(messages: SvgConverterMessages, message: MessageApi) {
  const originalFile = ref<File | null>(null)
  const svgText = ref('')
  const svgDimensions = ref<{ width: number; height: number } | null>(null)
  const outputBlob = ref<Blob | null>(null)
  const outputDimensions = ref<{ width: number; height: number } | null>(null)
  const error = ref('')
  const isConverting = ref(false)

  const format = ref<OutputFormat>('png')
  const width = ref(0)
  const height = ref(0)
  const keepAspect = ref(true)
  const useBackground = ref(false)
  const backgroundColor = ref('#ffffff')
  const quality = ref(92)

  const originalPreviewUrl = useObjectUrl(originalFile)
  const outputPreviewUrl = useObjectUrl(outputBlob)
  const downloadHref = computed(() => outputPreviewUrl.value || '')

  const aspectRatio = computed(() => {
    if (!svgDimensions.value) return 1
    return svgDimensions.value.width / svgDimensions.value.height
  })

  const outputExtension = computed(() => (format.value === 'jpeg' ? 'jpg' : format.value))

  const outputMimeType = computed(() => {
    if (format.value === 'png') return 'image/png'
    if (format.value === 'jpeg') return 'image/jpeg'
    return 'image/webp'
  })

  const outputFileName = computed(() => {
    const base = originalFile.value?.name?.replace(/\.svg$/i, '') || 'converted'
    return `${base}.${outputExtension.value}`
  })

  const originalSizeLabel = computed(() =>
    originalFile.value ? (filesize(originalFile.value.size) as string) : '',
  )

  const outputSizeLabel = computed(() =>
    outputBlob.value ? (filesize(outputBlob.value.size) as string) : '',
  )

  const originalDimensionsLabel = computed(() =>
    svgDimensions.value
      ? `${Math.round(svgDimensions.value.width)} × ${Math.round(svgDimensions.value.height)}`
      : '',
  )

  const outputDimensionsLabel = computed(() =>
    outputDimensions.value
      ? `${outputDimensions.value.width} × ${outputDimensions.value.height}`
      : '',
  )

  const showQuality = computed(() => format.value !== 'png')

  const shouldFillBackground = computed(() =>
    format.value === 'jpeg' ? true : useBackground.value,
  )

  function resetOutput() {
    outputBlob.value = null
    outputDimensions.value = null
  }

  function resetError() {
    error.value = ''
  }

  function setOriginalDimensions(dimensions: { width: number; height: number }) {
    svgDimensions.value = dimensions
    width.value = Math.max(1, Math.round(dimensions.width))
    height.value = Math.max(1, Math.round(dimensions.height))
  }

  function handleClearFile() {
    originalFile.value = null
    svgText.value = ''
    svgDimensions.value = null
    width.value = 0
    height.value = 0
    resetOutput()
    resetError()
  }

  async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
    const file = data.file.file
    if (!file) return false

    if (data.fileList.length > 1) {
      message.error(messages.onlyOneFile)
      return false
    }

    if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
      message.error(messages.invalidFileType)
      return false
    }

    resetError()
    resetOutput()

    try {
      const content = await file.text()
      const dimensions = getSvgDimensions(content, messages.invalidSvg)

      originalFile.value = file
      svgText.value = content
      setOriginalDimensions(dimensions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messages.readError
      error.value = errorMessage
      message.error(errorMessage)
    }

    return false
  }

  function handleWidthUpdate(value: number | null) {
    if (!value) return
    width.value = value
    if (keepAspect.value && svgDimensions.value) {
      height.value = Math.max(1, Math.round(value / aspectRatio.value))
    }
    resetOutput()
  }

  function handleHeightUpdate(value: number | null) {
    if (!value) return
    height.value = value
    if (keepAspect.value && svgDimensions.value) {
      width.value = Math.max(1, Math.round(value * aspectRatio.value))
    }
    resetOutput()
  }

  function handleKeepAspectToggle(value: boolean) {
    keepAspect.value = value
    if (value && svgDimensions.value) {
      width.value = Math.max(1, Math.round(width.value || svgDimensions.value.width))
      height.value = Math.max(1, Math.round(width.value / aspectRatio.value))
    }
    resetOutput()
  }

  function resetToOriginal() {
    if (!svgDimensions.value) return
    setOriginalDimensions(svgDimensions.value)
    resetOutput()
  }

  function handleFormatUpdate(value: OutputFormat) {
    format.value = value
    backgroundColor.value = normalizeBackgroundColor(backgroundColor.value, value)
    resetOutput()
  }

  function handleQualityUpdate(value: number) {
    quality.value = value
    resetOutput()
  }

  function handleBackgroundToggle(value: boolean) {
    useBackground.value = value
    resetOutput()
  }

  function handleBackgroundChange(value: string) {
    backgroundColor.value = normalizeBackgroundColor(value, format.value)
    resetOutput()
  }

  async function convertSvg() {
    if (!svgText.value) return

    resetError()
    isConverting.value = true

    try {
      const { width: outputWidth, height: outputHeight } = resolveOutputSize(
        svgDimensions.value,
        width.value,
        height.value,
      )
      const image = await loadSvgImage(svgText.value, messages.imageLoadFailed)
      const canvas = document.createElement('canvas')

      canvas.width = outputWidth
      canvas.height = outputHeight

      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error(messages.noCanvas)
      }

      if (shouldFillBackground.value) {
        context.fillStyle = backgroundColor.value
        context.fillRect(0, 0, outputWidth, outputHeight)
      }

      context.drawImage(image, 0, 0, outputWidth, outputHeight)

      const qualityValue = showQuality.value ? quality.value / 100 : undefined
      const blob = await canvasToBlob(
        canvas,
        outputMimeType.value,
        qualityValue,
        messages.convertFailed,
      )

      outputBlob.value = blob
      outputDimensions.value = { width: outputWidth, height: outputHeight }
      message.success(messages.convertSuccess)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messages.convertFailed
      error.value = errorMessage
      message.error(messages.convertFailed)
    } finally {
      isConverting.value = false
    }
  }

  return {
    backgroundColor,
    downloadHref,
    error,
    format,
    handleBackgroundChange,
    handleBackgroundToggle,
    handleBeforeUpload,
    handleClearFile,
    handleFormatUpdate,
    handleHeightUpdate,
    handleKeepAspectToggle,
    handleQualityUpdate,
    handleWidthUpdate,
    isConverting,
    keepAspect,
    originalDimensionsLabel,
    originalFile,
    originalPreviewUrl,
    originalSizeLabel,
    outputBlob,
    outputDimensionsLabel,
    outputFileName,
    outputPreviewUrl,
    outputSizeLabel,
    quality,
    resetToOriginal,
    svgText,
    useBackground,
    width,
    height,
    showQuality,
    convertSvg,
  }
}
