import { PDFDocument } from 'pdf-lib'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'

type MergeRequest = {
  files: File[]
}

type MergeSuccessPayload = {
  ok: true
  blob: Blob
}

type MergeErrorPayload = {
  ok: false
  code: string
}

const mergePdfs = async (files: File[]): Promise<Blob> => {
  const mergedDocument = await PDFDocument.create()

  for (const file of files) {
    const source = await file.arrayBuffer()
    const currentDocument = await PDFDocument.load(source)
    const pages = await mergedDocument.copyPages(currentDocument, currentDocument.getPageIndices())

    for (const page of pages) {
      mergedDocument.addPage(page)
    }
  }

  const mergedBytes = await mergedDocument.save()

  return new Blob([mergedBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
}

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<MergeRequest>) => Promise<void> | void) | null
  postMessage: (payload: MergeSuccessPayload | MergeErrorPayload) => void
}

workerScope.onmessage = async (event: MessageEvent<MergeRequest>) => {
  try {
    const blob = await mergePdfs(event.data.files)

    const payload: MergeSuccessPayload = {
      ok: true,
      blob,
    }
    workerScope.postMessage(payload)
  } catch (error) {
    const payload: MergeErrorPayload = {
      ok: false,
      code: isEncryptedPdfError(error) ? PDF_ERROR.Encrypted : PDF_ERROR.MergeFailed,
    }
    workerScope.postMessage(payload)
  }
}
