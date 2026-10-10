import { failure } from "./errors"
import type { Labels, Result, Source } from "./types"

export function exportDocument(
  source: Source,
  labels: Labels,
  signal: AbortSignal
): Promise<Result> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const unavailable = (reason: unknown) =>
      resolve({
        error:
          failure(reason) === "resource" ? "resource" : "engineUnavailable",
      })
    let worker: Worker
    try {
      worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
    } catch (reason) {
      unavailable(reason)
      return
    }
    const cleanup = () => {
      worker.terminate()
      signal.removeEventListener("abort", abort)
    }
    const abort = () => {
      cleanup()
      reject(signal.reason)
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = ({ data }: MessageEvent<Result>) => {
      cleanup()
      resolve(data)
    }
    worker.onerror = (event) => {
      event.preventDefault()
      cleanup()
      unavailable(new Error(event.message))
    }
    worker.onmessageerror = () => {
      cleanup()
      unavailable(new Error("worker message"))
    }
    try {
      worker.postMessage({ source, labels })
    } catch (reason) {
      cleanup()
      unavailable(reason)
    }
  })
}
