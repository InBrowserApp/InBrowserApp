import type { Failure, Illustration } from "./types"

export function openDocument(file: File, signal: AbortSignal) {
  signal.throwIfAborted()
  return new Promise<Illustration>((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/preview.ts", import.meta.url),
      { type: "module" }
    )
    const clean = () => {
      worker.terminate()
      signal.removeEventListener("abort", abort)
    }
    const abort = () => {
      clean()
      reject(signal.reason)
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = (
      event: MessageEvent<{ preview?: Illustration; error?: Failure }>
    ) => {
      clean()
      if (event.data.preview) resolve(event.data.preview)
      else reject(new Error(event.data.error || "invalid"))
    }
    worker.onerror = (event) => {
      event.preventDefault()
      clean()
      reject(
        new Error(
          /memory|allocation|out of resources/i.test(event.message)
            ? "resourceLimit"
            : "renderError"
        )
      )
    }
    worker.onmessageerror = () => {
      clean()
      reject(new Error("renderError"))
    }
    try {
      worker.postMessage(file)
    } catch (reason) {
      clean()
      reject(reason)
    }
  })
}
