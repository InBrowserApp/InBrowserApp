export type ZipPdfEntry = {
  name: string
  blob: Blob
}

export async function createPdfZip(entries: ZipPdfEntry[]): Promise<Blob> {
  const { BlobReader, BlobWriter, ZipWriter } = await import('@zip.js/zip.js')

  const writer = new BlobWriter()
  const zipWriter = new ZipWriter(writer)

  for (const entry of entries) {
    await zipWriter.add(entry.name, new BlobReader(entry.blob))
  }

  await zipWriter.close()
  return writer.getData()
}
