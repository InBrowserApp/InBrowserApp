import { computed, reactive, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import {
  formatMetadataDateForInput,
  parseMetadataDateInput,
  PDF_METADATA_FIELD_KEYS,
  readPdfMetadata,
  writePdfMetadata,
  type PdfMetadataFieldKey,
  type PdfMetadataInfo,
  type PdfMetadataUpdateMode,
  type PdfMetadataUpdates,
} from '../utils/pdfMetadata'

export type MetadataFieldState = {
  mode: PdfMetadataUpdateMode
  value: string
}

export type MetadataFieldsState = Record<PdfMetadataFieldKey, MetadataFieldState>

export type MetadataFieldChange = {
  key: PdfMetadataFieldKey
  action: Exclude<PdfMetadataUpdateMode, 'preserve'>
}

const DATE_FIELD_KEYS = new Set<PdfMetadataFieldKey>(['creationDate', 'modificationDate'])
const DEFAULT_FILE_NAME = 'metadata'

const isDateField = (key: PdfMetadataFieldKey): boolean => DATE_FIELD_KEYS.has(key)

const normalizeText = (value: string): string => value.trim()

const getFileBaseName = (filename: string): string =>
  filename.trim().replace(/\.pdf$/i, '') || DEFAULT_FILE_NAME

const getOriginalFieldValue = (info: PdfMetadataInfo | null, key: PdfMetadataFieldKey): string => {
  if (!info) {
    return ''
  }

  if (isDateField(key)) {
    const value = info.metadata[key]
    return value instanceof Date ? formatMetadataDateForInput(value) : ''
  }

  const value = info.metadata[key]
  return typeof value === 'string' ? value : ''
}

const hasOriginalFieldValue = (info: PdfMetadataInfo | null, key: PdfMetadataFieldKey): boolean => {
  if (!info) {
    return false
  }

  if (isDateField(key)) {
    return info.metadata[key] instanceof Date
  }

  const value = info.metadata[key]
  return typeof value === 'string' && value.trim().length > 0
}

const buildEmptyFields = (): MetadataFieldsState => ({
  title: { mode: 'preserve', value: '' },
  author: { mode: 'preserve', value: '' },
  subject: { mode: 'preserve', value: '' },
  keywords: { mode: 'preserve', value: '' },
  creator: { mode: 'preserve', value: '' },
  producer: { mode: 'preserve', value: '' },
  creationDate: { mode: 'preserve', value: '' },
  modificationDate: { mode: 'preserve', value: '' },
})

const syncFieldsFromInfo = (fields: MetadataFieldsState, info: PdfMetadataInfo | null): void => {
  for (const key of PDF_METADATA_FIELD_KEYS) {
    fields[key].mode = 'preserve'
    fields[key].value = getOriginalFieldValue(info, key)
  }
}

const getFieldValidationError = (
  fields: MetadataFieldsState,
  key: PdfMetadataFieldKey,
): string | null => {
  const field = fields[key]

  if (field.mode !== 'set') {
    return null
  }

  if (isDateField(key)) {
    return parseMetadataDateInput(field.value) ? null : 'invalid'
  }

  return normalizeText(field.value) ? null : 'missing'
}

const hasMeaningfulChange = (
  fields: MetadataFieldsState,
  info: PdfMetadataInfo | null,
  key: PdfMetadataFieldKey,
): boolean => {
  const field = fields[key]

  if (field.mode === 'clear') {
    return hasOriginalFieldValue(info, key)
  }

  if (isDateField(key)) {
    const current = parseMetadataDateInput(field.value)
    const original = info?.metadata[key]
    if (!(original instanceof Date) && !current) {
      return false
    }
    if (!(original instanceof Date) || !current) {
      return true
    }
    return current.getTime() !== original.getTime()
  }

  const nextValue = normalizeText(field.value)
  const originalValue = normalizeText(getOriginalFieldValue(info, key))
  return nextValue !== originalValue
}

const buildUpdates = (fields: MetadataFieldsState): PdfMetadataUpdates => ({
  title: { mode: fields.title.mode, value: normalizeText(fields.title.value) },
  author: { mode: fields.author.mode, value: normalizeText(fields.author.value) },
  subject: { mode: fields.subject.mode, value: normalizeText(fields.subject.value) },
  keywords: { mode: fields.keywords.mode, value: normalizeText(fields.keywords.value) },
  creator: { mode: fields.creator.mode, value: normalizeText(fields.creator.value) },
  producer: { mode: fields.producer.mode, value: normalizeText(fields.producer.value) },
  creationDate: {
    mode: fields.creationDate.mode,
    value: parseMetadataDateInput(fields.creationDate.value),
  },
  modificationDate: {
    mode: fields.modificationDate.mode,
    value: parseMetadataDateInput(fields.modificationDate.value),
  },
})

export const usePdfMetadataEditor = () => {
  const file = ref<File | null>(null)
  const info = ref<PdfMetadataInfo | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const errorMessage = ref('')

  const resultBlob = ref<Blob | null>(null)
  const resultFilename = ref('')
  const resultUrl = useObjectUrl(resultBlob)

  const fields = reactive<MetadataFieldsState>(buildEmptyFields())

  const clearResult = (): void => {
    resultBlob.value = null
    resultFilename.value = ''
  }

  const reset = (): void => {
    file.value = null
    info.value = null
    isLoading.value = false
    isSaving.value = false
    errorMessage.value = ''
    clearResult()
    syncFieldsFromInfo(fields, null)
  }

  const handleUpload = async (nextFile: File): Promise<void> => {
    isLoading.value = true
    errorMessage.value = ''
    clearResult()

    try {
      const nextInfo = await readPdfMetadata(nextFile)
      file.value = nextFile
      info.value = nextInfo
      syncFieldsFromInfo(fields, nextInfo)
    } catch (error) {
      reset()
      errorMessage.value = error instanceof Error ? error.message : 'Failed to read PDF metadata.'
    } finally {
      isLoading.value = false
    }
  }

  const clearFile = (): void => {
    reset()
  }

  const setFieldMode = (key: PdfMetadataFieldKey, mode: PdfMetadataUpdateMode): void => {
    fields[key].mode = mode
    clearResult()
    errorMessage.value = ''
  }

  const setFieldValue = (key: PdfMetadataFieldKey, value: string): void => {
    fields[key].value = value
    clearResult()
    errorMessage.value = ''
  }

  const restoreField = (key: PdfMetadataFieldKey): void => {
    fields[key].mode = 'preserve'
    fields[key].value = getOriginalFieldValue(info.value, key)
    clearResult()
    errorMessage.value = ''
  }

  const clearAllFields = (): void => {
    for (const key of PDF_METADATA_FIELD_KEYS) {
      fields[key].mode = 'clear'
    }
    clearResult()
    errorMessage.value = ''
  }

  const validationFieldKeys = computed<PdfMetadataFieldKey[]>(() =>
    PDF_METADATA_FIELD_KEYS.filter((key) => Boolean(getFieldValidationError(fields, key))),
  )

  const changeSummary = computed<MetadataFieldChange[]>(() =>
    PDF_METADATA_FIELD_KEYS.flatMap((key) => {
      const field = fields[key]
      if (field.mode === 'preserve') {
        return []
      }

      if (!hasMeaningfulChange(fields, info.value, key)) {
        return []
      }

      return [{ key, action: field.mode }]
    }),
  )

  const hasChanges = computed(() => changeSummary.value.length > 0)

  const canGenerate = computed(
    () =>
      Boolean(file.value) &&
      Boolean(info.value) &&
      !info.value?.document.encrypted &&
      !isLoading.value &&
      !isSaving.value &&
      hasChanges.value &&
      validationFieldKeys.value.length === 0,
  )

  const generate = async (): Promise<void> => {
    if (!file.value || !canGenerate.value) {
      return
    }

    isSaving.value = true
    errorMessage.value = ''

    try {
      resultBlob.value = await writePdfMetadata(file.value, buildUpdates(fields))
      resultFilename.value = `${getFileBaseName(file.value.name)}-metadata.pdf`
    } catch (error) {
      clearResult()
      errorMessage.value = error instanceof Error ? error.message : 'Failed to save PDF metadata.'
    } finally {
      isSaving.value = false
    }
  }

  return {
    file,
    info,
    fields,
    isLoading,
    isSaving,
    errorMessage,
    validationFieldKeys,
    changeSummary,
    hasChanges,
    canGenerate,
    resultFilename,
    resultUrl,
    handleUpload,
    clearFile,
    setFieldMode,
    setFieldValue,
    restoreField,
    clearAllFields,
    generate,
  }
}
