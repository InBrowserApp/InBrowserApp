import { imageMime, indexPages } from "./core/pages"
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
        let header = new Uint8Array(await blob.slice(0, 16).arrayBuffer())
        // AVIF can declare its image brand in the compatible-brand list.
        if (
          String.fromCharCode(...header.slice(4, 8)) === "ftyp" &&
          header.length >= 16
        ) {
          const length = new DataView(header.buffer).getUint32(0)
          if (length > 16 && length <= blob.size)
            header = new Uint8Array(await blob.slice(0, length).arrayBuffer())
        }
        const mime = imageMime(header)
        if (!mime) throw new Error("Unsupported image encoding")
        return new Blob([blob], { type: mime })
      },
      dispose: () => reader.close(),
    }
  } catch (reason) {
    await reader.close()
    throw reason
  }
}
