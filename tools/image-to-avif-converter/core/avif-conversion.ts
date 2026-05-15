import { encodeAvifWithWorker } from "../workers/avif-worker-client"

import type { AvifEncodeOptions } from "../workers/avif-worker-types"

type ImageToAvifOptions = Readonly<{
  lossless: boolean
  quality: number
  scale: number
  speed: number
}>

type ImageToAvifResult = Readonly<{
  blob: Blob
  file: File
  originalHeight: number
  originalWidth: number
  outputHeight: number
  outputName: string
  outputWidth: number
}>

type SupportedImageLike = Readonly<{
  name: string
  type: string
}>

type LoadedImageSource = Readonly<{
  cleanup?: () => void
  height: number
  image: CanvasImageSource
  width: number
}>

const DEFAULT_AVIF_OPTIONS = {
  lossless: false,
  quality: 75,
  scale: 100,
  speed: 6,
} as const satisfies ImageToAvifOptions

const MIN_AVIF_QUALITY = 0
const MAX_AVIF_QUALITY = 100
const MIN_AVIF_SCALE = 10
const MAX_AVIF_SCALE = 400
const MIN_AVIF_SPEED = 0
const MAX_AVIF_SPEED = 10
const DEFAULT_AVIF_NAME = "image.avif"
const SUPPORTED_INPUT_ACCEPT = "image/*"
const IMAGE_FILE_EXTENSIONS = new Set([
  "avif",
  "bmp",
  "gif",
  "heic",
  "heif",
  "ico",
  "jfif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "svgz",
  "tif",
  "tiff",
  "webp",
])

function clampRounded(
  value: number,
  fallback: number,
  minimum: number,
  maximum: number
) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.min(maximum, Math.max(minimum, Math.round(value)))
}

function normalizeAvifOptions(
  options: Partial<ImageToAvifOptions>
): ImageToAvifOptions {
  return {
    lossless: options.lossless ?? DEFAULT_AVIF_OPTIONS.lossless,
    quality: clampRounded(
      options.quality ?? DEFAULT_AVIF_OPTIONS.quality,
      DEFAULT_AVIF_OPTIONS.quality,
      MIN_AVIF_QUALITY,
      MAX_AVIF_QUALITY
    ),
    scale: clampRounded(
      options.scale ?? DEFAULT_AVIF_OPTIONS.scale,
      DEFAULT_AVIF_OPTIONS.scale,
      MIN_AVIF_SCALE,
      MAX_AVIF_SCALE
    ),
    speed: clampRounded(
      options.speed ?? DEFAULT_AVIF_OPTIONS.speed,
      DEFAULT_AVIF_OPTIONS.speed,
      MIN_AVIF_SPEED,
      MAX_AVIF_SPEED
    ),
  }
}

function buildAvifEncodeOptions(
  options: Partial<ImageToAvifOptions>
): AvifEncodeOptions {
  const normalizedOptions = normalizeAvifOptions(options)

  return {
    bitDepth: 8,
    lossless: normalizedOptions.lossless,
    quality: normalizedOptions.quality,
    speed: normalizedOptions.speed,
  }
}

function isSupportedInputImage(file: SupportedImageLike) {
  if (file.type.startsWith("image/")) {
    return true
  }

  const extension = file.name.split(".").pop()?.toLowerCase()

  return extension ? IMAGE_FILE_EXTENSIONS.has(extension) : false
}

function resolveAvifOutputName(fileName: string) {
  const normalizedName = fileName.replace(/[/\\]+/g, "_").trim()

  if (!normalizedName) {
    return DEFAULT_AVIF_NAME
  }

  const dotIndex = normalizedName.lastIndexOf(".")
  const baseName =
    dotIndex > 0 ? normalizedName.slice(0, dotIndex) : normalizedName

  return `${baseName}.avif`
}

function resolveUniqueAvifOutputName(
  fileName: string,
  nameCounts: Map<string, number>
) {
  const outputName = resolveAvifOutputName(fileName)
  const extensionIndex = outputName.lastIndexOf(".")
  const baseName = outputName.slice(0, extensionIndex)
  const extension = outputName.slice(extensionIndex)
  const currentCount = nameCounts.get(outputName) ?? 0

  nameCounts.set(outputName, currentCount + 1)

  if (currentCount === 0) {
    return outputName
  }

  return `${baseName}-${currentCount + 1}${extension}`
}

function calculateResizeDimensions(
  width: number,
  height: number,
  scale: number
) {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1
  ) {
    throw new Error("INVALID_IMAGE")
  }

  const normalized = normalizeAvifOptions({ scale })
  const ratio = normalized.scale / 100

  return {
    height: Math.max(1, Math.round(height * ratio)),
    width: Math.max(1, Math.round(width * ratio)),
  }
}

/* v8 ignore start -- browser-only image decoding and canvas rendering */
async function loadImageSource(file: File): Promise<LoadedImageSource> {
  if ("createImageBitmap" in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)

      if (!bitmap.width || !bitmap.height) {
        bitmap.close()
        throw new Error("INVALID_IMAGE")
      }

      return {
        cleanup: () => {
          bitmap.close()
        },
        height: bitmap.height,
        image: bitmap,
        width: bitmap.width,
      }
    } catch {
      // Fall back to HTMLImageElement for formats not handled by ImageBitmap.
    }
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()

      element.onload = () => {
        if (!element.naturalWidth || !element.naturalHeight) {
          reject(new Error("INVALID_IMAGE"))
          return
        }

        resolve(element)
      }
      element.onerror = () => {
        reject(new Error("INVALID_IMAGE"))
      }
      element.src = objectUrl
    })

    return {
      cleanup: () => {
        URL.revokeObjectURL(objectUrl)
      },
      height: image.naturalHeight || image.height,
      image,
      width: image.naturalWidth || image.width,
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

async function renderAvifBlob(
  source: LoadedImageSource,
  options: ImageToAvifOptions
) {
  const dimensions = calculateResizeDimensions(
    source.width,
    source.height,
    options.scale
  )
  const canvas = document.createElement("canvas")
  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const context = canvas.getContext("2d", { willReadFrequently: true })

  if (!context) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.drawImage(source.image, 0, 0, dimensions.width, dimensions.height)

  const imageData = context.getImageData(
    0,
    0,
    dimensions.width,
    dimensions.height
  )
  const pixels = imageData.data.slice().buffer as ArrayBuffer
  const encoded = await encodeAvifWithWorker({
    height: imageData.height,
    options: buildAvifEncodeOptions(options),
    pixels,
    width: imageData.width,
  })
  const blob = new Blob([encoded], { type: "image/avif" })

  if (!blob.size) {
    throw new Error("ENCODE_FAILED")
  }

  return { blob, dimensions }
}

async function convertImageFileToAvif(
  file: File,
  options: Partial<ImageToAvifOptions>,
  outputName = resolveAvifOutputName(file.name)
): Promise<ImageToAvifResult> {
  const normalizedOptions = normalizeAvifOptions(options)
  const source = await loadImageSource(file)

  try {
    const { blob, dimensions } = await renderAvifBlob(source, normalizedOptions)

    return {
      blob,
      file,
      originalHeight: source.height,
      originalWidth: source.width,
      outputHeight: dimensions.height,
      outputName,
      outputWidth: dimensions.width,
    }
  } finally {
    source.cleanup?.()
  }
}
/* v8 ignore end */

export {
  DEFAULT_AVIF_NAME,
  DEFAULT_AVIF_OPTIONS,
  MAX_AVIF_QUALITY,
  MAX_AVIF_SCALE,
  MAX_AVIF_SPEED,
  MIN_AVIF_QUALITY,
  MIN_AVIF_SCALE,
  MIN_AVIF_SPEED,
  SUPPORTED_INPUT_ACCEPT,
  buildAvifEncodeOptions,
  calculateResizeDimensions,
  convertImageFileToAvif,
  isSupportedInputImage,
  normalizeAvifOptions,
  resolveUniqueAvifOutputName,
  resolveAvifOutputName,
}
export type { ImageToAvifOptions, ImageToAvifResult }
