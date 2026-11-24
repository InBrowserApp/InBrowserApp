import type { StepModel } from "./step-data"

export async function loadStep(file: File, signal: AbortSignal) {
  if (!file.size) return null
  signal.throwIfAborted()
  const buffer = await file.arrayBuffer()
  signal.throwIfAborted()

  const worker = new Worker(new URL("./step.worker.ts", import.meta.url), {
    type: "module",
  })
  let abort: () => void
  return new Promise<StepModel | null>((resolve, reject) => {
    abort = () => reject(signal.reason)
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = (event: MessageEvent<StepModel | null | undefined>) => {
      if (event.data === undefined) reject(new Error("STEP reader failed"))
      else resolve(event.data)
    }
    worker.onmessageerror = () =>
      reject(new Error("Invalid STEP reader response"))
    worker.onerror = (event) => {
      event.preventDefault()
      reject(event.error ?? new Error(event.message))
    }
    worker.postMessage(buffer, [buffer])
  }).finally(() => {
    signal.removeEventListener("abort", abort)
    worker.terminate()
  })
}
