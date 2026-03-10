import { degrees, PDFDocument } from 'pdf-lib'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'
import type { OrganizePDFPayload } from './organize-pdf'

type OrganizePdfWorkerSuccessPayload = {
  ok: true
  result: {
    file: {
      name: string
      blob: Blob
    }
  }
}

type OrganizePdfWorkerErrorPayload = {
  ok: false
  code: string
}

const withPdfExtension = (name: string): string => {
  const trimmed = name.trim()
  if (!trimmed) {
    return 'organized.pdf'
  }

  return trimmed.toLowerCase().endsWith('.pdf') ? trimmed : `${trimmed}.pdf`
}

const organizePdf = async (payload: OrganizePDFPayload): Promise<Blob> => {
  const sourceBytes = await payload.file.arrayBuffer()
  const sourceDocument = await PDFDocument.load(sourceBytes)
  const targetDocument = await PDFDocument.create()
  const pageIndices = payload.pages.map((page) => page.sourcePageNumber - 1)
  const copiedPages = await targetDocument.copyPages(sourceDocument, pageIndices)

  for (let index = 0; index < copiedPages.length; index += 1) {
    const copiedPage = copiedPages[index]
    const page = payload.pages[index]

    if (!copiedPage || !page) {
      continue
    }

    copiedPage.setRotation(degrees(page.rotation))
    targetDocument.addPage(copiedPage)
  }

  const bytes = await targetDocument.save()
  return new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
}

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<OrganizePDFPayload>) => Promise<void> | void) | null
  postMessage: (payload: OrganizePdfWorkerSuccessPayload | OrganizePdfWorkerErrorPayload) => void
}

workerScope.onmessage = async (event: MessageEvent<OrganizePDFPayload>) => {
  try {
    const blob = await organizePdf(event.data)

    workerScope.postMessage({
      ok: true,
      result: {
        file: {
          name: withPdfExtension(event.data.outputFileName),
          blob,
        },
      },
    })
  } catch (error) {
    workerScope.postMessage({
      ok: false,
      code: isEncryptedPdfError(error) ? PDF_ERROR.Encrypted : PDF_ERROR.ExportFailed,
    })
  }
}
