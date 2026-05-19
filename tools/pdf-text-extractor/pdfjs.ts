import "./pdfjs-worker-url"

import { getDocument, GlobalWorkerOptions, OPS } from "pdfjs-dist"
import * as workerUrlModule from "pdfjs-dist/build/pdf.worker.min.mjs?url"

import type { PdfDocumentLoadingTaskLike } from "./core/pdf-text"

const workerUrl = (workerUrlModule as { default: string }).default

GlobalWorkerOptions.workerSrc = workerUrl

const PDF_IMAGE_PAINT_OPERATIONS = new Set(
  [
    OPS.paintImageMaskXObject,
    OPS.paintImageMaskXObjectGroup,
    OPS.paintImageXObject,
    OPS.paintInlineImageXObject,
    OPS.paintInlineImageXObjectGroup,
    OPS.paintImageXObjectRepeat,
    OPS.paintImageMaskXObjectRepeat,
    OPS.paintSolidColorImageMask,
  ].filter((operation): operation is number => typeof operation === "number")
)

function loadPdfDocument(data: Uint8Array): PdfDocumentLoadingTaskLike {
  return getDocument({
    data,
    useSystemFonts: true,
  }) as PdfDocumentLoadingTaskLike
}

export { PDF_IMAGE_PAINT_OPERATIONS, loadPdfDocument }
