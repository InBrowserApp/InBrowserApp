import { openEbook, snapshotBook } from "@workspace/ebook"
import { ebookDocument } from "./document"
import type { Messages } from "../types"

export async function convert(file: File, signal: AbortSignal, m: Messages) {
  const book = await openEbook(file, signal)
  try {
    const snapshot = await snapshotBook(book, signal, m)
    signal.throwIfAborted()
    return ebookDocument(snapshot, m)
  } finally {
    book.dispose()
  }
}
