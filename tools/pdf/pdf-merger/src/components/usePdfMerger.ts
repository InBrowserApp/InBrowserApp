import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { PDF_ERROR } from '../pdf-errors'
import { inspectPdf } from '../inspect-pdf'
import { mergePdfsWithWorker } from '../merge-pdfs'
import type { PdfQueueItem } from './PDFMergeQueue.vue'

type MergeItem = {
  id: string
  file: File
  name: string
  size: number
  pageCount: number | null
  isLoading: boolean
  errorCode: string | null
  previewUrl: string
}

type ReorderPayload = {
  oldIndex: number | null
  newIndex: number | null
}

const createQueueID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const formatSize = (size: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let currentValue = size
  let unitIndex = 0

  while (currentValue >= 1024 && unitIndex < units.length - 1) {
    currentValue /= 1024
    unitIndex += 1
  }

  return `${currentValue.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const releasePreviewUrl = (item: MergeItem): void => {
  URL.revokeObjectURL(item.previewUrl)
}

export const usePdfMerger = () => {
  const items = ref<MergeItem[]>([])
  const previewItemId = ref<string | null>(null)
  const outputName = ref('merged.pdf')
  const isMerging = ref(false)
  const mergeErrorCode = ref('')
  const mergedBlob = ref<Blob | null>(null)
  const downloadUrl = useObjectUrl(mergedBlob)

  const downloadFilename = computed(() => {
    const normalized = outputName.value.trim()

    if (!normalized) {
      return 'merged.pdf'
    }

    if (normalized.toLowerCase().endsWith('.pdf')) {
      return normalized
    }

    return `${normalized}.pdf`
  })

  const totalPages = computed(() =>
    items.value.reduce((total, item) => total + (item.pageCount ?? 0), 0),
  )

  const canMerge = computed(() => {
    if (isMerging.value || items.value.length < 2) {
      return false
    }

    return items.value.every((item) => !item.isLoading && !item.errorCode)
  })

  const currentPreviewItem = computed(
    () => items.value.find((item) => item.id === previewItemId.value) ?? null,
  )

  const queueItems = computed<PdfQueueItem[]>(() =>
    items.value.map((item) => ({
      id: item.id,
      name: item.name,
      sizeLabel: formatSize(item.size),
      pageCount: item.pageCount,
      isLoading: item.isLoading,
      errorCode: item.errorCode,
    })),
  )

  const updateItem = (itemID: string, updater: (item: MergeItem) => MergeItem): void => {
    items.value = items.value.map((item) => {
      if (item.id !== itemID) {
        return item
      }

      return updater(item)
    })
  }

  const reorder = (from: number, to: number): void => {
    if (
      from === to ||
      from < 0 ||
      to < 0 ||
      from >= items.value.length ||
      to >= items.value.length
    ) {
      return
    }

    const nextItems = [...items.value]
    const [movingItem] = nextItems.splice(from, 1)

    if (!movingItem) {
      return
    }

    nextItems.splice(to, 0, movingItem)
    items.value = nextItems
  }

  const handleAddFile = (file: File): void => {
    mergeErrorCode.value = ''
    mergedBlob.value = null

    const itemID = createQueueID()
    const newItem: MergeItem = {
      id: itemID,
      file,
      name: file.name,
      size: file.size,
      pageCount: null,
      isLoading: true,
      errorCode: null,
      previewUrl: URL.createObjectURL(file),
    }

    items.value = [...items.value, newItem]

    void inspectPdf(file)
      .then((result) => {
        updateItem(itemID, (item) => ({
          ...item,
          pageCount: result.pageCount,
          isLoading: false,
          errorCode: null,
        }))
      })
      .catch((error: unknown) => {
        const errorCode = error instanceof Error ? error.message : PDF_ERROR.Invalid

        updateItem(itemID, (item) => ({
          ...item,
          pageCount: null,
          isLoading: false,
          errorCode,
        }))
      })
  }

  const handleReorder = ({ oldIndex, newIndex }: ReorderPayload): void => {
    if (oldIndex === null || newIndex === null) {
      return
    }

    reorder(oldIndex, newIndex)
  }

  const handleMoveUp = (index: number): void => {
    reorder(index, index - 1)
  }

  const handleMoveDown = (index: number): void => {
    reorder(index, index + 1)
  }

  const handlePreview = (index: number): void => {
    const selected = items.value[index]
    previewItemId.value = selected?.id ?? null
  }

  const handlePreviewVisible = (visible: boolean): void => {
    if (!visible) {
      previewItemId.value = null
    }
  }

  const handleRemove = (index: number): void => {
    const target = items.value[index]
    if (!target) {
      return
    }

    releasePreviewUrl(target)

    if (previewItemId.value === target.id) {
      previewItemId.value = null
    }

    items.value = items.value.filter((item) => item.id !== target.id)
    mergedBlob.value = null
    mergeErrorCode.value = ''
  }

  const handleClearAll = (): void => {
    for (const item of items.value) {
      releasePreviewUrl(item)
    }

    items.value = []
    previewItemId.value = null
    mergedBlob.value = null
    mergeErrorCode.value = ''
  }

  const handleMerge = async (): Promise<{ success: boolean; errorCode?: string }> => {
    if (!canMerge.value) {
      return { success: false }
    }

    mergeErrorCode.value = ''
    isMerging.value = true

    try {
      const files = items.value.map((item) => item.file)
      mergedBlob.value = await mergePdfsWithWorker(files)
      return { success: true }
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : PDF_ERROR.MergeFailed
      mergeErrorCode.value = errorCode
      return {
        success: false,
        errorCode,
      }
    } finally {
      isMerging.value = false
    }
  }

  onBeforeUnmount(() => {
    for (const item of items.value) {
      releasePreviewUrl(item)
    }
  })

  return {
    items,
    previewItemId,
    outputName,
    isMerging,
    mergeErrorCode,
    mergedBlob,
    downloadUrl,
    downloadFilename,
    totalPages,
    canMerge,
    currentPreviewItem,
    queueItems,
    handleAddFile,
    handleReorder,
    handleMoveUp,
    handleMoveDown,
    handlePreview,
    handlePreviewVisible,
    handleRemove,
    handleClearAll,
    handleMerge,
  }
}
