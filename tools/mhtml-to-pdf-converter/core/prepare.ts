import { preparePrintDocument } from "@workspace/web-document/print"
import type { ConvertedArchive } from "@workspace/web-document/archive"

export function prepare(archive: ConvertedArchive) {
  if (archive.archiveNotes.truncated) throw new Error("incomplete")
  if (archive.archiveNotes.encoding) throw new Error("encoding")
  if (archive.archiveNotes.nested) throw new Error("nested")
  return preparePrintDocument(archive.source)
}
