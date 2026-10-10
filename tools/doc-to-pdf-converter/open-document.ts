import type { Source } from "@workspace/html-pdf"

export async function openDocument(
  file: File,
  signal: AbortSignal
): Promise<Source> {
  signal.throwIfAborted()
  const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  })
  try {
    return await new Promise<Source>((resolve, reject) => {
      const abort = () => reject(signal.reason)
      signal.addEventListener("abort", abort, { once: true })
      const finish = () => signal.removeEventListener("abort", abort)
      worker.onmessage = (
        event: MessageEvent<{ source: Source } | { error: string }>
      ) => {
        finish()
        if ("error" in event.data) reject(new Error(event.data.error))
        else resolve(event.data.source)
      }
      const invalid = () => {
        finish()
        reject(new Error("invalid"))
      }
      worker.onerror = invalid
      worker.onmessageerror = invalid
      void file
        .arrayBuffer()
        .then((buffer) => {
          signal.throwIfAborted()
          worker.postMessage({ buffer, name: file.name }, [buffer])
        })
        .catch((reason) => {
          finish()
          reject(reason)
        })
    })
  } finally {
    worker.terminate()
  }
}
