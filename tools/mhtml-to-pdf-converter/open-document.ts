import { readWebArchive } from "@workspace/web-document/archive"
import { prepare } from "./core/prepare"

export async function openDocument(file: File, signal: AbortSignal) {
  const archive = await readWebArchive(file, signal)
  signal.throwIfAborted()
  return prepare(archive)
}
