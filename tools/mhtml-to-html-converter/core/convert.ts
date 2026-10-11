import { readWebArchive } from "@workspace/web-document/archive"
import { exportWebDocument } from "@workspace/web-document/export"

export async function convert(
  file: File,
  signal: AbortSignal,
  headingText: string
) {
  const archive = await readWebArchive(file, signal)
  signal.throwIfAborted()
  if (archive.archiveNotes.truncated) throw new Error("incomplete")
  if (archive.archiveNotes.encoding) throw new Error("encoding")
  if (archive.archiveNotes.nested) throw new Error("nested")
  return exportWebDocument(archive.source, signal, headingText)
}
