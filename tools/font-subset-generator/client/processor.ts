import type { SubsetOutput, SubsetRequest } from "../types"
import type { WorkerResponse } from "../workers/subset.worker"

export async function processFont(
  file: File,
  options: Omit<SubsetRequest, "input">,
  signal: AbortSignal
) {
  const input = await file.arrayBuffer()
  signal.throwIfAborted()
  let worker: Worker
  try {
    worker = new Worker(
      new URL("../workers/subset.worker.ts", import.meta.url),
      { type: "module" }
    )
  } catch {
    throw new Error("WORKER_ERROR")
  }
  let onAbort: () => void
  try {
    return await new Promise<SubsetOutput>((resolve, reject) => {
      onAbort = () => reject(signal.reason)
      signal.addEventListener("abort", onAbort, { once: true })
      worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
        if (data.ok) resolve(data.result)
        else reject(new Error(data.error))
      }
      worker.onerror = () => reject(new Error("WORKER_ERROR"))
      worker.onmessageerror = () => reject(new Error("WORKER_ERROR"))
      worker.postMessage({ ...options, input } satisfies SubsetRequest, [input])
    })
  } finally {
    signal.removeEventListener("abort", onAbort!)
    worker.terminate()
  }
}
