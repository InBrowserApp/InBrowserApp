import { ArchiveError } from "@workspace/archive/types"
import { openWorkerArchive } from "@workspace/archive/worker"
import { indexArchivePages, readPageImage } from "./pages"
import type { Comic } from "./types"

export async function openCompressedComic(
  file: File,
  format: "rar" | "7z",
  signal: AbortSignal
): Promise<Comic> {
  const archive = await openWorkerArchive(file, format, signal)
  const indexed = indexArchivePages(archive.entries)
  let pending = Promise.resolve()

  return {
    pages: indexed.map(({ page }) => page),
    read(index, readSignal) {
      // The decoder works serially. Keep canceled page reads out of its queue.
      const page = pending.then(async () => {
        readSignal.throwIfAborted()
        const { filename } = indexed[index]!.entry
        try {
          const blob = await archive.readEntry(filename)
          readSignal.throwIfAborted()
          return await readPageImage(blob)
        } catch (reason) {
          if (
            reason instanceof ArchiveError &&
            reason.code === "entry-too-large"
          )
            throw new RangeError(reason.message, { cause: reason })
          throw reason
        }
      })
      pending = page.then(
        () => {},
        () => {}
      )
      return page
    },
    dispose: archive.dispose,
  }
}
