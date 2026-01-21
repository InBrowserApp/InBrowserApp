import Module from '@jspawn/qpdf-wasm/qpdf.js'
import WASM_URL from '@jspawn/qpdf-wasm/qpdf.wasm?url'
import { PDFDocument } from 'pdf-lib'

const buildInputName = (_file: File, index: number) => `input-${index + 1}.pdf`

const mergeWithQpdf = async (files: File[]): Promise<Blob> => {
  let stderr = ''
  const mod = await Module({
    locateFile: () => WASM_URL,
    printErr: (text: string) => {
      if (!text) return
      stderr = stderr ? `${stderr}\n${text}` : text
    },
  })
  const working = '/working'
  mod.FS.mkdir(working)

  const blobs = files.map((file, index) => ({
    name: buildInputName(file, index),
    data: file,
  }))

  mod.FS.mount(
    mod.WORKERFS,
    {
      blobs,
    },
    working,
  )

  const inputPaths = blobs.map((blob) => `${working}/${blob.name}`)
  const output = '/output.pdf'
  const args = ['--empty', '--pages', ...inputPaths, '--', output]

  const result = await mod.callMain(args)
  if (result !== 0) {
    throw new Error(stderr || 'Failed to merge PDFs')
  }

  const outputBuffer: Uint8Array = mod.FS.readFile(output, {
    encoding: 'binary',
  })

  return new Blob([outputBuffer as Uint8Array<ArrayBuffer>], {
    type: 'application/pdf',
  })
}

const mergeWithPdfLib = async (files: File[]): Promise<Blob> => {
  const merged = await PDFDocument.create()

  for (const file of files) {
    const buffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(buffer)
    const pages = await merged.copyPages(pdfDoc, pdfDoc.getPageIndices())
    pages.forEach((page) => merged.addPage(page))
  }

  const mergedBytes = await merged.save()
  return new Blob([mergedBytes], { type: 'application/pdf' })
}

export async function mergePDFs(files: File[]): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('At least two PDF files are required')
  }

  try {
    return await mergeWithQpdf(files)
  } catch (error) {
    try {
      return await mergeWithPdfLib(files)
    } catch (fallbackError) {
      if (fallbackError instanceof Error) throw fallbackError
      if (error instanceof Error) throw error
      throw new Error('Failed to merge PDFs')
    }
  }
}
