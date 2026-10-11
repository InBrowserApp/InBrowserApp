import { prepareSvg, validateResources } from "../prepare-svg"
import type { Reply, Request } from "../protocol"
export type Result = { pdf: Blob; pages: number }
export type Progress =
  | { stage: "engineLoading" | "saving" }
  | { stage: "converting"; page: number; total: number }

export async function convert(
  file: File,
  signal: AbortSignal,
  progress: (value: Progress) => void
): Promise<Result> {
  signal.throwIfAborted()
  const bytes = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  let worker: Worker
  try {
    worker = new Worker(new URL("../worker.ts", import.meta.url), {
      type: "module",
    })
  } catch (cause) {
    throw new Error("engineUnavailable", { cause })
  }
  return new Promise<Result>((resolve, reject) => {
    let settled = false
    const controller = new AbortController()
    const finish = (reason?: unknown, result?: Result) => {
      if (settled) return
      settled = true
      controller.abort(reason)
      signal.removeEventListener("abort", abort)
      worker.terminate()
      worker.onmessage = worker.onerror = worker.onmessageerror = null
      if (reason) reject(reason)
      else resolve(result!)
    }
    const abort = () => finish(signal.reason)
    const send = (request: Request) => {
      if (!settled) worker.postMessage(request)
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onerror = worker.onmessageerror = () =>
      finish(new Error("engineUnavailable"))
    worker.onmessage = (event: MessageEvent<Reply>) => {
      const reply = event.data
      void (async () => {
        signal.throwIfAborted()
        if (reply.type === "error")
          throw Object.assign(new Error(reply.code), { page: reply.page })
        if (reply.type === "result")
          return finish(undefined, {
            pdf: new Blob([new Uint8Array(reply.bytes)], {
              type: "application/pdf",
            }),
            pages: reply.pages,
          })
        if (reply.type === "progress") return progress(reply)
        if (reply.type === "resources") {
          await validateResources(reply.resources, controller.signal)
          signal.throwIfAborted()
          send({ type: "continue" })
        } else {
          progress({
            stage: "converting",
            page: reply.page,
            total: reply.total,
          })
          try {
            const svg = await prepareSvg(reply.svg, controller.signal)
            signal.throwIfAborted()
            send({ type: "continue", svg })
          } catch (reason) {
            throw Object.assign(
              reason instanceof Error ? reason : new Error("unsupported"),
              { page: reply.page }
            )
          }
        }
      })().catch(finish)
    }
    try {
      worker.postMessage({ type: "open", bytes } satisfies Request, [
        bytes.buffer,
      ])
    } catch (reason) {
      finish(reason)
    }
  })
}
