import { normalizeArchivePath, sortEntries } from "../core/path"
import { ArchiveError, type ArchiveHandle } from "../core/types"

import type { ExtendedArchiveFormat } from "../core/formats"
import type { ArchiveRequest, ArchiveResponse } from "./protocol"

type Request =
  | Omit<Extract<ArchiveRequest, { type: "open" }>, "id">
  | Omit<Extract<ArchiveRequest, { type: "extract" }>, "id">
type Response = Exclude<ArchiveResponse, { type: "error" }>

async function openWorkerArchive(
  file: File,
  format: ExtendedArchiveFormat,
  signal?: AbortSignal
): Promise<ArchiveHandle> {
  signal?.throwIfAborted()
  const worker = new Worker(new URL("./archive.worker.ts", import.meta.url), {
    type: "module",
  })
  let nextId = 0
  let failure: Error | undefined
  const pending = new Map<
    number,
    { resolve: (response: Response) => void; reject: (error: Error) => void }
  >()

  function close(
    error: Error = new DOMException("Archive closed.", "AbortError")
  ) {
    if (failure) return
    failure = error
    signal?.removeEventListener("abort", abort)
    worker.terminate()
    for (const { reject } of pending.values()) reject(error)
    pending.clear()
  }

  const abort = () => close()
  const onWorkerError = () =>
    close(
      new ArchiveError(
        "archive-read-failed",
        "Could not load the archive decoder."
      )
    )

  worker.addEventListener("error", onWorkerError)
  worker.addEventListener("messageerror", onWorkerError)
  worker.addEventListener(
    "message",
    ({ data }: MessageEvent<ArchiveResponse>) => {
      const request = pending.get(data.id)
      if (!request) return
      pending.delete(data.id)
      if (data.type === "error")
        request.reject(new ArchiveError(data.code, data.message))
      else request.resolve(data)
    }
  )
  signal?.addEventListener("abort", abort, { once: true })

  function send(request: Request): Promise<Response> {
    if (failure) return Promise.reject(failure)
    return new Promise((resolve, reject) => {
      const id = nextId++
      pending.set(id, { resolve, reject })
      try {
        worker.postMessage({ id, ...request })
      } catch (error) {
        pending.delete(id)
        reject(error)
      }
    })
  }

  try {
    const result = await send({ type: "open", file, format })
    if (result.type !== "opened") throw new Error("Expected archive listing.")
    // A path identifies a single visible entry. Keep its source header index
    // even when duplicate or empty paths are skipped.
    const indexByPath = new Map<string, number>()
    const entries = result.listing.entries.filter(({ path }, index) => {
      if (!path || indexByPath.has(path)) return false
      indexByPath.set(path, index)
      return true
    })
    return {
      format,
      entries: sortEntries(entries),
      tarWrapped: result.listing.tarWrapped,
      async readEntry(path) {
        const normalized = normalizeArchivePath(path)
        const index = indexByPath.get(normalized)
        if (index === undefined) {
          throw new ArchiveError(
            "entry-not-found",
            `Archive entry not found: ${path}`
          )
        }
        if (result.listing.entries[index]!.kind !== "file") {
          throw new ArchiveError(
            "file-only",
            "Only files can be previewed or downloaded."
          )
        }
        const extracted = await send({
          type: "extract",
          index,
          path: normalized,
        })
        if (extracted.type !== "extracted")
          throw new Error("Expected archive entry.")
        return extracted.blob
      },
      async dispose() {
        close()
      },
    }
  } catch (error) {
    close()
    throw error
  }
}

export { openWorkerArchive }
