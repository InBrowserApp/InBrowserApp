type ImageToWebpOptions = Readonly<{
  quality: number
  scale: number
}>

type ImageToWebpResult = Readonly<{
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

const DEFAULT_WEBP_OPTIONS = {
  quality: 82,
  scale: 100,
} as const satisfies ImageToWebpOptions

const MIN_WEBP_QUALITY = 1
const MAX_WEBP_QUALITY = 100
const MIN_WEBP_SCALE = 10
const MAX_WEBP_SCALE = 400
const DEFAULT_WEBP_NAME = "image.webp"
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

function normalizeWebpOptions(
  options: Partial<ImageToWebpOptions>
): ImageToWebpOptions {
  return {
    quality: clampRounded(
      options.quality ?? DEFAULT_WEBP_OPTIONS.quality,
      DEFAULT_WEBP_OPTIONS.quality,
      MIN_WEBP_QUALITY,
      MAX_WEBP_QUALITY
    ),
    scale: clampRounded(
      options.scale ?? DEFAULT_WEBP_OPTIONS.scale,
      DEFAULT_WEBP_OPTIONS.scale,
      MIN_WEBP_SCALE,
      MAX_WEBP_SCALE
    ),
  }
}

function isSupportedInputImage(file: SupportedImageLike) {
  if (file.type.startsWith("image/")) {
    return true
  }

  const extension = file.name.split(".").pop()?.toLowerCase()

  return extension ? IMAGE_FILE_EXTENSIONS.has(extension) : false
}

function resolveWebpOutputName(fileName: string) {
  const normalizedName = fileName.replace(/[/\\]+/g, "_").trim()

  if (!normalizedName) {
    return DEFAULT_WEBP_NAME
  }

  const dotIndex = normalizedName.lastIndexOf(".")
  const baseName =
    dotIndex > 0 ? normalizedName.slice(0, dotIndex) : normalizedName

  return `${baseName}.webp`
}

function resolveUniqueWebpOutputName(
  fileName: string,
  nameCounts: Map<string, number>
) {
  const outputName = resolveWebpOutputName(fileName)
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

  const normalized = normalizeWebpOptions({ scale })
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

async function renderWebpBlob(
  source: LoadedImageSource,
  options: ImageToWebpOptions
) {
  const dimensions = calculateResizeDimensions(
    source.width,
    source.height,
    options.scale
  )
  const canvas = document.createElement("canvas")
  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.drawImage(source.image, 0, 0, dimensions.width, dimensions.height)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", options.quality / 100)
  })

  if (!blob || blob.type !== "image/webp") {
    throw new Error("WEBP_UNSUPPORTED")
  }

  return { blob, dimensions }
}

async function convertImageFileToWebp(
  file: File,
  options: Partial<ImageToWebpOptions>,
  outputName = resolveWebpOutputName(file.name)
): Promise<ImageToWebpResult> {
  const normalizedOptions = normalizeWebpOptions(options)
  const source = await loadImageSource(file)

  try {
    const { blob, dimensions } = await renderWebpBlob(source, normalizedOptions)

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
  DEFAULT_WEBP_NAME,
  DEFAULT_WEBP_OPTIONS,
  MAX_WEBP_QUALITY,
  MAX_WEBP_SCALE,
  MIN_WEBP_QUALITY,
  MIN_WEBP_SCALE,
  SUPPORTED_INPUT_ACCEPT,
  calculateResizeDimensions,
  convertImageFileToWebp,
  isSupportedInputImage,
  normalizeWebpOptions,
  resolveUniqueWebpOutputName,
  resolveWebpOutputName,
}
export type { ImageToWebpOptions, ImageToWebpResult }
