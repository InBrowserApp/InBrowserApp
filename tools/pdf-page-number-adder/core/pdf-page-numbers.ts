import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

import {
  buildPageNumberLabel,
  resolvePageNumberCoordinates,
} from "./page-number-layout"

import type { PageNumberFontFamily, PageNumberOptions } from "./types"

const PDF_MIME_TYPE = "application/pdf"
const PDF_EXTENSION = /\.pdf$/i

function isPdfFile(file: Pick<File, "name" | "type">) {
  return file.type === PDF_MIME_TYPE || PDF_EXTENSION.test(file.name)
}

function resolveStandardFont(fontFamily: PageNumberFontFamily) {
  return fontFamily === "serif"
    ? StandardFonts.TimesRoman
    : StandardFonts.Helvetica
}

function getNumberedPdfFileName(name: string) {
  const baseName = name.trim().replace(PDF_EXTENSION, "")
  return `${baseName || "numbered"}-numbered.pdf`
}

async function inspectPdfBytes(source: ArrayBuffer | Uint8Array) {
  const document = await PDFDocument.load(source)

  return {
    pageCount: document.getPageCount(),
  }
}

async function addPageNumbersToPdf(
  source: ArrayBuffer | Uint8Array,
  options: PageNumberOptions
) {
  const document = await PDFDocument.load(source)
  const pages = document.getPages()
  const font = await document.embedFont(resolveStandardFont(options.fontFamily))

  for (const [selectedPageIndex, pageNumber] of options.pages.entries()) {
    const page = pages[pageNumber - 1]!
    const label = buildPageNumberLabel(
      selectedPageIndex,
      pages.length,
      options.startNumber,
      options.format
    )
    const textWidth = font.widthOfTextAtSize(label, options.fontSize)
    const { width, height } = page.getSize()
    const coordinates = resolvePageNumberCoordinates({
      fontSize: options.fontSize,
      marginX: options.marginX,
      marginY: options.marginY,
      pageHeight: height,
      pageWidth: width,
      position: options.position,
      textWidth,
    })

    page.drawText(label, {
      ...coordinates,
      color: rgb(0, 0, 0),
      font,
      size: options.fontSize,
    })
  }

  return document.save()
}

function createPdfBlob(bytes: Uint8Array) {
  return new Blob([bytes.slice()], { type: PDF_MIME_TYPE })
}

export {
  PDF_MIME_TYPE,
  addPageNumbersToPdf,
  createPdfBlob,
  getNumberedPdfFileName,
  inspectPdfBytes,
  isPdfFile,
  resolveStandardFont,
}
