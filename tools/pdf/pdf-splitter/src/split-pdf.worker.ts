import { PDFDocument } from 'pdf-lib'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'

export type SplitOutputMode = 'single' | 'multiple'
export type SplitMultipleMode = 'ranges' | 'pages'

type SplitRequest = {
  file: File
  pages: number[]
  segments: number[][]
  outputMode: SplitOutputMode
  multipleMode: SplitMultipleMode
  outputBaseName: string
}

type SplitWorkerFile = {
  name: string
  blob: Blob
}

type SplitWorkerSingleResult = {
  kind: 'single'
  file: SplitWorkerFile
}

type SplitWorkerMultipleResult = {
  kind: 'multiple'
  files: SplitWorkerFile[]
}

type SplitWorkerSuccessPayload = {
  ok: true
  result: SplitWorkerSingleResult | SplitWorkerMultipleResult
}

type SplitWorkerErrorPayload = {
  ok: false
  code: string
}

const createPdfBlob = async (document: PDFDocument): Promise<Blob> => {
  const bytes = await document.save()
  return new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' })
}

const createPdfFromPages = async (source: PDFDocument, pages: number[]): Promise<Blob> => {
  const target = await PDFDocument.create()
  const pageIndices = pages.map((page) => page - 1)
  const copiedPages = await target.copyPages(source, pageIndices)

  for (const page of copiedPages) {
    target.addPage(page)
  }

  return createPdfBlob(target)
}

const withPdfExtension = (name: string): string => {
  const trimmed = name.trim()
  if (!trimmed) {
    return 'split-result.pdf'
  }

  if (trimmed.toLowerCase().endsWith('.pdf')) {
    return trimmed
  }

  return `${trimmed}.pdf`
}

const splitPdf = async (
  payload: SplitRequest,
): Promise<SplitWorkerSingleResult | SplitWorkerMultipleResult> => {
  const sourceBytes = await payload.file.arrayBuffer()
  const sourceDocument = await PDFDocument.load(sourceBytes)

  if (payload.outputMode === 'single') {
    const blob = await createPdfFromPages(sourceDocument, payload.pages)

    return {
      kind: 'single',
      file: {
        name: withPdfExtension(payload.outputBaseName),
        blob,
      },
    }
  }

  if (payload.multipleMode === 'ranges') {
    const indexWidth = Math.max(2, String(payload.segments.length).length)
    const files: SplitWorkerFile[] = []

    for (let index = 0; index < payload.segments.length; index += 1) {
      const segment = payload.segments[index]
      if (!segment) {
        continue
      }

      const blob = await createPdfFromPages(sourceDocument, segment)
      files.push({
        name: `${payload.outputBaseName}-part-${String(index + 1).padStart(indexWidth, '0')}.pdf`,
        blob,
      })
    }

    return {
      kind: 'multiple',
      files,
    }
  }

  const indexWidth = Math.max(2, String(sourceDocument.getPageCount()).length)
  const files: SplitWorkerFile[] = []

  for (const page of payload.pages) {
    const blob = await createPdfFromPages(sourceDocument, [page])
    files.push({
      name: `${payload.outputBaseName}-page-${String(page).padStart(indexWidth, '0')}.pdf`,
      blob,
    })
  }

  return {
    kind: 'multiple',
    files,
  }
}

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<SplitRequest>) => Promise<void> | void) | null
  postMessage: (payload: SplitWorkerSuccessPayload | SplitWorkerErrorPayload) => void
}

workerScope.onmessage = async (event: MessageEvent<SplitRequest>) => {
  try {
    const result = await splitPdf(event.data)

    const payload: SplitWorkerSuccessPayload = {
      ok: true,
      result,
    }

    workerScope.postMessage(payload)
  } catch (error) {
    const payload: SplitWorkerErrorPayload = {
      ok: false,
      code: isEncryptedPdfError(error) ? PDF_ERROR.Encrypted : PDF_ERROR.SplitFailed,
    }

    workerScope.postMessage(payload)
  }
}
