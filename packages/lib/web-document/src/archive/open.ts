import type { ConvertedArchive, WorkerResult } from "./types"
export type { ConvertedArchive, Failure } from "./types"

export async function readWebArchive(
  file: File,
  signal: AbortSignal
): Promise<ConvertedArchive> {
  signal.throwIfAborted()
  const archive = await new Promise<ConvertedArchive>((resolve, reject) => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    })
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
  return archive
}
