import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'
import { buildPageNumberLabel, resolvePageNumberCoordinates } from './utils/page-number-layout'
import type {
  AddPageNumbersPayload,
  PageNumberFontFamily,
  AddPageNumbersWorkerError,
  AddPageNumbersWorkerSuccess,
} from './types'

const withPdfExtension = (name: string): string => {
  const trimmed = name.trim()

  if (!trimmed) {
    return 'numbered.pdf'
  }

  if (trimmed.toLowerCase().endsWith('.pdf')) {
    return trimmed
  }

  return `${trimmed}.pdf`
}

const resolveStandardFont = (fontFamily: PageNumberFontFamily): StandardFonts => {
  if (fontFamily === 'serif') {
    return StandardFonts.TimesRoman
  }

  return StandardFonts.Helvetica
}

const addPageNumbers = async (
  payload: AddPageNumbersPayload,
): Promise<AddPageNumbersWorkerSuccess> => {
  const sourceBytes = await payload.file.arrayBuffer()
  const document = await PDFDocument.load(sourceBytes)
  const pages = document.getPages()
  const total = pages.length

  const font = await document.embedFont(resolveStandardFont(payload.fontFamily))

  for (let index = 0; index < payload.pages.length; index += 1) {
    const pageNumber = payload.pages[index]
    if (pageNumber === undefined) {
      continue
    }

    const page = pages[pageNumber - 1]

    if (!page) {
      continue
    }

    const label = buildPageNumberLabel(index, total, payload.startNumber, payload.format)
    const textWidth = font.widthOfTextAtSize(label, payload.fontSize)
    const { width, height } = page.getSize()
    const { x, y } = resolvePageNumberCoordinates({
      pageWidth: width,
      pageHeight: height,
      textWidth,
      fontSize: payload.fontSize,
      marginX: payload.marginX,
      marginY: payload.marginY,
      position: payload.position,
    })

    page.drawText(label, {
      x,
      y,
      size: payload.fontSize,
      font,
      color: rgb(0, 0, 0),
    })
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
  onmessage: ((event: MessageEvent<AddPageNumbersPayload>) => Promise<void> | void) | null
  postMessage: (payload: AddPageNumbersWorkerSuccess | AddPageNumbersWorkerError) => void
}

workerScope.onmessage = async (event: MessageEvent<AddPageNumbersPayload>) => {
  try {
    const result = await addPageNumbers(event.data)
    workerScope.postMessage(result)
  } catch (error) {
    const payload: AddPageNumbersWorkerError = {
      ok: false,
      code: isEncryptedPdfError(error) ? PDF_ERROR.Encrypted : PDF_ERROR.AddFailed,
    }

    workerScope.postMessage(payload)
  }
}
