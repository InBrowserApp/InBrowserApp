import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import type {
  AddFileResult,
  ConverterOptions,
  GenerateErrorCode,
  ImageQueueItem,
  PdfGenerationProgress,
  PreviewLayout,
  Rotation,
} from '../types'
import { getFileSignature, readImageDimensions } from '../utils/image-file'
import { createImageToPdf, normalizeOutputFileName } from '../utils/image-to-pdf'
import { getImagePlacement, mmToPt, resolvePageDimensions } from '../utils/page-layout'

type GenerateResult = { success: true } | { success: false; code: GenerateErrorCode }

const defaultOptions: ConverterOptions = {
  outputName: 'images',
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
  const selectedItemId = ref<string | null>(null)
  const isAddingFile = ref(false)
  const isGenerating = ref(false)
  const generationProgress = ref<PdfGenerationProgress | null>(null)
  const resultBlob = ref<Blob | null>(null)
  const resultFilename = computed(() => normalizeOutputFileName(options.value.outputName))
  const resultUrl = useObjectUrl(resultBlob)
  const totalInputSize = computed(() => items.value.reduce((sum, item) => sum + item.size, 0))
  const selectedItem = computed(() => {
    if (!items.value.length) {
      return null
    }

    return items.value.find((item) => item.id === selectedItemId.value) ?? items.value[0] ?? null
  })
  const previewLayout = computed<PreviewLayout | null>(() => {
    const item = selectedItem.value

    if (!item) {
      return null
    }

    const rotatedDimensions = getRotatedDimensions(item.width, item.height, item.rotation)
    const page = resolvePageDimensions(
      options.value.pageSize,
      options.value.pageOrientation,
      rotatedDimensions.width,
      rotatedDimensions.height,
    )

    return {
      page,
      placement: getImagePlacement({
        page,
        imageWidth: rotatedDimensions.width,
        imageHeight: rotatedDimensions.height,
        marginPt: mmToPt(options.value.marginMm),
        fitMode: options.value.fitMode,
      }),
    }
  })
  const canGenerate = computed(() => items.value.length > 0 && !isGenerating.value)
  const hasResult = computed(() => resultBlob.value !== null && Boolean(resultUrl.value))

  watch(
    options,
    () => {
      resultBlob.value = null
    },
    { deep: true },
  )

  watch(
    items,
    () => {
      resultBlob.value = null
    },
    { deep: true },
  )

  async function addFile(file: File): Promise<AddFileResult> {
    const existingItem = items.value.find(
      (item) => getFileSignature(item.file) === getFileSignature(file),
    )

    if (existingItem) {
      return 'duplicate'
    }

    isAddingFile.value = true

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
      selectedItemId.value = item.id
      return 'added'
    } catch {
      return 'invalid-image'
    } finally {
      isAddingFile.value = false
    }
  }

  function selectItem(id: string) {
    selectedItemId.value = id
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

    if (selectedItemId.value === id) {
      selectedItemId.value = items.value[0]?.id ?? null
    }
  }

  function clearAll() {
    for (const item of items.value) {
      URL.revokeObjectURL(item.previewUrl)
    }

    items.value = []
    selectedItemId.value = null
    generationProgress.value = null
    resultBlob.value = null
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
    }
  }

  onBeforeUnmount(() => {
    clearAll()
  })

  return {
    items,
    options,
    selectedItemId,
    selectedItem,
    previewLayout,
    isAddingFile,
    isGenerating,
    generationProgress,
    resultBlob,
    resultFilename,
    resultUrl,
    totalInputSize,
    canGenerate,
    hasResult,
    addFile,
    selectItem,
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

function getRotatedDimensions(width: number, height: number, rotation: Rotation) {
  if (rotation === 90 || rotation === 270) {
    return {
      width: height,
      height: width,
    }
  }

  return {
    width,
    height,
  }
}
