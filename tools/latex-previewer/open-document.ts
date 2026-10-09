import type { Failure, Rendered } from "./types"

export function openDocument(
  file: File,
  signal: AbortSignal,
  onSource: (source: string) => void
): Promise<Rendered> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/latex.worker.ts", import.meta.url),
      { type: "module" }
    )
    const cleanup = () => {
      worker.terminate()
      signal.removeEventListener("abort", abort)
    }
    const abort = () => {
      cleanup()
      reject(signal.reason)
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = (
      event: MessageEvent<
        | { type: "source"; source: string }
        | ({ type: "result" } & Rendered)
        | { type: "error"; error: Failure }
      >
    ) => {
      if (signal.aborted) return
      if (event.data.type === "source") {
        onSource(event.data.source)
        return
      }
      cleanup()
      if (event.data.type === "error") reject(new Error(event.data.error))
      else resolve(event.data)
    }
    worker.onerror = worker.onmessageerror = () => {
      cleanup()
      reject(new Error("invalid"))
    }
    try {
      worker.postMessage(file)
    } catch (error) {
      cleanup()
      reject(error)
    }
  })
}
