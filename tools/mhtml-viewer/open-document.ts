import { prepareWebDocument } from "@workspace/web-document"
import type {
  ArchiveDocument,
  ConvertedArchive,
  Failure,
  Messages,
  WorkerResult,
} from "./types"

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
  signal.throwIfAborted()
  const archive = await new Promise<ConvertedArchive>((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/archive.worker.ts", import.meta.url),
      { type: "module" }
    )
    const done = () => {
      worker.terminate()
      signal.removeEventListener("abort", abort)
    }
    const abort = () => {
      done()
      reject(signal.reason)
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = (event: MessageEvent<WorkerResult>) => {
      done()
      if ("error" in event.data) reject(new Error(event.data.error))
      else resolve(event.data.result)
    }
    const failed = () => {
      done()
      reject(new Error("invalid"))
    }
    worker.onerror = failed
    worker.onmessageerror = failed
    try {
      worker.postMessage(file)
    } catch (reason) {
      done()
      reject(reason)
    }
  })
  signal.throwIfAborted()
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
