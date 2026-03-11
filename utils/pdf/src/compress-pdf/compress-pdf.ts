import Module from '@jspawn/qpdf-wasm/qpdf.js'
import WASM_URL from '@jspawn/qpdf-wasm/qpdf.wasm?url'

export type PdfCompressionObjectStreamsMode = 'preserve' | 'generate'

export type PdfCompressionOptions = {
  compressStreams: boolean
  recompressFlate: boolean
  compressionLevel: number
  objectStreams: PdfCompressionObjectStreamsMode
  linearize: boolean
}

const DEFAULT_OPTIONS: PdfCompressionOptions = {
  compressStreams: true,
  recompressFlate: true,
  compressionLevel: 6,
  objectStreams: 'generate',
  linearize: false,
}

const clampCompressionLevel = (value: number): number =>
  Math.min(9, Math.max(1, Math.round(value || DEFAULT_OPTIONS.compressionLevel)))

export const buildCompressPdfArgs = (
  options: Partial<PdfCompressionOptions> = {},
  inputPath = '/working/input.pdf',
  outputPath = '/output.pdf',
): string[] => {
  const normalized: PdfCompressionOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    compressionLevel: clampCompressionLevel(
      options.compressionLevel ?? DEFAULT_OPTIONS.compressionLevel,
    ),
  }

  const args = [
    `--compress-streams=${normalized.compressStreams ? 'y' : 'n'}`,
    `--object-streams=${normalized.objectStreams}`,
    `--compression-level=${normalized.compressionLevel}`,
  ]

  if (normalized.recompressFlate) {
    args.push('--recompress-flate')
  }

  if (normalized.linearize) {
    args.push('--linearize')
  }

  args.push(inputPath, outputPath)

  return args
}

export async function compressPdf(
  blob: Blob,
  options: Partial<PdfCompressionOptions> = {},
): Promise<Blob> {
  const mod = await Module({
    locateFile: () => WASM_URL,
  })
  const working = '/working'
  mod.FS.mkdir(working)

  const input = `${working}/input.pdf`
  const output = '/output.pdf'

  mod.FS.mount(
    mod.WORKERFS,
    {
      blobs: [{ name: 'input.pdf', data: blob }],
    },
    working,
  )

  const result = await mod.callMain(buildCompressPdfArgs(options, input, output))

  if (result !== 0) {
    throw new Error('Failed to compress PDF')
  }

  const outputBuffer: Uint8Array = mod.FS.readFile(output, {
    encoding: 'binary',
  })

  return new Blob([outputBuffer as Uint8Array<ArrayBuffer>], {
    type: 'application/pdf',
  })
}
