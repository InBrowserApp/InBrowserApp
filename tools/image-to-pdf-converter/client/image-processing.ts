import { getJpegQuality, normalizeRotation } from "../core/options"

import type { QualityPreset, Rotation } from "../core/options"

type LoadedImageSource = Readonly<{
  close: () => void
  height: number
  source: CanvasImageSource
  width: number
}>

type LoadedHtmlImage = Readonly<{
  element: HTMLImageElement
  objectUrl: string
}>

type CanvasFactoryResult = Readonly<{
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
}>

type ImageProcessingEnvironment = Readonly<{
  createCanvas?: (width: number, height: number) => CanvasFactoryResult
  createImageBitmap?: typeof globalThis.createImageBitmap
  createObjectUrl?: (file: File) => string
  loadHtmlImage?: (file: File) => Promise<LoadedHtmlImage>
  revokeObjectUrl?: (url: string) => void
}>

type RenderedImage = Readonly<{
  height: number
  jpegBytes: Uint8Array
  width: number
}>

const SUPPORTED_IMAGE_ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif"
const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g|webp|bmp|gif|avif)$/i

function isProbablyImageFile(file: File) {
  return (
    file.type.startsWith("image/") || IMAGE_EXTENSION_PATTERN.test(file.name)
  )
}

function getFileSignature(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

async function readImageDimensions(
  file: File,
  environment?: ImageProcessingEnvironment
) {
  const loadedImage = await loadImageSource(file, environment)

  try {
    return {
      width: loadedImage.width,
      height: loadedImage.height,
    }
  } finally {
    loadedImage.close()
  }
}

async function renderImageToJpeg(
  file: File,
  {
    qualityPreset,
    rotation,
  }: {
    qualityPreset: QualityPreset
    rotation: Rotation
  },
  environment?: ImageProcessingEnvironment
): Promise<RenderedImage> {
  const normalizedRotation = normalizeRotation(rotation)
  const loadedImage = await loadImageSource(file, environment)

  try {
    const isQuarterTurn =
      normalizedRotation === 90 || normalizedRotation === 270
    const outputWidth = isQuarterTurn ? loadedImage.height : loadedImage.width
    const outputHeight = isQuarterTurn ? loadedImage.width : loadedImage.height
    const { canvas, context } = createCanvas(
      outputWidth,
      outputHeight,
      environment
    )

    if (!context) {
      throw new Error("CANVAS_UNAVAILABLE")
    }

    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, outputWidth, outputHeight)
    context.translate(outputWidth / 2, outputHeight / 2)
    context.rotate((normalizedRotation * Math.PI) / 180)
    context.drawImage(
      loadedImage.source,
      -loadedImage.width / 2,
      -loadedImage.height / 2,
      loadedImage.width,
      loadedImage.height
    )

    const jpegBlob = await canvasToBlob(canvas, getJpegQuality(qualityPreset))

    return {
      jpegBytes: new Uint8Array(await jpegBlob.arrayBuffer()),
      width: outputWidth,
      height: outputHeight,
    }
  } finally {
    loadedImage.close()
  }
}

async function loadImageSource(
  file: File,
  environment?: ImageProcessingEnvironment
): Promise<LoadedImageSource> {
  const bitmap = await createImageBitmapWithOrientation(file, environment)

  if (bitmap) {
    return {
      width: Math.max(1, bitmap.width),
      height: Math.max(1, bitmap.height),
      source: bitmap,
      close: () => {
        bitmap.close?.()
      },
    }
  }

  const image = await loadHtmlImage(file, environment)

  return {
    width: Math.max(1, image.element.naturalWidth || image.element.width || 1),
    height: Math.max(
      1,
      image.element.naturalHeight || image.element.height || 1
    ),
    source: image.element,
    close: () => {
      resolveRevokeObjectUrl(environment)(image.objectUrl)
    },
  }
}

async function createImageBitmapWithOrientation(
  file: File,
  environment?: ImageProcessingEnvironment
) {
  const createBitmap =
    environment?.createImageBitmap ?? globalThis.createImageBitmap

  if (typeof createBitmap !== "function") {
    return null
  }

  try {
    return await createBitmap(file, { imageOrientation: "from-image" })
  } catch {
    try {
      return await createBitmap(file)
    } catch {
      return null
    }
  }
}

async function loadHtmlImage(
  file: File,
  environment?: ImageProcessingEnvironment
) {
  if (environment?.loadHtmlImage) {
    return environment.loadHtmlImage(file)
  }

  if (typeof Image === "undefined") {
    throw new Error("INVALID_IMAGE")
  }

  const objectUrl = resolveCreateObjectUrl(environment)(file)

  try {
    const element = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.decoding = "async"
      image.onload = () => {
        resolve(image)
      }
      image.onerror = () => {
        reject(new Error("INVALID_IMAGE"))
      }
      image.src = objectUrl
    })

    return {
      element,
      objectUrl,
    }
  } catch (error) {
    resolveRevokeObjectUrl(environment)(objectUrl)
    throw error
  }
}

function createCanvas(
  width: number,
  height: number,
  environment?: ImageProcessingEnvironment
): CanvasFactoryResult {
  if (environment?.createCanvas) {
    return environment.createCanvas(width, height)
  }

  if (
    typeof document === "undefined" ||
    typeof document.createElement !== "function"
  ) {
    throw new Error("CANVAS_UNAVAILABLE")
  }

  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))

  return {
    canvas,
    context: canvas.getContext("2d"),
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  if (typeof canvas.toBlob !== "function") {
    throw new Error("CANVAS_EXPORT_FAILED")
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("CANVAS_EXPORT_FAILED"))
          return
        }

        resolve(blob)
      },
      "image/jpeg",
      quality
    )
  })
}

function resolveCreateObjectUrl(environment?: ImageProcessingEnvironment) {
  const createObjectUrl = environment?.createObjectUrl ?? URL.createObjectURL

  if (typeof createObjectUrl !== "function") {
    throw new Error("INVALID_IMAGE")
  }

  return createObjectUrl
}

function resolveRevokeObjectUrl(environment?: ImageProcessingEnvironment) {
  const revokeObjectUrl = environment?.revokeObjectUrl ?? URL.revokeObjectURL

  if (typeof revokeObjectUrl !== "function") {
    return () => {}
  }

  return revokeObjectUrl
}

export {
  SUPPORTED_IMAGE_ACCEPT,
  getFileSignature,
  isProbablyImageFile,
  readImageDimensions,
  renderImageToJpeg,
}
export type { ImageProcessingEnvironment, RenderedImage }
