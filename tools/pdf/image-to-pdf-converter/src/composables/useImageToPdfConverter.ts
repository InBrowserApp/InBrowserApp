import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import type {
  AddFileResult,
  ConverterOptions,
  GenerateErrorCode,
  ImageQueueItem,
  PdfGenerationProgress,
  Rotation,
} from '../types'
import { getFileSignature, readImageDimensions } from '../utils/image-file'
import { createImageToPdf, getOutputFileName } from '../utils/image-to-pdf'

type GenerateResult = { success: true } | { success: false; code: GenerateErrorCode }

const defaultOptions: ConverterOptions = {
  pageSize: 'a4',
  pageOrientation: 'auto',
  fitMode: 'contain',
  marginMm: 12,
  qualityPreset: 'balanced',
}

let fallbackIdCounter = 0

export function useImageToPdfConverter() {
  const items = ref<ImageQueueItem[]>([])
  const options = ref<ConverterOptions>({ ...defaultOptions })
  const activeAddFileCount = ref(0)
  const pendingFileSignatures = new Set<string>()
  const isAddingFile = computed(() => activeAddFileCount.value > 0)
  const isGenerating = ref(false)
  const generationProgress = ref<PdfGenerationProgress | null>(null)
  const resultBlob = ref<Blob | null>(null)
  const resultFilename = computed(() => getOutputFileName(items.value))
  const resultUrl = useObjectUrl(resultBlob)
  const canGenerate = computed(() => items.value.length > 0 && !isGenerating.value)
  const hasResult = computed(() => resultBlob.value !== null && Boolean(resultUrl.value))

  function resetGeneratedResult() {
    resultBlob.value = null
    generationProgress.value = null
  }

  watch(
    options,
    () => {
      resetGeneratedResult()
    },
    { deep: true },
  )

  watch(
    items,
    () => {
      resetGeneratedResult()
    },
    { deep: true },
  )

  async function addFile(file: File): Promise<AddFileResult> {
    const signature = getFileSignature(file)
    const existingItem = items.value.find((item) => getFileSignature(item.file) === signature)

    if (existingItem || pendingFileSignatures.has(signature)) {
      return 'duplicate'
    }

    pendingFileSignatures.add(signature)
    activeAddFileCount.value += 1

    try {
      const dimensions = await readImageDimensions(file)
      const item: ImageQueueItem = {
        id: createItemId(),
        file,
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
        width: dimensions.width,
        height: dimensions.height,
        rotation: 0,
      }

      items.value = [...items.value, item]
      return 'added'
    } catch {
      return 'invalid-image'
    } finally {
      pendingFileSignatures.delete(signature)
      activeAddFileCount.value = Math.max(0, activeAddFileCount.value - 1)
    }
  }

  function rotateItem(id: string) {
    items.value = items.value.map((item) => {
      if (item.id !== id) {
        return item
      }

      return {
        ...item,
        rotation: ((item.rotation + 90) % 360 || 0) as Rotation,
      }
    })
  }

  function removeItem(id: string) {
    const itemToRemove = items.value.find((item) => item.id === id)

    if (!itemToRemove) {
      return
    }

    URL.revokeObjectURL(itemToRemove.previewUrl)
    items.value = items.value.filter((item) => item.id !== id)
  }

  function clearAll() {
    for (const item of items.value) {
      URL.revokeObjectURL(item.previewUrl)
    }

    pendingFileSignatures.clear()
    activeAddFileCount.value = 0
    items.value = []
    resetGeneratedResult()
  }

  function moveItem(oldIndex: number, newIndex: number) {
    if (
      oldIndex < 0 ||
      newIndex < 0 ||
      oldIndex >= items.value.length ||
      newIndex >= items.value.length ||
      oldIndex === newIndex
    ) {
      return
    }

    const nextItems = [...items.value]
    const [movedItem] = nextItems.splice(oldIndex, 1)

    if (!movedItem) {
      return
    }

    nextItems.splice(newIndex, 0, movedItem)
    items.value = nextItems
  }

  function moveItemUp(index: number) {
    moveItem(index, index - 1)
  }

  function moveItemDown(index: number) {
    moveItem(index, index + 1)
  }

  async function generate(): Promise<GenerateResult> {
    if (!items.value.length) {
      return {
        success: false,
        code: 'generate-failed',
      }
    }

    isGenerating.value = true
    resultBlob.value = null
    generationProgress.value = {
      completed: 0,
      total: items.value.length,
    }

    try {
      resultBlob.value = await createImageToPdf({
        items: items.value,
        options: options.value,
        onProgress: (progress) => {
          generationProgress.value = progress
        },
      })

      return { success: true }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'INVALID_IMAGE') {
          return {
            success: false,
            code: 'invalid-image',
          }
        }

        if (error.message === 'CANVAS_UNAVAILABLE') {
          return {
            success: false,
            code: 'canvas-unavailable',
          }
        }
      }

      return {
        success: false,
        code: 'generate-failed',
      }
    } finally {
      isGenerating.value = false
      generationProgress.value = null
    }
  }

  onBeforeUnmount(() => {
    clearAll()
  })

  return {
    items,
    options,
    isAddingFile,
    isGenerating,
    generationProgress,
    resultBlob,
    resultFilename,
    resultUrl,
    canGenerate,
    hasResult,
    addFile,
    rotateItem,
    removeItem,
    clearAll,
    moveItem,
    moveItemUp,
    moveItemDown,
    generate,
  }
}

function createItemId() {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID()
  }

  fallbackIdCounter += 1
  return `image-to-pdf-${fallbackIdCounter}`
}
