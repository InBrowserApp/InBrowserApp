import {
  PDFDocument,
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
} from "pdf-lib"

import { mmToPt, getImagePlacement, resolvePageDimensions } from "./page-layout"

import type { ConverterOptions, PdfGenerationProgress } from "./options"

type PdfImageInput = Readonly<{
  height: number
  jpegBytes: ArrayBuffer | Uint8Array
  width: number
}>

type CreateImagePdfInput = Readonly<{
  images: readonly PdfImageInput[]
  onProgress?: (progress: PdfGenerationProgress) => void
  options: ConverterOptions
}>

const PDF_MIME_TYPE = "application/pdf"

async function createImagePdf({
  images,
  options,
  onProgress,
}: CreateImagePdfInput) {
  const pdfDocument = await PDFDocument.create()
  const marginPt = mmToPt(options.marginMm)

  for (const [index, image] of images.entries()) {
    const page = resolvePageDimensions(
      options.pageSize,
      options.pageOrientation,
      image.width,
      image.height
    )
    const placement = getImagePlacement({
      page,
      imageWidth: image.width,
      imageHeight: image.height,
      marginPt,
      fitMode: options.fitMode,
    })
    const embeddedImage = await pdfDocument.embedJpg(image.jpegBytes)
    const pdfPage = pdfDocument.addPage([page.width, page.height])

    if (options.fitMode === "cover" && marginPt > 0) {
      const contentWidth = Math.max(1, page.width - marginPt * 2)
      const contentHeight = Math.max(1, page.height - marginPt * 2)

      pdfPage.pushOperators(
        pushGraphicsState(),
        rectangle(marginPt, marginPt, contentWidth, contentHeight),
        clip(),
        endPath()
      )
    }

    pdfPage.drawImage(embeddedImage, placement)

    if (options.fitMode === "cover" && marginPt > 0) {
      pdfPage.pushOperators(popGraphicsState())
    }

    onProgress?.({
      completed: index + 1,
      total: images.length,
    })
  }

  return pdfDocument.save()
}

function createPdfBlob(bytes: Uint8Array) {
  return new Blob([bytes.slice()], { type: PDF_MIME_TYPE })
}

export { PDF_MIME_TYPE, createImagePdf, createPdfBlob }
export type { PdfImageInput }
