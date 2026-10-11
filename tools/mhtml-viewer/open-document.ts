import { prepareWebDocument } from "@workspace/web-document"
import { readWebArchive } from "@workspace/web-document/archive"
import type { ArchiveDocument, Failure, Messages } from "./types"

export function failure(reason: unknown): Failure {
  if (
    reason instanceof RangeError ||
    (reason instanceof Error &&
      /memory|allocation|out of resources/i.test(reason.message))
  )
    return "resourceLimit"
  return reason instanceof Error &&
    ["structure", "email", "resourceLimit"].includes(reason.message)
    ? (reason.message as Failure)
    : "invalid"
}

export async function openArchive(
  file: File,
  signal: AbortSignal,
  m: Messages
): Promise<ArchiveDocument> {
  const archive = await readWebArchive(file, signal)
  const preview = prepareWebDocument(archive.source, {
    emptyText: m.noContent,
    headingText: m.documentBody,
  })
  signal.throwIfAborted()
  return {
    ...preview,
    location: archive.location,
    archiveNotes: archive.archiveNotes,
  }
}
