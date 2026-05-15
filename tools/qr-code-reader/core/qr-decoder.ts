import jsQR from "jsqr"

type QRDecodeResult = Readonly<{
  data: string
  height: number
  width: number
}>

const SUPPORTED_IMAGE_ACCEPT = "image/*"
const QR_DECODER_ERRORS = {
  canvasReadFailed: "QR_CANVAS_READ_FAILED",
  contextUnavailable: "QR_CANVAS_CONTEXT_UNAVAILABLE",
  imageLoadFailed: "QR_IMAGE_LOAD_FAILED",
  invalidFileType: "QR_INVALID_FILE_TYPE",
} as const

function isSupportedImageFile(file: File) {
  return file.type.startsWith("image/")
}

function createDecoderError(code: string) {
  return new Error(code)
}

function getCanvasContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true })

  if (!context) {
    throw createDecoderError(QR_DECODER_ERRORS.contextUnavailable)
  }

  return context
}

function decodeImageData(imageData: ImageData): QRDecodeResult | null {
  const code = jsQR(imageData.data, imageData.width, imageData.height)

  if (!code?.data) {
    return null
  }

  return {
    data: code.data,
    height: imageData.height,
    width: imageData.width,
  }
}

function readImageData(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  source: CanvasImageSource,
  width: number,
  height: number
) {
  canvas.width = width
  canvas.height = height
  context.drawImage(source, 0, 0, width, height)

  try {
    return context.getImageData(0, 0, width, height)
  } catch {
    throw createDecoderError(QR_DECODER_ERRORS.canvasReadFailed)
  }
}

async function loadImageFromFile(file: File) {
  const image = new Image()
  const url = URL.createObjectURL(file)

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () =>
        reject(createDecoderError(QR_DECODER_ERRORS.imageLoadFailed))
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }

  return image
}

async function decodeQrFromImageFile(
  file: File
): Promise<QRDecodeResult | null> {
  if (!isSupportedImageFile(file)) {
    throw createDecoderError(QR_DECODER_ERRORS.invalidFileType)
  }

  const image = await loadImageFromFile(file)
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height

  if (!width || !height) {
    throw createDecoderError(QR_DECODER_ERRORS.imageLoadFailed)
  }

  const canvas = document.createElement("canvas")
  const context = getCanvasContext(canvas)
  const imageData = readImageData(canvas, context, image, width, height)

  return decodeImageData(imageData)
}

function decodeQrFromVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): QRDecodeResult | null {
  const width = video.videoWidth
  const height = video.videoHeight

  if (!width || !height) {
    return null
  }

  const context = getCanvasContext(canvas)
  const imageData = readImageData(canvas, context, video, width, height)

  return decodeImageData(imageData)
}

export {
  QR_DECODER_ERRORS,
  SUPPORTED_IMAGE_ACCEPT,
  decodeQrFromImageFile,
  decodeQrFromVideoFrame,
  isSupportedImageFile,
}
