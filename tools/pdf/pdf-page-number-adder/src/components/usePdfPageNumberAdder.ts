import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { addPageNumbersWithWorker } from '../add-page-numbers'
import { inspectPdf, isPdfFile } from '../inspect-pdf'
import { PDF_ERROR } from '../pdf-errors'
import { PAGE_RANGE_ERROR, parsePageSelection } from '../utils/page-range'
import type { PageNumberFontFamily, PageNumberFormat, PageNumberPosition } from '../types'

type ActionResult = {
  success: boolean
  errorCode?: string
}

const DEFAULT_FILE_NAME = 'numbered'

const sanitizeNumber = (value: number, fallback: number, min = 0): number => {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.max(min, Math.trunc(value))
}

const getFileBaseName = (filename: string): string => {
  const trimmed = filename.trim()
  if (!trimmed) {
    return DEFAULT_FILE_NAME
  }

  return trimmed.replace(/\.pdf$/i, '') || DEFAULT_FILE_NAME
}

export const usePdfPageNumberAdder = () => {
  const file = ref<File | null>(null)
  const pageCount = ref(0)

  const rangeInput = ref('')
  const startNumber = ref(1)
  const format = ref<PageNumberFormat>('n')
  const fontFamily = ref<PageNumberFontFamily>('sans-serif')
  const position = ref<PageNumberPosition>('bottom-center')
  const fontSize = ref(12)
  const marginX = ref(24)
  const marginY = ref(24)

  const isLoadingDocument = ref(false)
  const isGenerating = ref(false)

  const fileErrorCode = ref('')
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

    return `${getFileBaseName(file.value.name)}-numbered.pdf`
  })

  const canGenerate = computed(() => {
    if (!file.value || isLoadingDocument.value || isGenerating.value) {
      return false
    }

    if (startNumber.value < 1 || fontSize.value < 1 || marginX.value < 0 || marginY.value < 0) {
      return false
    }

    return !rangeErrorCode.value
  })

  const clearResult = (): void => {
    resultBlob.value = null
    resultFilename.value = ''
  }

  const clearErrors = (): void => {
    fileErrorCode.value = ''
    rangeErrorCode.value = ''
    generateErrorCode.value = ''
  }

  const reset = (): void => {
    file.value = null
    pageCount.value = 0
    rangeInput.value = ''
    startNumber.value = 1
    format.value = 'n'
    fontFamily.value = 'sans-serif'
    position.value = 'bottom-center'
    fontSize.value = 12
    marginX.value = 24
    marginY.value = 24
    isLoadingDocument.value = false
    isGenerating.value = false
    clearErrors()
    clearResult()
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
    clearResult()
    return validateRangeInput()
  }

  const setStartNumber = (value: number | null): void => {
    startNumber.value = sanitizeNumber(value ?? Number.NaN, 1, 1)
    clearResult()
  }

  const setFontSize = (value: number | null): void => {
    fontSize.value = sanitizeNumber(value ?? Number.NaN, 12, 1)
    clearResult()
  }

  const setMarginX = (value: number | null): void => {
    marginX.value = sanitizeNumber(value ?? Number.NaN, 24, 0)
    clearResult()
  }

  const setMarginY = (value: number | null): void => {
    marginY.value = sanitizeNumber(value ?? Number.NaN, 24, 0)
    clearResult()
  }

  const setFormat = (value: PageNumberFormat): void => {
    format.value = value
    clearResult()
  }

  const setPosition = (value: PageNumberPosition): void => {
    position.value = value
    clearResult()
  }

  const setFontFamily = (value: PageNumberFontFamily): void => {
    fontFamily.value = value
    clearResult()
  }

  const clearFile = (): void => {
    reset()
  }

  const handleUpload = async (nextFile: File): Promise<ActionResult> => {
    clearErrors()
    clearResult()

    if (!isPdfFile(nextFile)) {
      fileErrorCode.value = PDF_ERROR.Invalid
      return { success: false, errorCode: PDF_ERROR.Invalid }
    }

    isLoadingDocument.value = true

    try {
      const inspection = await inspectPdf(nextFile)
      file.value = nextFile
      pageCount.value = inspection.pageCount
      rangeInput.value = ''
      return { success: true }
    } catch (error) {
      file.value = null
      pageCount.value = 0
      const code = error instanceof Error ? error.message : PDF_ERROR.Invalid
      fileErrorCode.value = code
      return { success: false, errorCode: code }
    } finally {
      isLoadingDocument.value = false
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

    generateErrorCode.value = ''
    isGenerating.value = true

    try {
      const selectedPages = parsePageSelection(rangeInput.value, pageCount.value)

      const response = await addPageNumbersWithWorker({
        file: file.value,
        pages: selectedPages,
        startNumber: startNumber.value,
        format: format.value,
        fontFamily: fontFamily.value,
        position: position.value,
        fontSize: fontSize.value,
        marginX: marginX.value,
        marginY: marginY.value,
        outputFileName: outputFileName.value,
      })

      if (!response.ok) {
        generateErrorCode.value = response.code
        return { success: false, errorCode: response.code }
      }

      resultBlob.value = response.result.file.blob
      resultFilename.value = response.result.file.name

      return { success: true }
    } catch (error) {
      const code = error instanceof Error ? error.message : PDF_ERROR.AddFailed
      generateErrorCode.value = code
      return { success: false, errorCode: code }
    } finally {
      isGenerating.value = false
    }
  }

  return {
    file,
    pageCount,
    rangeInput,
    startNumber,
    format,
    fontFamily,
    position,
    fontSize,
    marginX,
    marginY,
    isLoadingDocument,
    isGenerating,
    fileErrorCode,
    rangeErrorCode,
    generateErrorCode,
    resultFilename,
    resultUrl,
    canGenerate,
    hasResult,
    setRangeInput,
    setStartNumber,
    setFormat,
    setFontFamily,
    setPosition,
    setFontSize,
    setMarginX,
    setMarginY,
    clearFile,
    handleUpload,
    generate,
  }
}
