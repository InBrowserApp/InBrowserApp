import { openEbook, snapshotBook } from "@workspace/ebook"
import { readingDocument, readingPreview } from "@workspace/ebook/document"
import { writeDocx } from "@workspace/ebook/write-docx"
import type { Messages } from "./types"

const known = ["protected", "empty", "unsupportedLayout", "incomplete"] as const

export function failure(reason: unknown) {
  if (reason instanceof RangeError) return "resourceLimit"
  return (
    (reason instanceof Error && known.find((key) => key === reason.message)) ||
    "invalid"
  )
}

export async function convert(
  source: File,
  signal: AbortSignal,
  m: Messages,
  saving: () => void
) {
  const book = await openEbook(source, signal)
  try {
    const snapshot = await snapshotBook(book, signal, m)
    saving()
    const { file, missing } = await writeDocx(snapshot, signal)
    const { doc, notes } = readingDocument(
      { ...snapshot, missing: snapshot.missing || missing },
      { ...m, styleNotice: m.layoutNotice }
    )
    return { file, preview: readingPreview(doc), notes }
  } finally {
    book.dispose()
  }
}
