import { preparePreview } from "./prepare-preview"
import { failure } from "./core/failure"
import type { Conversion, Messages, WorkerResult } from "./types"

export { failure }

export async function openDocument(
  file: File,
  signal: AbortSignal,
  messages: Messages
) {
  signal.throwIfAborted()
  const result = await new Promise<Conversion>((resolve, reject) => {
    const worker = new Worker(new URL("./convert.worker.ts", import.meta.url), {
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
            : new Error(error === "encoding" ? "ENCODING" : "INVALID")
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
      worker.postMessage(file)
    } catch (reason) {
      dispose()
      reject(reason)
    }
  })
  signal.throwIfAborted()
  return preparePreview(result, messages)
}
