import { getDocument } from "@ofdjs/viewer"

export async function openDocument(file: File, signal: AbortSignal) {
  const document = await getDocument(file, {
    signal,
    // Product policy has no file-size, page-count, or ZIP-entry limit.
    // Rendering still enforces the engine's Canvas allocation budget.
    maxFileSize: Infinity,
    maxUncompressedSize: Infinity,
    maxEntries: Infinity,
  })
  if (signal.aborted) {
    document.destroy()
    signal.throwIfAborted()
  }
  return document
}
