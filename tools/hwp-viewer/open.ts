import { sanitizePage } from "./sanitize"
import type { Document, Reply, Request } from "./types"

export async function openDocument(
  file: File,
  signal: AbortSignal
): Promise<Document> {
  signal.throwIfAborted()
  const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  })
  const pending = new Map<
    number,
    { resolve: (reply: Reply) => void; reject: (error: Error) => void }
  >()
  let disposed = false
  let terminalError: Error = new DOMException("Aborted", "AbortError")
  let next = 0
  const dispose = () => {
    if (disposed) return
    disposed = true
    worker.terminate()
    signal.removeEventListener("abort", dispose)
    for (const request of pending.values()) request.reject(terminalError)
    pending.clear()
  }
  signal.addEventListener("abort", dispose, { once: true })
  worker.onmessage = (event: MessageEvent<Reply>) => {
    const response = event.data
    const request = pending.get(response.id)
    if (!request) return
    pending.delete(response.id)
    if ("error" in response) request.reject(new Error(response.error))
    else request.resolve(response)
  }
  const fail = () => {
    if (disposed) return
    terminalError = new Error("engineUnavailable")
    dispose()
  }
  worker.onerror = fail
  worker.onmessageerror = fail
  const send = (request: Request, transfer: Transferable[] = []) =>
    new Promise<Reply>((resolve, reject) => {
      if (disposed) {
        reject(terminalError)
        return
      }
      pending.set(request.id, { resolve, reject })
      worker.postMessage(request, transfer)
    })
  try {
    const buffer = await file.arrayBuffer()
    signal.throwIfAborted()
    const ready = await send({ id: next++, type: "open", buffer }, [buffer])
    if (
      !("total" in ready) ||
      !Number.isInteger(ready.total) ||
      ready.total <= 0
    )
      throw new Error("empty")
    return {
      total: ready.total,
      async page(index) {
        const reply = await send({ id: next++, type: "page", index })
        if (!("page" in reply)) throw new Error("pageError")
        return sanitizePage(reply.page)
      },
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  }
}
