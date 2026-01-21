import { PDFDocument } from 'pdf-lib'

export async function mergePDFs(files: File[]): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('At least two PDF files are required')
  }

  try {
    const merged = await PDFDocument.create()

    for (const file of files) {
      const buffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(buffer)
      const pages = await merged.copyPages(pdfDoc, pdfDoc.getPageIndices())
      pages.forEach((page) => merged.addPage(page))
    }

    const mergedBytes = await merged.save()
    const outputBuffer = new Uint8Array(mergedBytes)
    return new Blob([outputBuffer], { type: 'application/pdf' })
  } catch {
    throw new Error('Failed to merge PDFs')
  }
}
