import type { CadFormat } from "./cad"
import type { CadModel } from "./cad-data"

export async function loadCadModel(
  file: File,
  format: CadFormat,
  signal: AbortSignal
) {
  if (!file.size) return null
  signal.throwIfAborted()
  const buffer = await file.arrayBuffer()
  signal.throwIfAborted()

  const worker = new Worker(new URL("./cad.worker.ts", import.meta.url), {
    type: "module",
  })
  let abort: () => void
  return new Promise<CadModel | null>((resolve, reject) => {
    abort = () => reject(signal.reason)
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = (event: MessageEvent<CadModel | null | undefined>) => {
      if (event.data === undefined) reject(new Error("CAD reader failed"))
      else resolve(event.data)
    }
    worker.onmessageerror = () =>
      reject(new Error("Invalid CAD reader response"))
    worker.onerror = (event) => {
      event.preventDefault()
      reject(event.error ?? new Error(event.message))
    }
    worker.postMessage({ buffer, format }, [buffer])
  }).finally(() => {
    signal.removeEventListener("abort", abort)
    worker.terminate()
  })
}
