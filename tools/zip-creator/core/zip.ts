import type { Progress, ZipItem } from "../types"

export async function createZip(
  items: readonly ZipItem[],
  level: number,
  signal: AbortSignal,
  onProgress: (progress: Progress) => void
) {
  signal.throwIfAborted()
  const { ZipWriter, BlobWriter, BlobReader } = await import("@zip.js/zip.js")
  signal.throwIfAborted()
  const writer = new ZipWriter(new BlobWriter("application/zip"), {
    level,
    bufferedWrite: false,
  })
  // A unit per entry also gives empty files/folders meaningful progress.
  const total = items.reduce((sum, item) => sum + (item.file?.size ?? 0) + 1, 0)
  let completed = 0
  try {
    for (const item of items) {
      signal.throwIfAborted()
      onProgress({
        path: item.path,
        percent: Math.floor((completed / total) * 100),
      })
      await writer.add(
        item.path,
        item.file ? new BlobReader(item.file) : undefined,
        {
          directory: item.file === null,
          lastModDate: item.file ? new Date(item.file.lastModified) : undefined,
          signal,
          onprogress: (loaded) => {
            onProgress({
              path: item.path,
              percent: Math.min(
                99,
                Math.floor(((completed + loaded) / total) * 100)
              ),
            })
          },
        }
      )
      completed += (item.file?.size ?? 0) + 1
    }
  } catch (error) {
    // Finalize/dispose the abandoned writer; never expose a partial archive.
    await writer.close().catch(() => {})
    throw error
  }
  const blob = await writer.close()
  signal.throwIfAborted()
  return blob
}
