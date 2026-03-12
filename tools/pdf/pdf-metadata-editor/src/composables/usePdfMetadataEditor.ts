import { computed, reactive, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import {
  readPdfMetadata,
  PDF_METADATA_FIELD_KEYS,
  writePdfMetadata,
  type PdfMetadataFieldKey,
  type PdfMetadataInfo,
  type PdfMetadataUpdates,
} from '../utils/pdfMetadata'

export type MetadataTextFieldKey = Exclude<PdfMetadataFieldKey, 'creationDate' | 'modificationDate'>

export type MetadataDateFieldKey = Extract<PdfMetadataFieldKey, 'creationDate' | 'modificationDate'>

export type MetadataFieldsState = {
  title: string
  author: string
  subject: string
  keywords: string
  creator: string
  producer: string
  creationDate: number | null
  modificationDate: number | null
}

export type MetadataFieldChange = {
  key: PdfMetadataFieldKey
  action: 'set' | 'clear'
}

const TEXT_FIELD_KEYS: MetadataTextFieldKey[] = [
  'title',
  'author',
  'subject',
  'keywords',
  'creator',
  'producer',
]

const DATE_FIELD_KEYS: MetadataDateFieldKey[] = ['creationDate', 'modificationDate']
const DEFAULT_FILE_NAME = 'metadata'

const normalizeText = (value: string): string => value.trim()

const normalizeTimestamp = (value: number | null): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const getFileBaseName = (filename: string): string =>
  filename.trim().replace(/\.pdf$/i, '') || DEFAULT_FILE_NAME

const getOriginalTextValue = (info: PdfMetadataInfo | null, key: MetadataTextFieldKey): string => {
  const value = info?.metadata[key]
  return typeof value === 'string' ? value : ''
}

const getOriginalDateValue = (
  info: PdfMetadataInfo | null,
  key: MetadataDateFieldKey,
): number | null => {
  const value = info?.metadata[key]

  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return null
  }

  return value.getTime()
}

const buildEmptyFields = (): MetadataFieldsState => ({
  title: '',
  author: '',
  subject: '',
  keywords: '',
  creator: '',
  producer: '',
  creationDate: null,
  modificationDate: null,
})

const syncFieldsFromInfo = (fields: MetadataFieldsState, info: PdfMetadataInfo | null): void => {
  for (const key of TEXT_FIELD_KEYS) {
    fields[key] = getOriginalTextValue(info, key)
  }

  for (const key of DATE_FIELD_KEYS) {
    fields[key] = getOriginalDateValue(info, key)
  }
}

const buildTextUpdate = (
  fields: MetadataFieldsState,
  info: PdfMetadataInfo | null,
  key: MetadataTextFieldKey,
): PdfMetadataUpdates[MetadataTextFieldKey] => {
  const nextValue = normalizeText(fields[key])
  const originalValue = normalizeText(getOriginalTextValue(info, key))

  if (nextValue === originalValue) {
    return { mode: 'preserve' }
  }

  if (!nextValue) {
    return { mode: 'clear' }
  }

  return {
    mode: 'set',
    value: nextValue,
  }
}

const buildDateUpdate = (
  fields: MetadataFieldsState,
  info: PdfMetadataInfo | null,
  key: MetadataDateFieldKey,
): PdfMetadataUpdates[MetadataDateFieldKey] => {
  const nextValue = normalizeTimestamp(fields[key])
  const originalValue = getOriginalDateValue(info, key)

  if (nextValue === originalValue) {
    return { mode: 'preserve' }
  }

  if (nextValue === null) {
    return { mode: 'clear' }
  }

  return {
    mode: 'set',
    value: new Date(nextValue),
  }
}

const buildUpdates = (
  fields: MetadataFieldsState,
  info: PdfMetadataInfo | null,
): PdfMetadataUpdates => ({
  title: buildTextUpdate(fields, info, 'title'),
  author: buildTextUpdate(fields, info, 'author'),
  subject: buildTextUpdate(fields, info, 'subject'),
  keywords: buildTextUpdate(fields, info, 'keywords'),
  creator: buildTextUpdate(fields, info, 'creator'),
  producer: buildTextUpdate(fields, info, 'producer'),
  creationDate: buildDateUpdate(fields, info, 'creationDate'),
  modificationDate: buildDateUpdate(fields, info, 'modificationDate'),
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

  const setTextFieldValue = (key: MetadataTextFieldKey, value: string): void => {
    fields[key] = value
    clearResult()
    errorMessage.value = ''
  }

  const setDateFieldValue = (key: MetadataDateFieldKey, value: number | null): void => {
    fields[key] = normalizeTimestamp(value)
    clearResult()
    errorMessage.value = ''
  }

  const restoreField = (key: PdfMetadataFieldKey): void => {
    if (DATE_FIELD_KEYS.includes(key as MetadataDateFieldKey)) {
      fields[key as MetadataDateFieldKey] = getOriginalDateValue(
        info.value,
        key as MetadataDateFieldKey,
      )
    } else {
      fields[key as MetadataTextFieldKey] = getOriginalTextValue(
        info.value,
        key as MetadataTextFieldKey,
      )
    }

    clearResult()
    errorMessage.value = ''
  }

  const clearAllFields = (): void => {
    for (const key of TEXT_FIELD_KEYS) {
      fields[key] = ''
    }

    for (const key of DATE_FIELD_KEYS) {
      fields[key] = null
    }

    clearResult()
    errorMessage.value = ''
  }

  const changeSummary = computed<MetadataFieldChange[]>(() => {
    const updates = buildUpdates(fields, info.value)

    return PDF_METADATA_FIELD_KEYS.flatMap((key) => {
      const update = updates[key]

      if (update.mode === 'preserve') {
        return []
      }

      return [{ key, action: update.mode }]
    })
  })

  const hasChanges = computed(() => changeSummary.value.length > 0)

  const canGenerate = computed(
    () =>
      Boolean(file.value) &&
      Boolean(info.value) &&
      !info.value?.document.encrypted &&
      !isLoading.value &&
      !isSaving.value &&
      hasChanges.value,
  )

  const generate = async (): Promise<void> => {
    if (!file.value || !canGenerate.value) {
      return
    }

    isSaving.value = true
    errorMessage.value = ''

    try {
      const blob = await writePdfMetadata(file.value, buildUpdates(fields, info.value))
      resultBlob.value = blob
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
    isLoading,
    isSaving,
    errorMessage,
    fields,
    changeSummary,
    hasChanges,
    canGenerate,
    resultFilename,
    resultUrl,
    handleUpload,
    clearFile,
    setTextFieldValue,
    setDateFieldValue,
    restoreField,
    clearAllFields,
    generate,
  }
}
