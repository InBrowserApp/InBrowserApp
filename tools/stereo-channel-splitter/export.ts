import type { ExportRequest, ExportResponse } from "./workers/export"
import type { ChannelFiles } from "./core/formats"

export function encodeDownloads(request: ExportRequest, signal: AbortSignal) {
  return new Promise<ChannelFiles>((resolve, reject) => {
    signal.throwIfAborted()
    const worker = new Worker(new URL("./workers/export.ts", import.meta.url), {
      type: "module",
    })
    const dispose = () => {
      worker.terminate()
      signal.removeEventListener("abort", abort)
    }
    const abort = () => {
      dispose()
      reject(signal.reason)
    }
    const fail = () => {
      dispose()
      reject(new Error("Audio export failed"))
    }
    worker.onerror = fail
    worker.onmessageerror = fail
    worker.onmessage = ({ data }: MessageEvent<ExportResponse>) => {
      if ("error" in data) return fail()
      dispose()
      resolve(data)
    }
    signal.addEventListener("abort", abort)
    worker.postMessage(request)
  })
}
