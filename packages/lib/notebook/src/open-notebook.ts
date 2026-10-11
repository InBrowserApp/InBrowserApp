import { failure } from "./core/failure"
import type { Notebook, WorkerResult } from "./types"

export { failure }

export async function openNotebook(
  file: File,
  signal: AbortSignal,
  includeSource?: true
) {
  signal.throwIfAborted()
  const result = await new Promise<Notebook>((resolve, reject) => {
    const worker = new Worker(new URL("./parse.worker.ts", import.meta.url), {
      type: "module",
    })
    const dispose = () => {
      signal.removeEventListener("abort", abort)
      worker.terminate()
    }
    const abort = () => {
      dispose()
      reject(signal.reason)
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = (event: MessageEvent<WorkerResult>) => {
      dispose()
      if ("error" in event.data) {
        const error = event.data.error
        reject(
          error === "resourceLimit"
            ? new RangeError("memory")
            : new Error(
                error === "encoding"
                  ? "ENCODING"
                  : error === "version"
                    ? "VERSION"
                    : "INVALID"
              )
        )
      } else resolve(event.data.result)
    }
    worker.onerror = (event) => {
      event.preventDefault()
      dispose()
      reject(new Error(event.message))
    }
    worker.onmessageerror = () => {
      dispose()
      reject(new Error("INVALID"))
    }
    try {
      worker.postMessage({ file, includeSource })
    } catch (reason) {
      dispose()
      reject(reason)
    }
  })
  signal.throwIfAborted()
  return result
}
