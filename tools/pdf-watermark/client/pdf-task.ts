import type { Request, Response } from "../workers/pdf.worker"

function runPdfTask(request: Request, signal: AbortSignal): Promise<Response> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error("aborted"))
      return
    }
    const worker = new Worker(
      new URL("../workers/pdf.worker.ts", import.meta.url),
      { type: "module" }
    )
    function cleanup() {
      worker.terminate()
      signal.removeEventListener("abort", abort)
    }
    function abort() {
      cleanup()
      reject(new Error("aborted"))
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onmessage = (event: MessageEvent<Response>) => {
      cleanup()
      if (event.data.ok) resolve(event.data)
      else reject(new Error(event.data.error))
    }
    worker.onerror = () => {
      cleanup()
      reject(
        new Error(request.type === "inspect" ? "readError" : "generateError")
      )
    }
    try {
      worker.postMessage(
        request,
        request.type === "inspect"
          ? [request.source]
          : [request.source, request.png]
      )
    } catch (error) {
      cleanup()
      reject(error)
    }
  })
}

export { runPdfTask }
