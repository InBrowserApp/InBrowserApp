import type { CompileResult, Phase, WorkerReply } from "./types"
import { failure } from "./core/document"

export function compileDocument(
  file: File,
  signal: AbortSignal,
  progress: (phase: Phase) => void
): Promise<CompileResult> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const unavailable = (reason: unknown) =>
      resolve({
        error:
          failure(reason) === "resource" ? "resource" : "engineUnavailable",
        diagnostics: [],
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
    worker.onmessage = ({ data }: MessageEvent<WorkerReply>) => {
      if (data.type === "progress") progress(data.phase)
      else {
        cleanup()
        resolve(data)
      }
    }
    worker.onerror = (event) => {
      event.preventDefault()
      cleanup()
      unavailable(new Error(event.message))
    }
    worker.onmessageerror = () => {
      cleanup()
      unavailable(new Error("worker message could not be read"))
    }
    try {
      worker.postMessage(file)
    } catch (reason) {
      cleanup()
      unavailable(reason)
    }
  })
}
