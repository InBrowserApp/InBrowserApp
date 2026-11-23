import type { Output } from "./conversion"

export async function archiveImages(
  images: readonly Output[],
  signal: AbortSignal
) {
  const { ZipWriter, BlobWriter, BlobReader } = await import("@zip.js/zip.js")
  signal.throwIfAborted()
  const writer = new ZipWriter(new BlobWriter("application/zip"), {
    level: 0,
    bufferedWrite: false,
  })
  try {
    for (const { name, blob } of images) {
      signal.throwIfAborted()
      await writer.add(name, new BlobReader(blob), { signal })
    }
  } catch (error) {
    await writer.close().catch(() => {})
    throw error
  }
  const blob = await writer.close()
  signal.throwIfAborted()
  return blob
}
