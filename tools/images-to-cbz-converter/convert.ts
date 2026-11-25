import { createCbzWriter } from "@workspace/comic/cbz"
import { BlobReader } from "@zip.js/zip.js"
import type { ComicImage } from "./types"

export async function createArchive(
  pages: readonly ComicImage[],
  signal: AbortSignal,
  onPage: (page: number) => void
) {
  const zip = createCbzWriter()
  const digits = Math.max(4, String(pages.length).length)
  try {
    for (const [index, image] of pages.entries()) {
      signal.throwIfAborted()
      const page = index + 1
      onPage(page)
      await zip.add(
        `page-${String(page).padStart(digits, "0")}.${image.extension}`,
        new BlobReader(image.blob),
        { lastModDate: image.modifiedAt, signal }
      )
    }
  } catch (error) {
    await zip.close().catch(() => {})
    throw error
  }
  const result = await zip.close()
  signal.throwIfAborted()
  return result
}
