import { indexPages, readPageImage } from "./pages"
import type { Comic } from "./types"

export async function openComic(
  file: File,
  signal: AbortSignal
): Promise<Comic> {
  const { BlobReader, BlobWriter, ZipReader } = await import("@zip.js/zip.js")
  signal.throwIfAborted()
  const reader = new ZipReader(new BlobReader(file))
  try {
    const indexed = indexPages(await reader.getEntries())
    signal.throwIfAborted()
    return {
      pages: indexed.map(({ page }) => page),
      async read(index, readSignal) {
        readSignal.throwIfAborted()
        const entry = indexed[index]!.entry
        if (entry.directory) throw new Error("Not a page")
        const blob = await entry.getData(new BlobWriter(), {
          signal: readSignal,
          checkSignature: true,
        })
        return readPageImage(blob)
      },
      dispose: () => reader.close(),
    }
  } catch (reason) {
    await reader.close()
    throw reason
  }
}
