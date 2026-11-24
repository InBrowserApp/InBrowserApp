import type { StepModel } from "./step-data"

export async function loadStep(file: File, signal: AbortSignal) {
  if (!file.size) return null
  const [buffer, { default: StepWorker }] = await Promise.all([
    file.arrayBuffer(),
    import("./step.worker?worker"),
  ])
  signal.throwIfAborted()
  const worker = new StepWorker()
  let abort: (() => void) | undefined
  try {
    return await new Promise<StepModel | null>((resolve, reject) => {
      abort = () => reject(signal.reason)
      signal.addEventListener("abort", abort, { once: true })
      worker.onmessage = (
        event: MessageEvent<StepModel | null | undefined>
      ) => {
        if (event.data === undefined) reject(new Error("STEP reader failed"))
        else resolve(event.data)
      }
      worker.onerror = (event) => {
        event.preventDefault()
        reject(event.error ?? new Error(event.message))
      }
      worker.postMessage(buffer, [buffer])
    })
  } finally {
    if (abort) signal.removeEventListener("abort", abort)
    worker.terminate()
  }
}
