import { prepare } from "./core/prepare"
import type { WorkerResult } from "./worker"

export async function openDocument(file: File, signal: AbortSignal) {
  signal.throwIfAborted()
  const result = await new Promise<string>((resolve, reject) => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
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
          error === "resource" ? new RangeError("memory") : new Error(error)
        )
      } else resolve(event.data.html)
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
  return prepare(result)
}
