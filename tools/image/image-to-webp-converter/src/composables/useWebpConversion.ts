import { computed, ref, watch, type Ref } from 'vue'
import { convertImageToWebp } from '../utils/convert-image-to-webp'
import { createWebpZip } from '../utils/create-webp-zip'
import type { WebpConversionOptions, WebpConversionResult } from '../types'

type TriState = 'default' | 'on' | 'off'

type Notify = {
  success: (message: string) => void
  error: (message: string) => void
}

type WebpConversionMessages = {
  convertSuccess: () => string
  convertFailed: () => string
  partialFailed: (count: number) => string
  zipFailed: () => string
  invalidImage: () => string
  canvasUnavailable: () => string
}

type UseWebpConversionOptions = {
  files: Ref<File[]>
  scale: Ref<number>
  quality: Ref<number>
  method: Ref<number>
  lossless: Ref<boolean>
  advancedEnabled: Ref<boolean>
  targetSize: Ref<number | null>
  targetPsnr: Ref<number | null>
  nearLossless: Ref<number | null>
  alphaQuality: Ref<number | null>
  snsStrength: Ref<number | null>
  filterStrength: Ref<number | null>
  filterSharpness: Ref<number | null>
  filterType: Ref<number | null>
  partitions: Ref<number | null>
  segments: Ref<number | null>
  passCount: Ref<number | null>
  exactMode: Ref<TriState>
  sharpYuvMode: Ref<TriState>
  messages: WebpConversionMessages
  message: Notify
}

export function useWebpConversion(options: UseWebpConversionOptions) {
  const results = ref<WebpConversionResult[]>([])
  const zipBlob = ref<Blob | null>(null)
  const error = ref('')
  const isConverting = ref(false)
  const isZipping = ref(false)
  let runId = 0

  const canConvert = computed(() => options.files.value.length > 0 && !isConverting.value)

  watch(
    [
      options.files,
      options.scale,
      options.quality,
      options.method,
      options.lossless,
      options.advancedEnabled,
      options.targetSize,
      options.targetPsnr,
      options.nearLossless,
      options.alphaQuality,
      options.snsStrength,
      options.filterStrength,
      options.filterSharpness,
      options.filterType,
      options.partitions,
      options.segments,
      options.passCount,
      options.exactMode,
      options.sharpYuvMode,
    ],
    () => {
      runId += 1
      results.value = []
      zipBlob.value = null
      error.value = ''
      isConverting.value = false
      isZipping.value = false
    },
  )

  async function convertImages() {
    if (!options.files.value.length || isConverting.value) return

    const currentRun = ++runId
    isConverting.value = true
    isZipping.value = false
    error.value = ''
    results.value = []
    zipBlob.value = null

    const nameCounts = new Map<string, number>()
    const nextResults: WebpConversionResult[] = []
    const errors: string[] = []

    try {
      for (const file of options.files.value) {
        const outputName = buildOutputName(file.name, nameCounts)
        try {
          const result = await convertImageToWebp(file, buildConversionOptions(), outputName)
          if (currentRun !== runId) return
          nextResults.push(result)
        } catch (err) {
          errors.push(resolveErrorMessage(err, options.messages))
        }
      }

      if (currentRun !== runId) return
      results.value = nextResults

      if (nextResults.length > 1) {
        isZipping.value = true
        try {
          const zip = await createWebpZip(nextResults)
          if (currentRun !== runId) return
          zipBlob.value = zip
        } catch {
          if (currentRun !== runId) return
          const zipError = options.messages.zipFailed()
          error.value = zipError
          options.message.error(zipError)
        } finally {
          if (currentRun === runId) {
            isZipping.value = false
          }
        }
      }

      if (errors.length) {
        const errorMessage = nextResults.length
          ? options.messages.partialFailed(errors.length)
          : (errors[0] ?? options.messages.convertFailed())
        error.value = errorMessage
        options.message.error(errorMessage)
      } else if (nextResults.length) {
        options.message.success(options.messages.convertSuccess())
      } else {
        error.value = options.messages.convertFailed()
        options.message.error(error.value)
      }
    } finally {
      if (currentRun === runId) {
        isConverting.value = false
      }
    }
  }

  function buildConversionOptions(): WebpConversionOptions {
    const convertOptions: WebpConversionOptions = {
      scale: options.scale.value,
      quality: options.quality.value,
      method: options.method.value,
      lossless: options.lossless.value,
    }

    if (!options.advancedEnabled.value) return convertOptions

    if (options.targetSize.value !== null && Number.isFinite(options.targetSize.value)) {
      convertOptions.targetSize = Math.max(0, Math.round(options.targetSize.value * 1024))
    }
    if (options.targetPsnr.value !== null && Number.isFinite(options.targetPsnr.value)) {
      convertOptions.targetPsnr = options.targetPsnr.value
    }
    if (options.nearLossless.value !== null && Number.isFinite(options.nearLossless.value)) {
      convertOptions.nearLossless = options.nearLossless.value
    }
    if (options.alphaQuality.value !== null && Number.isFinite(options.alphaQuality.value)) {
      convertOptions.alphaQuality = options.alphaQuality.value
    }
    if (options.snsStrength.value !== null && Number.isFinite(options.snsStrength.value)) {
      convertOptions.snsStrength = options.snsStrength.value
    }
    if (options.filterStrength.value !== null && Number.isFinite(options.filterStrength.value)) {
      convertOptions.filterStrength = options.filterStrength.value
    }
    if (options.filterSharpness.value !== null && Number.isFinite(options.filterSharpness.value)) {
      convertOptions.filterSharpness = options.filterSharpness.value
    }
    if (options.filterType.value !== null && Number.isFinite(options.filterType.value)) {
      convertOptions.filterType = options.filterType.value
    }
    if (options.partitions.value !== null && Number.isFinite(options.partitions.value)) {
      convertOptions.partitions = options.partitions.value
    }
    if (options.segments.value !== null && Number.isFinite(options.segments.value)) {
      convertOptions.segments = options.segments.value
    }
    if (options.passCount.value !== null && Number.isFinite(options.passCount.value)) {
      convertOptions.pass = options.passCount.value
    }
    const exactValue = resolveTriState(options.exactMode.value)
    if (exactValue !== undefined) {
      convertOptions.exact = exactValue
    }
    const sharpYuvValue = resolveTriState(options.sharpYuvMode.value)
    if (sharpYuvValue !== undefined) {
      convertOptions.useSharpYuv = sharpYuvValue
    }

    return convertOptions
  }

  return {
    results,
    zipBlob,
    error,
    isConverting,
    isZipping,
    canConvert,
    convertImages,
  }
}

function resolveTriState(value: TriState) {
  if (value === 'on') return true
  if (value === 'off') return false
  return undefined
}

function resolveErrorMessage(err: unknown, messages: WebpConversionMessages) {
  if (err instanceof Error) {
    switch (err.message) {
      case 'INVALID_IMAGE':
        return messages.invalidImage()
      case 'CANVAS_CONTEXT_UNAVAILABLE':
        return messages.canvasUnavailable()
      default:
        return messages.convertFailed()
    }
  }
  return messages.convertFailed()
}

function buildOutputName(name: string, nameCounts: Map<string, number>) {
  const base = name.replace(/\.[^/.]+$/, '') || 'image'
  const candidate = `${base}.webp`
  const currentCount = nameCounts.get(candidate) ?? 0
  nameCounts.set(candidate, currentCount + 1)

  if (currentCount === 0) return candidate
  return `${base}-${currentCount + 1}.webp`
}
