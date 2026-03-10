import { computed, ref, watch, type Ref } from 'vue'
import { convertImageToAvif } from '../utils/convert-image-to-avif'
import { createAvifZip } from '../utils/create-avif-zip'
import type { AvifConversionOptions, AvifConversionResult, AvifSubsample, AvifTune } from '../types'

type Notify = {
  success: (message: string) => void
  error: (message: string) => void
}

type AvifConversionMessages = {
  convertSuccess: () => string
  convertFailed: () => string
  partialFailed: (count: number) => string
  zipFailed: () => string
  invalidImage: () => string
  canvasUnavailable: () => string
}

type UseAvifConversionOptions = {
  files: Ref<File[]>
  scale: Ref<number>
  quality: Ref<number>
  speed: Ref<number>
  lossless: Ref<boolean>
  advancedEnabled: Ref<boolean>
  alphaQuality: Ref<number | null>
  denoiseLevel: Ref<number | null>
  sharpness: Ref<number | null>
  subsample: Ref<AvifSubsample | null>
  tune: Ref<AvifTune | null>
  enableSharpYuv: Ref<boolean>
  messages: AvifConversionMessages
  message: Notify
}

export function useAvifConversion(options: UseAvifConversionOptions) {
  const results = ref<AvifConversionResult[]>([])
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
      options.speed,
      options.lossless,
      options.advancedEnabled,
      options.alphaQuality,
      options.denoiseLevel,
      options.sharpness,
      options.subsample,
      options.tune,
      options.enableSharpYuv,
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
    const nextResults: AvifConversionResult[] = []
    const errors: string[] = []
    let zipFailed = false

    try {
      for (const file of options.files.value) {
        const outputName = buildOutputName(file.name, nameCounts)

        try {
          const result = await convertImageToAvif(file, buildConversionOptions(), outputName)
          if (currentRun !== runId) return
          nextResults.push(result)
        } catch (err) {
          errors.push(resolveErrorMessage(err, options.messages))
        }
      }

      results.value = nextResults

      if (nextResults.length > 1) {
        isZipping.value = true

        try {
          const zip = await createAvifZip(nextResults)
          if (currentRun !== runId) return
          zipBlob.value = zip
        } catch {
          if (currentRun !== runId) return

          const zipError = options.messages.zipFailed()
          zipFailed = true
          error.value = zipError
          options.message.error(zipError)
        } finally {
          if (currentRun === runId) {
            isZipping.value = false
          }
        }
      }

      if (errors.length && !zipFailed) {
        const errorMessage = nextResults.length
          ? options.messages.partialFailed(errors.length)
          : errors[0]!

        error.value = errorMessage
        options.message.error(errorMessage)
        return
      }

      options.message.success(options.messages.convertSuccess())
    } finally {
      if (currentRun === runId) {
        isConverting.value = false
      }
    }
  }

  function buildConversionOptions(): AvifConversionOptions {
    const convertOptions: AvifConversionOptions = {
      scale: options.scale.value,
      quality: options.quality.value,
      speed: options.speed.value,
      lossless: options.lossless.value,
    }

    if (!options.advancedEnabled.value) return convertOptions

    if (options.alphaQuality.value !== null && Number.isFinite(options.alphaQuality.value)) {
      convertOptions.alphaQuality = options.alphaQuality.value
    }

    if (options.denoiseLevel.value !== null && Number.isFinite(options.denoiseLevel.value)) {
      convertOptions.denoiseLevel = options.denoiseLevel.value
    }

    if (options.sharpness.value !== null && Number.isFinite(options.sharpness.value)) {
      convertOptions.sharpness = options.sharpness.value
    }

    if (options.subsample.value) {
      convertOptions.subsample = options.subsample.value
    }

    if (options.tune.value) {
      convertOptions.tune = options.tune.value
    }

    if (options.enableSharpYuv.value) {
      convertOptions.enableSharpYuv = true
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

function resolveErrorMessage(err: unknown, messages: AvifConversionMessages) {
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
  const candidate = `${base}.avif`
  const currentCount = nameCounts.get(candidate) ?? 0
  nameCounts.set(candidate, currentCount + 1)

  if (currentCount === 0) return candidate
  return `${base}-${currentCount + 1}.avif`
}
