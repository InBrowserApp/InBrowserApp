import { openChm } from "@workspace/chm"
import { normalizeChmPath } from "@file-viewer/renderer-chm/security"
import { renderTopic } from "./render-topic"

export async function openBook(file: File, signal: AbortSignal) {
  const archive = await openChm(file, signal)
  if (!archive) return null

  const { contents, topics, home, lookupTopic, close, encoding, lookup, read } =
    archive
  return {
    contents,
    topics,
    home,
    lookupTopic,
    close,
    async readTopic(path: string, signal: AbortSignal) {
      if (!lookupTopic(normalizeChmPath(path) ?? ""))
        throw new Error("CHM topic unavailable")
      return renderTopic({
        path,
        encoding,
        lookup,
        read: (entry) => read(entry, signal),
        signal,
      })
    },
  }
}

export type Book = NonNullable<Awaited<ReturnType<typeof openBook>>>
