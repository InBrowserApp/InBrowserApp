import type { ZipImageEntry } from '../types'

export async function createImageZip(entries: ZipImageEntry[]): Promise<Blob> {
  const { BlobReader, BlobWriter, ZipWriter } = await import('@zip.js/zip.js')

  const blobWriter = new BlobWriter()
  const zipWriter = new ZipWriter(blobWriter)

  for (const entry of entries) {
    await zipWriter.add(entry.name, new BlobReader(entry.blob))
  }

  await zipWriter.close()
  return blobWriter.getData()
}
