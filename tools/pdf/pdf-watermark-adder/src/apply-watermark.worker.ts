import { PDFDocument, degrees, rgb } from 'pdf-lib'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'
import type {
  ApplyWatermarkPayload,
  ApplyWatermarkWorkerError,
  ApplyWatermarkWorkerSuccess,
  WatermarkImageFormat,
} from './types'
import {
  calculateLineHeight,
  calculateTextBlockHeight,
  normalizeRotation,
  resolveWatermarkPlacement,
  rotatePoint,
} from './utils/watermark-layout'
import { isSupportedWatermarkImageFile, normalizeTextLines } from './utils/watermark-content'
import { resolveStandardFont } from './utils/watermark-font'

const withPdfExtension = (name: string): string => {
  const trimmed = name.trim()

  if (!trimmed) {
    return 'watermarked.pdf'
  }

  if (trimmed.toLowerCase().endsWith('.pdf')) {
    return trimmed
  }

  return `${trimmed}.pdf`
}

const normalizeOpacity = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0.18
  }

  return Math.min(Math.max(value / 100, 0), 1)
}

const normalizeHexColor = (value: string): string => {
  const normalized = value.trim()
  const shortMatch = normalized.match(/^#([0-9a-f]{3})$/i)
  if (shortMatch) {
    const [red = '0', green = '0', blue = '0'] = (shortMatch[1] ?? '').split('')
    return `#${red}${red}${green}${green}${blue}${blue}`.toUpperCase()
  }

  const fullMatch = normalized.match(/^#([0-9a-f]{6})$/i)
  if (fullMatch) {
    return `#${(fullMatch[1] ?? '000000').toUpperCase()}`
  }

  return '#000000'
}

const hexToRgb = (value: string) => {
  const normalized = normalizeHexColor(value)
  const red = Number.parseInt(normalized.slice(1, 3), 16) / 255
  const green = Number.parseInt(normalized.slice(3, 5), 16) / 255
  const blue = Number.parseInt(normalized.slice(5, 7), 16) / 255

  return rgb(red, green, blue)
}

const resolveImageFormat = (file: File | null): WatermarkImageFormat | null => {
  if (!file) {
    return null
  }

  if (!isSupportedWatermarkImageFile(file)) {
    return null
  }

  if (file.type.toLowerCase() === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
    return 'png'
  }

  return 'jpg'
}

const applyTextWatermark = async (
  document: PDFDocument,
  payload: ApplyWatermarkPayload,
): Promise<void> => {
  const fontSize = Math.max(1, Math.trunc(payload.fontSize))
  const rotation = normalizeRotation(payload.rotation)
  const font = await document.embedFont(resolveStandardFont(payload.fontFamily))
  const opacity = normalizeOpacity(payload.opacity)
  const lines = normalizeTextLines(payload.text)
  const lineHeight = calculateLineHeight(fontSize)
  const lineWidths = lines.map((line) => font.widthOfTextAtSize(line, fontSize))
  const boxWidth = Math.max(1, ...lineWidths)
  const boxHeight = calculateTextBlockHeight(lines.length, fontSize, lineHeight)
  const color = hexToRgb(payload.color)

  for (const pageNumber of payload.pages) {
    const page = document.getPage(pageNumber - 1)
    if (!page) {
      continue
    }

    const { width, height } = page.getSize()
    const placement = resolveWatermarkPlacement({
      pageWidth: width,
      pageHeight: height,
      boxWidth,
      boxHeight,
      position: payload.position,
      offsetX: payload.offsetX,
      offsetY: payload.offsetY,
      rotation,
    })

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? ''
      const lineWidth = lineWidths[index] ?? 0
      const localX = (boxWidth - lineWidth) / 2
      const localY = boxHeight - fontSize - index * lineHeight
      const point = rotatePoint(localX, localY, rotation)

      page.drawText(line, {
        x: placement.originX + point.x,
        y: placement.originY + point.y,
        size: fontSize,
        font,
        color,
        opacity,
        rotate: degrees(rotation),
      })
    }
  }
}

const applyImageWatermark = async (
  document: PDFDocument,
  payload: ApplyWatermarkPayload,
): Promise<void> => {
  const imageFormat = resolveImageFormat(payload.imageFile)
  if (!payload.imageFile || !imageFormat) {
    throw new Error(PDF_ERROR.InvalidImage)
  }

  const imageBytes = await payload.imageFile.arrayBuffer()
  const embeddedImage =
    imageFormat === 'png'
      ? await document.embedPng(imageBytes)
      : await document.embedJpg(imageBytes)

  const rotation = normalizeRotation(payload.rotation)
  const opacity = normalizeOpacity(payload.opacity)
  const scale = Math.min(Math.max(payload.imageScale / 100, 0.05), 1)

  for (const pageNumber of payload.pages) {
    const page = document.getPage(pageNumber - 1)
    if (!page) {
      continue
    }

    const { width, height } = page.getSize()
    const targetWidth = width * scale
    const targetHeight = targetWidth * (embeddedImage.height / embeddedImage.width)
    const placement = resolveWatermarkPlacement({
      pageWidth: width,
      pageHeight: height,
      boxWidth: targetWidth,
      boxHeight: targetHeight,
      position: payload.position,
      offsetX: payload.offsetX,
      offsetY: payload.offsetY,
      rotation,
    })

    page.drawImage(embeddedImage, {
      x: placement.originX,
      y: placement.originY,
      width: targetWidth,
      height: targetHeight,
      opacity,
      rotate: degrees(rotation),
    })
  }
}

const applyWatermark = async (
  payload: ApplyWatermarkPayload,
): Promise<ApplyWatermarkWorkerSuccess> => {
  const sourceBytes = await payload.file.arrayBuffer()
  const document = await PDFDocument.load(sourceBytes)

  if (payload.mode === 'image') {
    await applyImageWatermark(document, payload)
  } else {
    await applyTextWatermark(document, payload)
  }

  const resultBytes = await document.save()
  const blob = new Blob([resultBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })

  return {
    ok: true,
    result: {
      file: {
        name: withPdfExtension(payload.outputFileName),
        blob,
      },
    },
  }
}

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<ApplyWatermarkPayload>) => Promise<void> | void) | null
  postMessage: (payload: ApplyWatermarkWorkerSuccess | ApplyWatermarkWorkerError) => void
}

workerScope.onmessage = async (event: MessageEvent<ApplyWatermarkPayload>) => {
  try {
    const result = await applyWatermark(event.data)
    workerScope.postMessage(result)
  } catch (error) {
    const payload: ApplyWatermarkWorkerError = {
      ok: false,
      code:
        error instanceof Error && error.message === PDF_ERROR.InvalidImage
          ? PDF_ERROR.InvalidImage
          : isEncryptedPdfError(error)
            ? PDF_ERROR.Encrypted
            : PDF_ERROR.ApplyFailed,
    }

    workerScope.postMessage(payload)
  }
}
