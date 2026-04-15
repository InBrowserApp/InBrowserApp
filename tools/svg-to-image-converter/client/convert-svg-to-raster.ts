import {
  buildSvgDataUrl,
  getOutputMimeType,
  normalizeBackgroundColor,
  normalizeQuality,
  resolveOutputSize,
  shouldFillBackground,
  shouldShowQuality,
} from "../core/svg-conversion"

import type { OutputFormat } from "../core/svg-conversion"

type ConvertSvgMessages = Readonly<{
  convertFailedError: string
  imageLoadFailedError: string
  noCanvasError: string
}>

type ConvertSvgOptions = Readonly<{
  backgroundColor: string
  format: OutputFormat
  height: number
  quality: number
  svgText: string
  useBackground: boolean
  width: number
}>

/* v8 ignore start -- browser canvas and image APIs */
function loadSvgImage(svgText: string, imageLoadFailedError: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject(new Error(imageLoadFailedError))
    }
    image.src = buildSvgDataUrl(svgText)
  })
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number | undefined,
  convertFailedError: string
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(convertFailedError))
          return
        }

        resolve(blob)
      },
      type,
      quality
    )
  })
}

async function convertSvgToRasterBlob(
  options: ConvertSvgOptions,
  messages: ConvertSvgMessages
) {
  const normalizedSize = resolveOutputSize(null, options.width, options.height)
  const image = await loadSvgImage(
    options.svgText,
    messages.imageLoadFailedError
  )
  const canvas = document.createElement("canvas")

  canvas.width = normalizedSize.width
  canvas.height = normalizedSize.height

  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error(messages.noCanvasError)
  }

  if (shouldFillBackground(options.format, options.useBackground)) {
    context.fillStyle = normalizeBackgroundColor(
      options.backgroundColor,
      options.format
    )
    context.fillRect(0, 0, normalizedSize.width, normalizedSize.height)
  }

  context.drawImage(image, 0, 0, normalizedSize.width, normalizedSize.height)

  return canvasToBlob(
    canvas,
    getOutputMimeType(options.format),
    shouldShowQuality(options.format)
      ? normalizeQuality(options.quality) / 100
      : undefined,
    messages.convertFailedError
  )
}
/* v8 ignore end */

export { convertSvgToRasterBlob }
