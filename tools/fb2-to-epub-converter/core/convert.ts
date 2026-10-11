import { snapshotBook } from "@workspace/ebook"
import { openBook } from "@workspace/ebook/fb2"
import { readingDocument, readingPreview } from "@workspace/ebook/document"
import { writeEpub } from "@workspace/ebook/write-epub"
import type { Messages } from "../types"

export async function convert(file: File, signal: AbortSignal, m: Messages) {
  const book = await openBook(file, signal, { preserveMissingImages: true })
  try {
    const snapshot = await snapshotBook(book, signal, m)
    const file = await writeEpub(snapshot, signal, m)
    signal.throwIfAborted()
    const { doc, notes } = readingDocument(snapshot, m)
    return { file, preview: readingPreview(doc), notes }
  } finally {
    book.dispose()
  }
}
