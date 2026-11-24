import type { EngineRequest, EngineResult } from "./protocol"

export async function runEngine(
  request: EngineRequest,
  signal: AbortSignal
): Promise<EngineResult> {
  signal.throwIfAborted()
  const worker = new Worker(new URL("./engine.worker.ts", import.meta.url), {
    type: "module",
  })
  let cancel: (() => void) | undefined
  try {
    return await new Promise<EngineResult>((resolve, reject) => {
      cancel = () => reject(signal.reason)
      signal.addEventListener("abort", cancel, { once: true })
      worker.onmessage = (event: MessageEvent<EngineResult>) =>
        resolve(event.data)
      worker.onerror = worker.onmessageerror = () =>
        resolve({ status: "failed" })
      worker.postMessage(request, [request.bytes])
    })
  } finally {
    if (cancel) signal.removeEventListener("abort", cancel)
    worker.terminate()
  }
}
