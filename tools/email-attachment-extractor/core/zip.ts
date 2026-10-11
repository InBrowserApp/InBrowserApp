import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js"

export async function createZip(
  files: { filename: string; file: Blob }[],
  signal: AbortSignal
): Promise<Blob> {
  signal.throwIfAborted()
  const writer = new ZipWriter(new BlobWriter("application/zip"), {
    level: 0,
    useWebWorkers: false,
    signal,
  })
  for (const item of files) {
    signal.throwIfAborted()
    await writer.add(item.filename, new BlobReader(item.file))
  }
  signal.throwIfAborted()
  const result = await writer.close()
  signal.throwIfAborted()
  return result
}
