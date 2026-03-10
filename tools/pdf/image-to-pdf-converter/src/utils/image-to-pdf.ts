import { PDFDocument } from 'pdf-lib'
import type {
  ConverterOptions,
  ImageQueueItem,
  PdfGenerationProgress,
  QualityPreset,
} from '../types'
import { mmToPt, getImagePlacement, resolvePageDimensions } from './page-layout'
import { renderImageToJpeg } from './image-file'

export async function createImageToPdf({
  items,
  options,
  onProgress,
}: {
  items: ImageQueueItem[]
  options: ConverterOptions
  onProgress?: (progress: PdfGenerationProgress) => void
}) {
  const pdfDocument = await PDFDocument.create()
  const marginPt = mmToPt(options.marginMm)
  const quality = getJpegQuality(options.qualityPreset)

  for (const [index, item] of items.entries()) {
    const renderedImage = await renderImageToJpeg(item.file, {
      rotation: item.rotation,
      quality,
    })
    const page = resolvePageDimensions(
      options.pageSize,
      options.pageOrientation,
      renderedImage.width,
      renderedImage.height,
    )
    const placement = getImagePlacement({
      page,
      imageWidth: renderedImage.width,
      imageHeight: renderedImage.height,
      marginPt,
      fitMode: options.fitMode,
    })
    const embeddedImage = await pdfDocument.embedJpg(renderedImage.bytes)
    const pdfPage = pdfDocument.addPage([page.width, page.height])

    pdfPage.drawImage(embeddedImage, placement)
    onProgress?.({
      completed: index + 1,
      total: items.length,
    })
  }

  const bytes = await pdfDocument.save()
  const pdfBytes = new Uint8Array(bytes.byteLength)
  pdfBytes.set(bytes)

  return new Blob([pdfBytes], { type: 'application/pdf' })
}

export function normalizeOutputFileName(name: string) {
  const sanitizedBaseName = name
    .trim()
    .replace(/\.pdf$/i, '')
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()

  return `${sanitizedBaseName || 'images'}.pdf`
}

export function getJpegQuality(qualityPreset: QualityPreset) {
  if (qualityPreset === 'best') {
    return 0.92
  }

  if (qualityPreset === 'small') {
    return 0.68
  }

  return 0.82
}
