type ResizeAlgorithm = "high-quality" | "balanced" | "pixelated"
type ResizeOutputFormat = "auto" | "png" | "jpeg" | "webp"

type ImageDimensions = Readonly<{
  width: number
  height: number
}>

type ResizeOptions = Readonly<{
  width: number
  height: number
  keepAspectRatio: boolean
  allowUpscale: boolean
  algorithm: ResizeAlgorithm
  outputFormat: ResizeOutputFormat
  quality: number
}>

type ResizeResult = Readonly<{
  blob: Blob
  outputWidth: number
  outputHeight: number
  mimeType: string
  outputName: string
}>

type LoadedImageSource = Readonly<{
  image: CanvasImageSource
  width: number
  height: number
  cleanup?: () => void
}>

function clampDimension(value: number) {
  return Math.max(1, Math.round(value || 1))
}

function resolveOutputMimeType(
  fileType: string,
  format: ResizeOutputFormat
): "image/png" | "image/jpeg" | "image/webp" {
  if (format === "png") {
    return "image/png"
  }

  if (format === "jpeg") {
    return "image/jpeg"
  }

  if (format === "webp") {
    return "image/webp"
  }

  if (
    fileType === "image/jpeg" ||
    fileType === "image/png" ||
    fileType === "image/webp"
  ) {
    return fileType
  }

  return "image/png"
}

function replaceFileExtension(
  fileName: string,
  mimeType: ResizeResult["mimeType"]
) {
  const extension =
    mimeType === "image/jpeg"
      ? "jpg"
      : mimeType === "image/webp"
        ? "webp"
        : "png"
  const baseName = fileName.includes(".")
    ? fileName.slice(0, fileName.lastIndexOf("."))
    : fileName || "image"

  return `${baseName}.${extension}`
}

function calculateOutputDimensions(
  source: ImageDimensions,
  options: ResizeOptions
): ImageDimensions {
  const requestedWidth = clampDimension(options.width)
  const requestedHeight = clampDimension(options.height)

  if (!options.keepAspectRatio) {
    return {
      width: options.allowUpscale
        ? requestedWidth
        : Math.min(requestedWidth, source.width),
      height: options.allowUpscale
        ? requestedHeight
        : Math.min(requestedHeight, source.height),
    }
  }

  const ratio = source.width / source.height
  let nextWidth = requestedWidth
  let nextHeight = Math.round(requestedWidth / ratio)

  if (nextHeight > requestedHeight) {
    nextHeight = requestedHeight
    nextWidth = Math.round(requestedHeight * ratio)
  }

  if (!options.allowUpscale) {
    nextWidth = Math.min(nextWidth, source.width)
    nextHeight = Math.min(nextHeight, source.height)
  }

  return {
    width: clampDimension(nextWidth),
    height: clampDimension(nextHeight),
  }
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: ResizeResult["mimeType"],
  quality: number
) {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality)
  })

  if (!blob) {
    throw new Error("FAILED_TO_CREATE_IMAGE")
  }

  return blob
}

async function loadImageSource(file: File): Promise<LoadedImageSource> {
  if ("createImageBitmap" in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)

      return {
        image: bitmap,
        width: clampDimension(bitmap.width),
        height: clampDimension(bitmap.height),
        cleanup: () => {
          bitmap.close()
        },
      }
    } catch {
      // fall through to HTMLImageElement
    }
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error("INVALID_IMAGE"))
      element.src = objectUrl
    })

    return {
      image,
      width: clampDimension(image.naturalWidth || image.width),
      height: clampDimension(image.naturalHeight || image.height),
      cleanup: () => {
        URL.revokeObjectURL(objectUrl)
      },
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

async function readImageDimensions(file: File) {
  const source = await loadImageSource(file)

  try {
    return {
      width: source.width,
      height: source.height,
    }
  } finally {
    source.cleanup?.()
  }
}

async function resizeImageFile(
  file: File,
  options: ResizeOptions
): Promise<ResizeResult> {
  const source = await loadImageSource(file)

  try {
    const outputDimensions = calculateOutputDimensions(
      {
        width: source.width,
        height: source.height,
      },
      options
    )
    const canvas = document.createElement("canvas")
    canvas.width = outputDimensions.width
    canvas.height = outputDimensions.height

    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
    }

    if (options.algorithm === "pixelated") {
      context.imageSmoothingEnabled = false
    } else {
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality =
        options.algorithm === "high-quality" ? "high" : "medium"
    }

    const mimeType = resolveOutputMimeType(file.type, options.outputFormat)

    if (mimeType === "image/jpeg") {
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    context.drawImage(source.image, 0, 0, canvas.width, canvas.height)

    const blob = await canvasToBlob(
      canvas,
      mimeType,
      Math.max(0.1, Math.min(1, options.quality / 100))
    )

    return {
      blob,
      mimeType,
      outputHeight: canvas.height,
      outputName: replaceFileExtension(file.name, mimeType),
      outputWidth: canvas.width,
    }
  } finally {
    source.cleanup?.()
  }
}

export { calculateOutputDimensions, readImageDimensions, resizeImageFile }
export type {
  ImageDimensions,
  ResizeAlgorithm,
  ResizeOptions,
  ResizeOutputFormat,
  ResizeResult,
}
