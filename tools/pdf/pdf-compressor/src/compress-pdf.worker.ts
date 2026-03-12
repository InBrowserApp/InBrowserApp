import { compressPdf, type PdfCompressionOptions } from '@utils/pdf'
import { PDF_ERROR } from './pdf-errors'

type CompressMessage = {
  file: File
  options: PdfCompressionOptions
}

self.onmessage = async (event: MessageEvent<CompressMessage>) => {
  try {
    const blob = await compressPdf(event.data.file, event.data.options)

    self.postMessage({
      ok: true,
      blob,
    })
  } catch {
    self.postMessage({
      ok: false,
      code: PDF_ERROR.CompressionFailed,
    })
  }
}
