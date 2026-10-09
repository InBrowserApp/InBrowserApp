import type { ImportOptions, ImportResult } from "./formats"

export function importFile(
  data: ArrayBuffer,
  name: string,
  options: ImportOptions,
  signal: AbortSignal
): Promise<ImportResult> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/import.worker.ts", import.meta.url),
      { type: "module" }
    )
    const finish = () => {
      signal.removeEventListener("abort", abort)
      worker.terminate()
    }
    const abort = () => {
      finish()
      reject(signal.reason)
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = (
      event: MessageEvent<{ result?: ImportResult; error?: string }>
    ) => {
      finish()
      if (event.data.result) resolve(event.data.result)
      else reject(new Error(event.data.error))
    }
    worker.onerror = () => {
      finish()
      reject(new Error("INVALID"))
    }
    try {
      worker.postMessage({ data, name, options }, [data])
    } catch (error) {
      finish()
      reject(error)
    }
  })
}
