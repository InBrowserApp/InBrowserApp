import { computed, ref, shallowRef, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { inspectPdf } from '../inspect-pdf'
import { PDF_ERROR } from '../pdf-errors'
import type { PdfCompressionOptions } from '@utils/pdf'
import { compressPdfWithWorker } from '../compress-pdf'

export type PdfCompressionPreset = 'safe' | 'balanced' | 'max-lossless'

export const PRESET_OPTIONS: Record<
  PdfCompressionPreset,
  Omit<PdfCompressionOptions, 'linearize'>
> = {
  safe: {
    compressStreams: true,
    recompressFlate: false,
    compressionLevel: 4,
    objectStreams: 'preserve',
  },
  balanced: {
    compressStreams: true,
    recompressFlate: true,
    compressionLevel: 6,
    objectStreams: 'generate',
  },
  'max-lossless': {
    compressStreams: true,
    recompressFlate: true,
    compressionLevel: 9,
    objectStreams: 'generate',
  },
}

const DEFAULT_OUTPUT_NAME = 'compressed.pdf'

const createOptionsFromPreset = (
  preset: PdfCompressionPreset,
  linearize = false,
): PdfCompressionOptions => ({
  ...PRESET_OPTIONS[preset],
  linearize,
})

export const usePdfCompressor = () => {
  const file = shallowRef<File | null>(null)
  const pageCount = ref<number | null>(null)
  const preset = ref<PdfCompressionPreset>('balanced')
  const options = ref<PdfCompressionOptions>(createOptionsFromPreset('balanced'))
  const resultBlob = shallowRef<Blob | null>(null)

  const isLoadingDocument = ref(false)
  const isCompressing = ref(false)
  const fileErrorCode = ref('')
  const compressionErrorCode = ref('')
  const resultUrl = useObjectUrl(resultBlob)

  watch(preset, (value) => {
    const { linearize } = options.value
    options.value = createOptionsFromPreset(value, linearize)
  })

  watch(
    options,
    () => {
      resultBlob.value = null
      if (compressionErrorCode.value) {
        compressionErrorCode.value = ''
      }
    },
    { deep: true },
  )

  const resultFilename = computed(() => {
    const rawName = file.value?.name.trim()

    if (!rawName) {
      return DEFAULT_OUTPUT_NAME
    }

    const baseName = rawName.replace(/\.pdf$/i, '') || 'compressed'

    return `${baseName}-compressed.pdf`
  })

  const canCompress = computed(
    () =>
      Boolean(file.value) &&
      !isLoadingDocument.value &&
      !isCompressing.value &&
      !fileErrorCode.value,
  )
  const hasResult = computed(() => Boolean(resultBlob.value))
  const noReduction = computed(() =>
    Boolean(file.value && resultBlob.value && resultBlob.value.size >= file.value.size),
  )

  const resetResult = () => {
    resultBlob.value = null
    compressionErrorCode.value = ''
  }

  const clearFile = () => {
    file.value = null
    pageCount.value = null
    fileErrorCode.value = ''
    isLoadingDocument.value = false
    resetResult()
  }

  const handleUpload = async (nextFile: File): Promise<void> => {
    clearFile()
    isLoadingDocument.value = true

    try {
      const result = await inspectPdf(nextFile)
      file.value = nextFile
      pageCount.value = result.pageCount
    } catch (error) {
      fileErrorCode.value = error instanceof Error ? error.message : PDF_ERROR.Invalid
    } finally {
      isLoadingDocument.value = false
    }
  }

  const compress = async (): Promise<{ success: boolean; errorCode?: string }> => {
    const nextFile = file.value

    if (!nextFile || !canCompress.value) {
      return { success: false }
    }

    compressionErrorCode.value = ''
    isCompressing.value = true
    resultBlob.value = null

    try {
      const nextOptions: PdfCompressionOptions = {
        ...options.value,
      }

      resultBlob.value = await compressPdfWithWorker(nextFile, nextOptions)

      return { success: true }
    } catch (error) {
      const nextErrorCode =
        error instanceof Error && error.message === PDF_ERROR.WorkerUnsupported
          ? PDF_ERROR.WorkerUnsupported
          : PDF_ERROR.CompressionFailed
      compressionErrorCode.value = nextErrorCode

      return {
        success: false,
        errorCode: nextErrorCode,
      }
    } finally {
      isCompressing.value = false
    }
  }

  return {
    file,
    pageCount,
    preset,
    options,
    resultBlob,
    isLoadingDocument,
    isCompressing,
    fileErrorCode,
    compressionErrorCode,
    resultUrl,
    resultFilename,
    canCompress,
    hasResult,
    noReduction,
    handleUpload,
    clearFile,
    compress,
  }
}
