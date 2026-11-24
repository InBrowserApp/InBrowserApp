import { ConversionError, conversionFailure } from "./errors"
import type { PdfResult, Progress, Response } from "./pdf-types"

export function preparePdf(
  file: File,
  signal: AbortSignal,
  progress: (value: Progress) => void
): Promise<PdfResult> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    let worker: Worker | undefined
    let finished = false
    function close() {
      finished = true
      worker?.terminate()
      signal.removeEventListener("abort", abort)
    }
    function abort() {
      close()
      reject(signal.reason)
    }
    function unavailable(reason: unknown) {
      close()
      reject(
        new ConversionError({
          code:
            conversionFailure(reason).code === "resourceLimit"
              ? "resourceLimit"
              : "engineUnavailable",
        })
      )
    }
    try {
      worker = new Worker(new URL("./pdf-worker.ts", import.meta.url), {
        type: "module",
      })
      signal.addEventListener("abort", abort, { once: true })
      worker.onerror = (event) => {
        event.preventDefault()
        unavailable(new Error(event.message))
      }
      worker.onmessageerror = () => unavailable(new Error("Worker message"))
      worker.onmessage = ({ data }: MessageEvent<Response>) => {
        if (finished) return
        if (data.type === "progress") progress(data.progress)
        else {
          close()
          if (data.type === "result") resolve(data.result)
          else reject(new ConversionError(data.error))
        }
      }
      worker.postMessage(file)
    } catch (reason) {
      unavailable(reason)
    }
  })
}
