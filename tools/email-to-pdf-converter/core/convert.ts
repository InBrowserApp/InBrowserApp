import { openEmail } from "@workspace/email"
import { emailDocument } from "@workspace/email/document"
import type { DocumentLabels } from "@workspace/email/document"
import { preparePrintDocument } from "@workspace/web-document/print"
import { renderPdf } from "@workspace/html-pdf"
import type { Progress, Result as PdfResult } from "@workspace/html-pdf"

export type Result = PdfResult & { notes: string[] }

export async function convert(
  file: File,
  signal: AbortSignal,
  progress: (value: Progress) => void,
  labels: DocumentLabels
): Promise<Result> {
  const email = await openEmail(file, signal)
  signal.throwIfAborted()
  const document = emailDocument(email, labels)
  const source = preparePrintDocument(document.html)
  const result = await renderPdf(source, signal, progress)
  signal.throwIfAborted()
  return { ...result, notes: document.notes }
}
