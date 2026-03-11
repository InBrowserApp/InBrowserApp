import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { applyWatermarkWithWorker } from '../apply-watermark'
import { inspectPdf, isPdfFile } from '../inspect-pdf'
import { PDF_ERROR } from '../pdf-errors'
import type { WatermarkFontFamily, WatermarkMode, WatermarkPosition } from '../types'
import { PAGE_RANGE_ERROR, parsePageSelection } from '../utils/page-range'
import {
  isSupportedWatermarkImageFile,
  normalizeWatermarkImageFile,
} from '../utils/watermark-content'
import { normalizeRotation } from '../utils/watermark-layout'

type ActionResult = {
  success: boolean
  errorCode?: string
}

const DEFAULT_FILE_NAME = 'watermarked'
const DEFAULT_TEXT = 'CONFIDENTIAL'

const sanitizeInteger = (value: number, fallback: number, min?: number, max?: number): number => {
  if (!Number.isFinite(value)) {
    return fallback
  }

  let result = Math.trunc(value)

  if (min !== undefined) {
    result = Math.max(min, result)
  }

  if (max !== undefined) {
    result = Math.min(max, result)
  }

  return result
}

const getOutputFileName = (filename: string): string => {
  const trimmed = filename.trim()
  if (!trimmed) {
    return `${DEFAULT_FILE_NAME}.pdf`
  }

  const baseName = trimmed.replace(/\.pdf$/i, '')
  if (!baseName) {
    return `${DEFAULT_FILE_NAME}.pdf`
  }

  return `${baseName}-watermarked.pdf`
}

export const usePdfWatermarkAdder = () => {
  let generationVersion = 0
  let uploadVersion = 0
  let imageUploadVersion = 0

  const file = ref<File | null>(null)
  const pageCount = ref(0)
  const imageFile = ref<File | null>(null)

  const mode = ref<WatermarkMode>('text')
  const rangeInput = ref('')
  const text = ref(DEFAULT_TEXT)
  const fontFamily = ref<WatermarkFontFamily>('sans-serif')
  const fontSize = ref(48)
  const color = ref('#000000')
  const opacity = ref(18)
  const rotation = ref(-35)
  const position = ref<WatermarkPosition>('center')
  const offsetX = ref(0)
  const offsetY = ref(0)
  const imageScale = ref(28)

  const isLoadingDocument = ref(false)
  const isGenerating = ref(false)

  const fileErrorCode = ref('')
  const imageErrorCode = ref('')
  const rangeErrorCode = ref('')
  const generateErrorCode = ref('')

  const resultBlob = ref<Blob | null>(null)
  const resultFilename = ref('')

  const resultUrl = useObjectUrl(resultBlob)

  const hasResult = computed(() => Boolean(resultBlob.value && resultFilename.value))
  const outputFileName = computed(() => {
    if (!file.value) {
      return `${DEFAULT_FILE_NAME}.pdf`
    }

    return getOutputFileName(file.value.name)
  })

  const hasTextContent = computed(() => text.value.trim().length > 0)
  const hasImageContent = computed(() => Boolean(imageFile.value && !imageErrorCode.value))
  const hasWatermarkContent = computed(() =>
    mode.value === 'image' ? hasImageContent.value : hasTextContent.value,
  )

  const canGenerate = computed(() => {
    if (!file.value || isLoadingDocument.value || isGenerating.value) {
      return false
    }

    if (rangeErrorCode.value) {
      return false
    }

    return hasWatermarkContent.value
  })

  const clearResult = (): void => {
    resultBlob.value = null
    resultFilename.value = ''
  }

  const clearGenerateState = (): void => {
    generateErrorCode.value = ''
    clearResult()
  }

  const invalidatePendingGeneration = (): void => {
    generationVersion += 1
    isGenerating.value = false
  }

  const validateRangeInput = (): ActionResult => {
    if (!file.value || pageCount.value < 1) {
      rangeErrorCode.value = ''
      return { success: true }
    }

    try {
      parsePageSelection(rangeInput.value, pageCount.value)
      rangeErrorCode.value = ''
      return { success: true }
    } catch (error) {
      const code = error instanceof Error ? error.message : PAGE_RANGE_ERROR.InvalidToken
      rangeErrorCode.value = code
      return { success: false, errorCode: code }
    }
  }

  const setRangeInput = (value: string): ActionResult => {
    rangeInput.value = value
    clearGenerateState()
    return validateRangeInput()
  }

  const setMode = (value: WatermarkMode): void => {
    mode.value = value
    generateErrorCode.value = ''
    clearResult()
  }

  const setText = (value: string): void => {
    text.value = value
    clearGenerateState()
  }

  const setTextPreset = (value: string): void => {
    text.value = value
    clearGenerateState()
  }

  const setFontFamily = (value: WatermarkFontFamily): void => {
    fontFamily.value = value
    clearGenerateState()
  }

  const setFontSize = (value: number | null): void => {
    fontSize.value = sanitizeInteger(value ?? Number.NaN, 48, 8, 240)
    clearGenerateState()
  }

  const setColor = (value: string): void => {
    color.value = value || '#000000'
    clearGenerateState()
  }

  const setOpacity = (value: number | null): void => {
    opacity.value = sanitizeInteger(value ?? Number.NaN, 18, 0, 100)
    clearGenerateState()
  }

  const setRotation = (value: number | null): void => {
    rotation.value = normalizeRotation(value ?? Number.NaN, -35)
    clearGenerateState()
  }

  const setPosition = (value: WatermarkPosition): void => {
    position.value = value
    clearGenerateState()
  }

  const setOffsetX = (value: number | null): void => {
    offsetX.value = sanitizeInteger(value ?? Number.NaN, 0, -2000, 2000)
    clearGenerateState()
  }

  const setOffsetY = (value: number | null): void => {
    offsetY.value = sanitizeInteger(value ?? Number.NaN, 0, -2000, 2000)
    clearGenerateState()
  }

  const setImageScale = (value: number | null): void => {
    imageScale.value = sanitizeInteger(value ?? Number.NaN, 28, 5, 100)
    clearGenerateState()
  }

  const clearFile = (): void => {
    invalidatePendingGeneration()
    imageUploadVersion += 1
    file.value = null
    pageCount.value = 0
    rangeInput.value = ''
    fileErrorCode.value = ''
    imageErrorCode.value = ''
    rangeErrorCode.value = ''
    clearGenerateState()
  }

  const clearImage = (): void => {
    imageUploadVersion += 1
    imageFile.value = null
    imageErrorCode.value = ''
    clearGenerateState()
  }

  const handleUpload = async (nextFile: File): Promise<ActionResult> => {
    invalidatePendingGeneration()
    const currentUploadVersion = uploadVersion + 1
    uploadVersion = currentUploadVersion
    fileErrorCode.value = ''

    if (!isPdfFile(nextFile)) {
      isLoadingDocument.value = false
      fileErrorCode.value = PDF_ERROR.Invalid
      return { success: false, errorCode: PDF_ERROR.Invalid }
    }

    isLoadingDocument.value = true

    try {
      const inspection = await inspectPdf(nextFile)
      if (currentUploadVersion !== uploadVersion) {
        return { success: false }
      }

      clearGenerateState()
      file.value = nextFile
      pageCount.value = inspection.pageCount
      rangeInput.value = ''
      imageErrorCode.value = ''
      rangeErrorCode.value = ''
      return { success: true }
    } catch (error) {
      if (currentUploadVersion !== uploadVersion) {
        return { success: false }
      }

      const code = error instanceof Error ? error.message : PDF_ERROR.Invalid
      fileErrorCode.value = code
      return { success: false, errorCode: code }
    } finally {
      if (currentUploadVersion === uploadVersion) {
        isLoadingDocument.value = false
      }
    }
  }

  const handleImageUpload = async (nextFile: File): Promise<ActionResult> => {
    const currentImageUploadVersion = imageUploadVersion + 1
    imageUploadVersion = currentImageUploadVersion
    imageErrorCode.value = ''

    if (!isSupportedWatermarkImageFile(nextFile)) {
      imageErrorCode.value = PDF_ERROR.InvalidImage
      return { success: false, errorCode: PDF_ERROR.InvalidImage }
    }

    try {
      const normalizedFile = await normalizeWatermarkImageFile(nextFile)

      if (currentImageUploadVersion !== imageUploadVersion) {
        return { success: false }
      }

      imageFile.value = normalizedFile
      clearGenerateState()
      return { success: true }
    } catch {
      if (currentImageUploadVersion !== imageUploadVersion) {
        return { success: false }
      }

      imageErrorCode.value = PDF_ERROR.InvalidImage
      return { success: false, errorCode: PDF_ERROR.InvalidImage }
    }
  }

  const generate = async (): Promise<ActionResult> => {
    if (!file.value) {
      return { success: false, errorCode: PDF_ERROR.Invalid }
    }

    const rangeResult = validateRangeInput()
    if (!rangeResult.success) {
      return rangeResult
    }

    if (!hasWatermarkContent.value) {
      return {
        success: false,
        errorCode: mode.value === 'image' ? PDF_ERROR.InvalidImage : PDF_ERROR.ApplyFailed,
      }
    }

    const currentGenerationVersion = generationVersion + 1
    generationVersion = currentGenerationVersion
    clearGenerateState()
    isGenerating.value = true

    try {
      const selectedPages = parsePageSelection(rangeInput.value, pageCount.value)
      const response = await applyWatermarkWithWorker({
        file: file.value,
        pages: selectedPages,
        mode: mode.value,
        text: text.value,
        fontFamily: fontFamily.value,
        fontSize: fontSize.value,
        color: color.value,
        opacity: opacity.value,
        rotation: rotation.value,
        position: position.value,
        offsetX: offsetX.value,
        offsetY: offsetY.value,
        imageFile: imageFile.value,
        imageScale: imageScale.value,
        outputFileName: outputFileName.value,
      })

      if (currentGenerationVersion !== generationVersion) {
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
      if (currentGenerationVersion !== generationVersion) {
        return { success: false }
      }

      const code = error instanceof Error ? error.message : PDF_ERROR.ApplyFailed
      generateErrorCode.value = code
      return { success: false, errorCode: code }
    } finally {
      if (currentGenerationVersion === generationVersion) {
        isGenerating.value = false
      }
    }
  }

  return {
    file,
    pageCount,
    imageFile,
    mode,
    rangeInput,
    text,
    fontFamily,
    fontSize,
    color,
    opacity,
    rotation,
    position,
    offsetX,
    offsetY,
    imageScale,
    isLoadingDocument,
    isGenerating,
    fileErrorCode,
    imageErrorCode,
    rangeErrorCode,
    generateErrorCode,
    resultFilename,
    resultUrl,
    canGenerate,
    hasResult,
    hasTextContent,
    hasImageContent,
    setMode,
    setRangeInput,
    setText,
    setTextPreset,
    setFontFamily,
    setFontSize,
    setColor,
    setOpacity,
    setRotation,
    setPosition,
    setOffsetX,
    setOffsetY,
    setImageScale,
    clearFile,
    clearImage,
    handleUpload,
    handleImageUpload,
    generate,
  }
}
