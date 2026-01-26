import type { WebpConversionResult } from '../types'

export async function createWebpZip(results: WebpConversionResult[]): Promise<Blob> {
  const { BlobReader, BlobWriter, ZipWriter } = await import('@zip.js/zip.js')

  const zipFileWriter = new BlobWriter()
  const zipWriter = new ZipWriter(zipFileWriter)

  for (const result of results) {
    await zipWriter.add(result.outputName, new BlobReader(result.blob))
  }

  await zipWriter.close()
  return zipFileWriter.getData()
}
