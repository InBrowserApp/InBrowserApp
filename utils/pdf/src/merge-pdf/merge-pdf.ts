import Module from '@jspawn/qpdf-wasm/qpdf.js'
import WASM_URL from '@jspawn/qpdf-wasm/qpdf.wasm?url'

const buildInputName = (file: File, index: number) => {
  const fallback = `input-${index + 1}.pdf`
  const baseName = file.name.trim() || fallback
  const sanitized = baseName.replace(/[\\/]/g, '_')
  const withExtension = sanitized.toLowerCase().endsWith('.pdf') ? sanitized : `${sanitized}.pdf`
  return `${index + 1}-${withExtension}`
}

export async function mergePDFs(files: File[]): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('At least two PDF files are required')
  }

  const mod = await Module({
    locateFile: () => WASM_URL,
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
    throw new Error('Failed to merge PDFs')
  }

  const outputBuffer: Uint8Array = mod.FS.readFile(output, {
    encoding: 'binary',
  })

  return new Blob([outputBuffer as Uint8Array<ArrayBuffer>], {
    type: 'application/pdf',
  })
}
