type IcoFrame = Readonly<{
  png: Uint8Array
  size: number
}>

type ImageToIcoOptions = Readonly<{
  backgroundColor: string
  backgroundEnabled: boolean
  sizes: readonly number[]
}>

type SupportedImageLike = Readonly<{
  name: string
  type: string
}>

const MAX_ICO_SIZE = 256
const DEFAULT_ICON_NAME = "icon.ico"
const SIZE_OPTIONS = [16, 24, 32, 48, 64, 128, 256] as const
const IMAGE_FILE_EXTENSIONS = new Set([
  "avif",
  "bmp",
  "gif",
  "ico",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "tif",
  "tiff",
  "webp",
])

function normalizeIcoSizes(sizes: readonly number[]) {
  const uniqueSizes = new Set<number>()

  for (const size of sizes) {
    if (!Number.isFinite(size)) {
      continue
    }

    const roundedSize = Math.round(size)

    if (roundedSize < 1 || roundedSize > MAX_ICO_SIZE) {
      continue
    }

    uniqueSizes.add(roundedSize)
  }

  return Array.from(uniqueSizes).sort((left, right) => right - left)
}

function isSupportedInputImage(file: SupportedImageLike) {
  if (file.type.startsWith("image/")) {
    return true
  }

  const extension = file.name.split(".").pop()?.toLowerCase()

  return extension ? IMAGE_FILE_EXTENSIONS.has(extension) : false
}

function resolveIcoOutputName(fileName: string) {
  if (!fileName) {
    return DEFAULT_ICON_NAME
  }

  const dotIndex = fileName.lastIndexOf(".")
  const baseName = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName

  return `${baseName || "icon"}.ico`
}

function buildIcoBinary(frames: readonly IcoFrame[]) {
  if (frames.length === 0) {
    throw new Error("NO_SIZES_SELECTED")
  }

  const totalImageBytes = frames.reduce(
    (total, frame) => total + frame.png.byteLength,
    0
  )
  const headerBytes = 6 + frames.length * 16
  const output = new Uint8Array(headerBytes + totalImageBytes)
  const view = new DataView(output.buffer)

  view.setUint16(0, 0, true)
  view.setUint16(2, 1, true)
  view.setUint16(4, frames.length, true)

  let nextOffset = headerBytes

  frames.forEach((frame, index) => {
    if (frame.size < 1 || frame.size > MAX_ICO_SIZE) {
      throw new Error("INVALID_SIZE")
    }

    const entryOffset = 6 + index * 16
    output[entryOffset] = frame.size === MAX_ICO_SIZE ? 0 : frame.size
    output[entryOffset + 1] = frame.size === MAX_ICO_SIZE ? 0 : frame.size
    output[entryOffset + 2] = 0
    output[entryOffset + 3] = 0

    view.setUint16(entryOffset + 4, 1, true)
    view.setUint16(entryOffset + 6, 32, true)
    view.setUint32(entryOffset + 8, frame.png.byteLength, true)
    view.setUint32(entryOffset + 12, nextOffset, true)

    output.set(frame.png, nextOffset)
    nextOffset += frame.png.byteLength
  })

  return output
}

/* v8 ignore start -- browser-only image decoding and canvas rendering */
type LoadedImageSource = Readonly<{
  image: CanvasImageSource
  width: number
  height: number
  cleanup?: () => void
}>

async function canvasToPngBytes(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png")
  })

  if (!blob) {
    throw new Error("FAILED_TO_CREATE_IMAGE")
  }

  return new Uint8Array(await blob.arrayBuffer())
}

async function loadImageSource(file: File): Promise<LoadedImageSource> {
  if ("createImageBitmap" in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)

      if (!bitmap.width || !bitmap.height) {
        bitmap.close()
        throw new Error("INVALID_IMAGE")
      }

      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => {
          bitmap.close()
        },
      }
    } catch {
      // Fall back to HTMLImageElement for formats not handled by createImageBitmap.
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
      image,
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
      cleanup: () => {
        URL.revokeObjectURL(objectUrl)
      },
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

async function renderPngFrame(
  source: LoadedImageSource,
  size: number,
  options: ImageToIcoOptions
) {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  if (!source.width || !source.height) {
    throw new Error("INVALID_IMAGE")
  }

  if (options.backgroundEnabled) {
    context.fillStyle = options.backgroundColor
    context.fillRect(0, 0, size, size)
  }

  const scale = size / Math.max(source.width, source.height)
  const outputWidth = Math.max(1, Math.round(source.width * scale))
  const outputHeight = Math.max(1, Math.round(source.height * scale))
  const x = Math.round((size - outputWidth) / 2)
  const y = Math.round((size - outputHeight) / 2)

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.drawImage(source.image, x, y, outputWidth, outputHeight)

  return canvasToPngBytes(canvas)
}

async function convertImageFileToIco(
  file: File,
  options: ImageToIcoOptions
): Promise<Blob> {
  const normalizedSizes = normalizeIcoSizes(options.sizes)

  if (normalizedSizes.length === 0) {
    throw new Error("NO_SIZES_SELECTED")
  }

  const source = await loadImageSource(file)

  try {
    const frames = await Promise.all(
      normalizedSizes.map(async (size) => ({
        png: await renderPngFrame(source, size, options),
        size,
      }))
    )

    return new Blob([buildIcoBinary(frames)], { type: "image/x-icon" })
  } finally {
    source.cleanup?.()
  }
}
/* v8 ignore end */

export {
  DEFAULT_ICON_NAME,
  SIZE_OPTIONS,
  buildIcoBinary,
  convertImageFileToIco,
  isSupportedInputImage,
  normalizeIcoSizes,
  resolveIcoOutputName,
}
export type { ImageToIcoOptions }
