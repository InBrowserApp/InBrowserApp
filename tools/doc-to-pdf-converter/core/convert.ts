import { renderPdf } from "@workspace/html-pdf"
import type { Progress } from "@workspace/html-pdf"
import { openDocument } from "../open-document"

export type { Result } from "@workspace/html-pdf"

export async function convert(
  file: File,
  signal: AbortSignal,
  progress: (value: Progress) => void
) {
  const source = await openDocument(file, signal)
  signal.throwIfAborted()
  const result = await renderPdf(source, signal, progress)
  signal.throwIfAborted()
  return result
}
