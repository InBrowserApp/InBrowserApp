import { ConversionError, failure } from "./errors"
import type { Reply, Progress } from "../runtime/types"

export type Result = { pdf: Blob; pages: number }

export async function convert(
  file: File,
  signal: AbortSignal,
  progress: (value: Progress) => void
): Promise<Result> {
  signal.throwIfAborted()
  if (
    !globalThis.crossOriginIsolated ||
    typeof SharedArrayBuffer === "undefined"
  )
    throw new ConversionError("engineUnavailable")
  const bytes = await file.arrayBuffer()
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    let worker: Worker | undefined
    let finished = false
    const finish = (error?: unknown, result?: Result) => {
      if (finished) return
      finished = true
      worker?.terminate()
      signal.removeEventListener("abort", abort)
      if (error) reject(error)
      else resolve(result!)
    }
    const abort = () => finish(signal.reason)
    try {
      worker = new Worker(
        new URL("../runtime/office-worker.ts", import.meta.url),
        { type: "module" }
      )
      signal.addEventListener("abort", abort, { once: true })
      worker.onmessage = ({ data }: MessageEvent<Reply>) => {
        if (finished || signal.aborted) return
        if (data.type === "progress") progress(data.stage)
        else if (data.type === "error") finish(new ConversionError(data.code))
        else
          finish(undefined, {
            pdf: new Blob([data.bytes], { type: "application/pdf" }),
            pages: data.pages,
          })
      }
      worker.onerror = () => finish(new ConversionError("engineUnavailable"))
      worker.onmessageerror = () =>
        finish(new ConversionError("engineUnavailable"))
      worker.postMessage(bytes, [bytes])
    } catch (error) {
      finish(failure(error))
    }
  })
}
